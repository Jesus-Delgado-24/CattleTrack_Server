const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const mysql = require('mysql2');

router.get('/',async (req, res) => {
    try{
        const { id, tipo } = req.query;
        const [rows] = await pool.query('CALL sp_Get_Ganado(?, ?)',[id, tipo]);
        const users = rows[0];
        res.status(200).json({
            success: true,
            data: users
        });
    }catch(error){
        console.error('Error al traer el ganado: ', error);
        process.exit(1);
    }
});

module.exports = router;