BEGIN;

CREATE OR REPLACE FUNCTION recommend_watch_lists(
  current_user_id INT,
  _limit INT DEFAULT 20,
  _offset INT DEFAULT 0
)
  RETURNS TABLE(
                 id INT,
                 user_id INT,
                 name VARCHAR,
                 photo VARCHAR,
                 visibility BOOLEAN,
                 viewed_counter INT,
                 score DOUBLE PRECISION
               ) AS $$
  DECLARE
    total_watchlists INT;
    preferred_genres TEXT[];
    preferred_tags TEXT[];

  BEGIN
  -- Получить общее количество списков просмотра
  SELECT COUNT(*) INTO total_watchlists FROM watch_lists wl WHERE wl.visibility = TRUE;

  -- Получаем жанры просмотренных фильмов
  SELECT ARRAY_AGG(DISTINCT genre) INTO preferred_genres
  FROM movies m
         CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(m.genres, ',')) AS genre
  WHERE m.id IN (SELECT mv.movie_id FROM movie_views mv WHERE mv.user_id = current_user_id);

  -- Получаем теги просмотренных фильмов
  SELECT ARRAY_AGG(DISTINCT tag) INTO preferred_tags
  FROM movies m
         CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(m.tags, ',')) AS tag
  WHERE m.id IN (SELECT mv.movie_id FROM movie_views mv WHERE mv.user_id = current_user_id);

  -- Рекомендовать списки просмотра
  RETURN QUERY

    WITH tf_idf AS (
      SELECT
        wl.id AS watchlist_id,
        g.genre,
        COUNT(mwl.movie_id) AS tf_genre,
        LOG(total_watchlists::FLOAT / NULLIF(COUNT(DISTINCT wl.id), 0) + 1) AS idf_genre,
        t.tag,
        COUNT(mwl.movie_id) AS tf_tag,
        LOG(total_watchlists::FLOAT / NULLIF(COUNT(DISTINCT wl.id), 0) + 1) AS idf_tag
      FROM watch_lists wl
             LEFT JOIN movie_watch_lists mwl ON wl.id = mwl.watchlist_id
             LEFT JOIN movies m ON mwl.movie_id = m.id
             LEFT JOIN LATERAL UNNEST(STRING_TO_ARRAY(m.genres, ',')) AS g(genre) ON TRUE
             LEFT JOIN LATERAL UNNEST(STRING_TO_ARRAY(m.tags, ',')) AS t(tag) ON TRUE
      WHERE wl.visibility = TRUE
      GROUP BY wl.id, g.genre, t.tag
    ),
    genre_scores AS (
     SELECT
       watchlist_id,
       SUM(tf_genre * idf_genre) AS genre_score
     FROM tf_idf
     WHERE genre IS NOT NULL
     GROUP BY watchlist_id
   ),
   tag_scores AS (
     SELECT
       watchlist_id,
       SUM(tf_tag * idf_tag) AS tag_score
     FROM tf_idf
     WHERE tag IS NOT NULL
     GROUP BY watchlist_id
   ),
   match_counts AS (
     SELECT
       wl.id AS watchlist_id,
       COALESCE(SUM(CASE WHEN g.genre = ANY(preferred_genres) THEN 1 ELSE 0 END), 0) AS genre_match_count,
       COALESCE(SUM(CASE WHEN t.tag = ANY(preferred_tags) THEN 1 ELSE 0 END), 0) AS tag_match_count
     FROM watch_lists wl
            LEFT JOIN movie_watch_lists mwl ON wl.id = mwl.watchlist_id
            LEFT JOIN movies m ON mwl.movie_id = m.id
            LEFT JOIN LATERAL UNNEST(STRING_TO_ARRAY(m.genres, ',')) AS g(genre) ON TRUE
            LEFT JOIN LATERAL UNNEST(STRING_TO_ARRAY(m.tags, ',')) AS t(tag) ON TRUE
     WHERE wl.visibility = TRUE
     GROUP BY wl.id
   ),
   authority_scores AS (
     SELECT
       wl.user_id,
       -- Определяем авторитетность на основе различных факторов
       COUNT(DISTINCT wl.id) * 0.1 +  -- Количество созданных списков
        SUM(wl.viewed_counter) * 0.02  -- Общее количество просмотров
         AS authority_score
     FROM watch_lists wl
     GROUP BY wl.user_id
   )

    SELECT
      wl.id,
      wl.user_id,
      wl.name,
      wl.photo,
      wl.visibility,
      wl.viewed_counter,
      (
        -- Базовая оценка
        (
          1 +

          -- Баллы за TF-IDF для совпадения жанров
          COALESCE(gs.genre_score, 0) +

          -- Баллы за TF-IDF для совпадения тегов
          COALESCE(ts.tag_score, 0) +

          -- Популярность списка
          COALESCE(wl.viewed_counter, 0.0) * 0.5 +

          -- Учет предпочтений пользователя на основе количества совпадений
          COALESCE(mc.genre_match_count, 0) * 2.0 +  -- Увеличиваем вес на основе количества совпадений по жанрам

          COALESCE(mc.tag_match_count, 0) * 1.5  -- Увеличиваем вес на основе количества совпадений по тегам
          ) *

        -- Множитель для наличия постера
        CASE
          WHEN wl.photo IS NOT NULL AND wl.photo <> ''
            THEN 2.0
          ELSE 1.0
        END *

        -- Учет авторитета создателя
        CASE
          WHEN aus.authority_score IS NOT NULL AND aus.authority_score > 0
            THEN (1.0 + 0.1 * aus.authority_score)
          ELSE 1.0
        END
        ) AS score

    FROM watch_lists wl
           LEFT JOIN genre_scores gs ON wl.id = gs.watchlist_id
           LEFT JOIN tag_scores ts ON wl.id = ts.watchlist_id
           LEFT JOIN match_counts mc ON wl.id = mc.watchlist_id
           LEFT JOIN authority_scores aus ON wl.user_id = aus.user_id

    WHERE (current_user_id IS NULL OR wl.user_id != current_user_id) -- Исключить свои списки
      AND wl.visibility = TRUE -- Только публичные списки

    GROUP BY
      wl.id,
      gs.genre_score,
      ts.tag_score,
      mc.genre_match_count,
      mc.tag_match_count,
      aus.authority_score

    ORDER BY score DESC, RANDOM() -- Сначала по score, затем случайно для одинаковых score
    LIMIT _limit OFFSET _offset;
END;
$$ LANGUAGE plpgsql;

COMMIT;
