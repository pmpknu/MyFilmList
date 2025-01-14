BEGIN;

CREATE OR REPLACE FUNCTION recommend_movies(
  current_user_id INT,
  _limit INT DEFAULT 10,
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
                 watchlist_counter INT,
                 score NUMERIC
               ) AS $$
BEGIN
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
      (
        -- Баллы за совпадение жанров
        COALESCE(
          (SELECT COUNT(*) * 3
           FROM regexp_split_to_table(m.genres, ',') AS g
           WHERE g IN (
             SELECT DISTINCT UNNEST(STRING_TO_ARRAY(watched.genres, ','))
             FROM movies watched
                    JOIN movie_views mv ON mv.movie_id = watched.id
             WHERE mv.user_id = current_user_id
           )), 0
        ) +
          -- Баллы за совпадение тегов
        COALESCE(
          (SELECT COUNT(*) * 2
           FROM regexp_split_to_table(m.tags, ',') AS t
           WHERE t IN (
             SELECT DISTINCT UNNEST(STRING_TO_ARRAY(watched.tags, ','))
             FROM movies watched
                    JOIN movie_views mv ON mv.movie_id = watched.id
             WHERE mv.user_id = current_user_id
           )), 0
        ) +
          -- Баллы за популярность
        COALESCE(m.viewed_counter, 0) * 0.5 +
        COALESCE(m.rated_counter, 0) * 1 +
        COALESCE(m.reviewed_counter, 0) * 1
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
