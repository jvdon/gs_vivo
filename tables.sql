CREATE TABLE IF NOT EXISTS APIs (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    produto TEXT NOT NULL,
    banco TEXT NOT NULL
)