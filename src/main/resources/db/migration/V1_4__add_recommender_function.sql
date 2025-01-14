BEGIN;

CREATE OR REPLACE FUNCTION recommend_movies(
  current_user_id INT,
  _limit INT DEFAULT 20,
  _offset INT DEFAULT 0
)
  RETURNS TABLE(
                 id INT,
                 title VARCHAR,
                 description TEXT,
                 poster VARCHAR,
                 release_date DATE,
                 duration INT,
                 rating FLOAT,
                 categories VARCHAR,
                 tags VARCHAR,
                 production_country VARCHAR,
                 genres VARCHAR,
                 actors TEXT,
                 director VARCHAR,
                 seasons INT,
                 series INT,
                 viewed_counter INT,
                 rated_counter INT,
                 reviewed_counter INT,
                 comments_counter INT,
                 score DOUBLE PRECISION
               ) AS $$
  DECLARE
    average_release_year NUMERIC;
    viewed_genres TEXT[];
    viewed_tags TEXT[];
    total_movies INT;

  BEGIN
  -- Вычисляем средний год выхода фильмов, которые смотрит пользователь
  SELECT AVG(EXTRACT(YEAR FROM m.release_date)) INTO average_release_year
  FROM movies m
         JOIN movie_views mv ON mv.movie_id = m.id
  WHERE mv.user_id = current_user_id;

  -- Получаем жанры просмотренных фильмов
  SELECT ARRAY_AGG(DISTINCT genre) INTO viewed_genres
  FROM movies m
         CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(m.genres, ',')) AS genre
  WHERE m.id IN (SELECT mv.movie_id FROM movie_views mv WHERE mv.user_id = current_user_id);

  -- Получаем теги просмотренных фильмов
  SELECT ARRAY_AGG(DISTINCT tag) INTO viewed_tags
  FROM movies m
         CROSS JOIN LATERAL UNNEST(STRING_TO_ARRAY(m.tags, ',')) AS tag
  WHERE m.id IN (SELECT mv.movie_id FROM movie_views mv WHERE mv.user_id = current_user_id);

  -- Получаем общее количество фильмов в базе для расчета IDF
  SELECT COUNT(*) INTO total_movies FROM movies;

  RETURN QUERY
    SELECT
      m.id,
      m.title,
      m.description,
      m.poster,
      m.release_date,
      m.duration,
      m.rating,
      m.categories,
      m.tags,
      m.production_country,
      m.genres,
      m.actors,
      m.director,
      m.seasons,
      m.series,
      m.viewed_counter,
      m.rated_counter,
      m.reviewed_counter,
      m.comments_counter,
      (
        -- Базовая оценка
        (
          1 +

          -- Баллы за совпадение жанров
          COALESCE(
            (SELECT COUNT(*) * 0.3
             FROM regexp_split_to_table(m.genres, ',') AS g
             WHERE g = ANY(viewed_genres)), 0.0
          ) +

          -- Баллы за совпадение жанров с TF-IDF
          COALESCE(
            (SELECT SUM(tfidf_score) FROM (
              SELECT g AS genre,
                     COUNT(*) AS genre_count,
                     (1.0 * COUNT(*) / NULLIF(total_movies, 0)) AS tf,
                     LOG(NULLIF(total_movies, 0) / NULLIF(COUNT(DISTINCT m2.id), 0)) AS idf,
                     (1.0 * COUNT(*) / NULLIF(total_movies, 0)) * LOG(NULLIF(total_movies, 0) / NULLIF(COUNT(DISTINCT m2.id), 0)) * 3.0 AS tfidf_score
              FROM regexp_split_to_table(m.genres, ',') AS g
                     JOIN movies m2 ON g = ANY(STRING_TO_ARRAY(m2.genres, ','))
              WHERE g = ANY(viewed_genres)
              GROUP BY g
            ) AS genre_scores), 0.0
          ) +

          -- Баллы за совпадение тегов
          COALESCE(
            (SELECT COUNT(*) * 0.2
             FROM regexp_split_to_table(m.tags, ',') AS t
             WHERE t = ANY(viewed_tags)), 0.0
          ) +

          -- Баллы за совпадение тегов с TF-IDF
          COALESCE(
            (SELECT SUM(tfidf_score) FROM (
              SELECT t AS tag,
                     COUNT(*) AS tag_count,
                     (1.0 * COUNT(*) / NULLIF(total_movies, 0)) AS tf,
                     LOG(NULLIF(total_movies, 0) / NULLIF(COUNT(DISTINCT m2.id), 0)) AS idf,
                     (1.0 * COUNT(*) / NULLIF(total_movies, 0)) * LOG(NULLIF(total_movies, 0) / NULLIF(COUNT(DISTINCT m2.id), 0)) * 2.0 AS tfidf_score
              FROM regexp_split_to_table(m.tags, ',') AS t
                     JOIN movies m2 ON t = ANY(STRING_TO_ARRAY(m2.tags, ','))
              WHERE t = ANY(viewed_tags)
              GROUP BY t
            ) AS tag_scores), 0.0
          ) +

          -- Баллы за популярность
          COALESCE(m.viewed_counter, 0.0) * 1.5 +
          COALESCE(m.rated_counter, 0.0) * 1.0 +
          COALESCE(m.reviewed_counter, 0.0) * 2.0 +
          COALESCE(m.comments_counter, 0.0) * 0.5
        ) *

        -- Множитель для новых фильмов
        CASE
          WHEN EXTRACT(YEAR FROM m.release_date) >= EXTRACT(YEAR FROM CURRENT_DATE) - 2
            THEN 1.2
            ELSE 1.0
        END *

        -- Множитель баллов, если год выхода фильма в пределах ±5 лет от среднего года просмотров пользователя
        CASE
          WHEN average_release_year IS NOT NULL AND
               EXTRACT(YEAR FROM m.release_date) BETWEEN (average_release_year - 5) AND (average_release_year + 5)
            THEN 1.3
            ELSE 1.0
        END *

        -- Множитель для наличия постера
        CASE
          WHEN m.poster IS NOT NULL AND m.poster <> ''
            THEN 1.5
            ELSE 1.0
        END *

        -- Множитель для наличия описания
        CASE
          WHEN m.description IS NOT NULL AND m.description <> ''
            THEN 1.0
            ELSE 0.7
        END *

        -- Множитель для российских фильмов
          -- (создание приложения проспонсировано Фондом Кино)
        CASE
          WHEN m.production_country IS NOT NULL
                 AND (
                   m.production_country ILIKE '%Россия%'
                     OR m.production_country ILIKE '%РФ%'
                     OR m.production_country ILIKE '%russia%'
                  )
            THEN 2 -- to do: increase to 1000 in production
          ELSE 1.0
        END *

          -- Множитель для высоко оцененных фильмов
        CASE
          WHEN m.rating IS NOT NULL AND m.rating > 7.0
            THEN 1.5
          ELSE 1.0
        END *

          -- Множитель для наличия актеров и режиссера
        CASE
          WHEN (m.actors IS NOT NULL AND m.actors <> '') AND (m.director IS NOT NULL AND m.director <> '')
            THEN 1.2
            ELSE 1.0
        END *

        -- Учет времени просмотра
        CASE
          -- Просмотр вечером
          WHEN EXTRACT(HOUR FROM CURRENT_TIME) BETWEEN 18 AND 23 THEN
            CASE
              WHEN m.genres ILIKE '%action%' THEN 1.5
              WHEN m.genres ILIKE '%comedy%' THEN 1.3
              WHEN m.genres ILIKE '%thriller%' THEN 1.2
              WHEN m.tags ILIKE '%evening%' THEN 1.1
              ELSE 1.0
            END
          -- Просмотр новью
          WHEN EXTRACT(HOUR FROM CURRENT_TIME) BETWEEN 23 AND 3 THEN
            CASE
              WHEN m.genres ILIKE '%horror%' THEN 0.8
              WHEN m.tags ILIKE '%night%' THEN 1.1
              ELSE 1.0
              END
          ELSE 1.0
        END *

        -- Множитель для сезонных предпочтений
        CASE
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) IN (12, 1, 2)
                 AND (
                   m.genres ILIKE '%christmas%'
                     OR m.tags ILIKE '%christmas%'
                     OR m.tags ILIKE '%рождество%'
                     OR m.tags ILIKE '%winter%'
                     OR m.tags ILIKE '%зима%'
                     OR m.tags ILIKE '%new year%'
                     OR m.tags ILIKE '%новый год%'
                 )
            THEN 2.5
          WHEN EXTRACT(MONTH FROM CURRENT_DATE) IN (6, 7, 8)
                 AND (
                   m.tags ILIKE '%summer%'
                     OR m.tags ILIKE '%лето%'
                  )
            THEN 2.5
          ELSE 1.0
        END *

        -- Множитель для текущих трендов
          -- Будем учитывать текущие тренды,
          -- основываясь на популярных фильмах,
          -- которые смотрят другие пользователи.
        CASE
          WHEN m.id IN (
            SELECT movie_id
            FROM movie_views
            GROUP BY movie_id
            ORDER BY COUNT(*) DESC
            LIMIT 10
          )
            THEN 1.2
          ELSE 1.0
        END *

        -- Множитель на основе рейтинга
        CASE
          -- Учет пользовательских оценок с учетом количества оценок и жанров
          WHEN (SELECT COUNT(*)
                FROM ratings
                WHERE user_id = current_user_id) > 5 THEN
            CASE
              WHEN (SELECT AVG(r.value)
                    FROM ratings r
                    WHERE r.user_id = current_user_id
                      AND r.movie_id IN (
                        SELECT movie_id
                        FROM movies
                        WHERE m.genres ILIKE ANY(viewed_genres)
                    )) >= 4.0 THEN 1.3 -- Если средний рейтинг >= 4.0, множитель 1.3
              WHEN (SELECT AVG(r.value)
                    FROM ratings r
                    WHERE r.user_id = current_user_id
                      AND r.movie_id IN (
                        SELECT movie_id
                        FROM movies
                        WHERE m.genres ILIKE '%action%'
                    )) >= 6.0 THEN 1.4 -- Множитель для Action
              WHEN (SELECT AVG(r.value)
                    FROM ratings r
                    WHERE r.user_id = current_user_id
                      AND r.movie_id IN (
                        SELECT movie_id
                        FROM movies
                        WHERE m.genres ILIKE '%comedy%'
                    )) >= 6.0 THEN 1.2 -- Множитель для Comedy
              ELSE 1.0 -- В противном случае, множитель 1.0
              END
          ELSE 1.0 -- Если меньше 5 оценок, множитель 1.0
          END
        ) AS score
    FROM movies m
    WHERE m.id NOT IN (
      -- Исключаем фильмы, которые пользователь уже смотрел
      SELECT movie_id FROM movie_views WHERE user_id = current_user_id
    )
    ORDER BY score DESC
    LIMIT _limit OFFSET _offset;
END;
$$ LANGUAGE plpgsql;

COMMIT;
