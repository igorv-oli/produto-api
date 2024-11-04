const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Rota de Create - Adicionar novo usuário
app.post('/users', async (req, res) => {
    const { name, email, age } = req.body;
    try {
        const newUser = await pool.query(
            'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
            [name, email, age]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao adicionar usuário');
    }
});

// Rota de Read - Obter todos os usuários
app.get('/users', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.status(200).json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao obter usuários');
    }
});

// Rota de Read - Obter usuário por ID
app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.status(200).json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao obter usuário');
    }
});

// Rota de Update - Atualizar usuário
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    try {
        const updatedUser = await pool.query(
            'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *',
            [name, email, age, id]
        );
        if (updatedUser.rows.length === 0) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.status(200).json(updatedUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao atualizar usuário');
    }
});

// Rota de Delete - Excluir usuário
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (deletedUser.rows.length === 0) {
            return res.status(404).send('Usuário não encontrado');
        }
        res.status(200).send('Usuário excluído com sucesso');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro ao excluir usuário');
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
