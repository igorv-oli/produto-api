-- CREATE DATABASE produto_db;

CREATE TABLE produto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    preco FLOAT,
    -- data DATA,
    estoque INT
);
