const { Pool } = require('pg');

const pool = new Pool({
    user: '',       // Usuário do PostgreSQL
    host: 'localhost',         // Endereço do servidor
    database: 'produto_db',       // Nome do banco de dados
    password: '',     // Senha do usuário
    port: 5432,                // Porta padrão do PostgreSQL
});

module.exports = pool;
