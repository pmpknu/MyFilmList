BEGIN;

CREATE EXTENSION pg_trgm;
CREATE EXTENSION btree_gin;

CREATE TYPE roles AS ENUM ('ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(63) NOT NULL UNIQUE,
  email VARCHAR(127) NOT NULL UNIQUE,
  password VARCHAR(127) NOT NULL,
  bio TEXT,
  photo VARCHAR(255)
);

CREATE TABLE watch_lists (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(127) NOT NULL,
  photo VARCHAR(255),
  visibility BOOLEAN NOT NULL DEFAULT TRUE,
  viewed_counter INT NOT NULL DEFAULT 0,
  UNIQUE(name, user_id)
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(127) NOT NULL,
  description TEXT,
  poster VARCHAR(255),
  release_date DATE,
  duration INT,
  rating FLOAT,
  categories VARCHAR(127),
  tags VARCHAR(127),
  production_country VARCHAR(63),
  genres VARCHAR(127),
  actors TEXT,
  director VARCHAR(127),
  seasons INT CHECK (seasons IS NULL OR seasons >= 0),
  series INT CHECK (series IS NULL OR series >= 0)
);

CREATE TABLE movie_watch_lists (
  movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  watchlist_id INT NOT NULL REFERENCES watch_lists(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, watchlist_id)
);

CREATE TABLE movie_views (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  watch_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, movie_id)
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  value INT NOT NULL CHECK (value >= 1 AND value <= 10),
  UNIQUE (user_id, movie_id)
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  text TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 10),
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  viewed_counter INT NOT NULL DEFAULT 0,
  UNIQUE(user_id, movie_id)
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  review_id     INT REFERENCES reviews(id) ON DELETE CASCADE,
  movie_id      INT REFERENCES movies(id) ON DELETE CASCADE,
  watchlist_id  INT REFERENCES watch_lists(id) ON DELETE CASCADE,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  text TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT chk_comment_subject_nn CHECK (review_id IS NOT NULL OR movie_id IS NOT NULL OR watchlist_id IS NOT NULL)
);

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  review_id   INT REFERENCES reviews(id) ON DELETE RESTRICT,
  comment_id  INT REFERENCES comments(id) ON DELETE RESTRICT,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolver_id INT REFERENCES users(id) ON DELETE SET NULL,
  issue VARCHAR(127) NOT NULL,
  text TEXT,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_report_subject_nn CHECK (review_id IS NOT NULL OR comment_id IS NOT NULL)
);

CREATE TABLE password_changes (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role roles NOT NULL,
  UNIQUE(user_id, role)
);


---- Индексы для оптимизации поиска и выборок

-- Изначально создаем приватные списки к просмотру
CREATE INDEX idx_watchlist_visibility ON watch_lists(visibility) WHERE visibility IS FALSE;

-- Очень часто читаем, редко пишем
CREATE INDEX idx_movie_title  ON movies USING GIN ((to_tsvector('russian', title)   || to_tsvector('english', title)));
CREATE INDEX idx_movie_genres ON movies USING GIN ((to_tsvector('russian', genres)  || to_tsvector('english', genres)));
CREATE INDEX idx_movie_tags   ON movies USING GIN ((to_tsvector('russian', tags)    || to_tsvector('english', tags)));
CREATE INDEX idx_movie_production_country ON movies(production_country);
CREATE INDEX idx_movie_director ON movies(director);
CREATE INDEX idx_movie_release_date ON movies(release_date);

-- Показываем ревью как на странице пользователя, так и на странице фильма
CREATE INDEX idx_review_visible ON reviews(visible) WHERE visible IS FALSE;

-- Показываем ревью на странице фильма
CREATE INDEX idx_comment_visible ON comments(visible) WHERE visible IS FALSE;

-- При смене пароля ищем password_changes по токену из ссылки
CREATE INDEX idx_password_change_token ON password_changes(token);
CREATE INDEX idx_password_change_date ON password_changes(date);


---- Триггеры

-- Удалять токен пароля после 7 дней
CREATE OR REPLACE FUNCTION cleanup_password_tokens()
  RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM password_changes WHERE date < CURRENT_TIMESTAMP - INTERVAL '7 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_tokens
  AFTER INSERT OR UPDATE ON password_changes
  FOR EACH ROW
EXECUTE FUNCTION cleanup_password_tokens();

-- Обновление рейтинга фильма
CREATE OR REPLACE FUNCTION update_movie_rating()
  RETURNS TRIGGER AS $$
BEGIN
  UPDATE movies
  SET rating = (
    SELECT AVG(value)::NUMERIC(4, 2)
    FROM ratings
    WHERE movie_id = NEW.movie_id
  )
  WHERE id = NEW.movie_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recalculate_movie_rating
  AFTER INSERT OR UPDATE OR DELETE ON ratings
  FOR EACH ROW
EXECUTE FUNCTION update_movie_rating();

COMMIT;
