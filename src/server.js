require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(cors());

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Erro de conexão com o banco de dados:', err.stack);
    }
    console.log('Conectado ao banco de dados');
    release();
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

app.post('/produtos', async (req, res) => {
    const { nome, preco, estoque } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO produto (nome, preco, estoque) VALUES ($1, $2, $3) RETURNING *',
            [nome, preco, estoque]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar o produto' });
    }
});

app.get('/produtos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produto');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar os produtos' });
    }
});

app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM produto WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar o produto' });
    }
});

app.put('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, preco, estoque } = req.body;
    try {
        const result = await pool.query(
            'UPDATE produto SET nome = $1, preco = $2, estoque = $3 WHERE id = $4 RETURNING *',
            [nome, preco, estoque, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar o produto' });
    }
});

app.delete('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM produto WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir o produto' });
    }
});
