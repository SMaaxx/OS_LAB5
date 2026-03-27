-- Создаём таблицу ВСЕГДА, даже если БД уже инициализирована
CREATE TABLE IF NOT EXISTS records (
                                       id SERIAL PRIMARY KEY,
                                       user_id BIGINT NOT NULL,
                                       username VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Логируем успех
DO $$
BEGIN
  RAISE NOTICE 'Таблица records создана или уже существует';
END $$;