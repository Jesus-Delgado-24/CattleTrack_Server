const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const mysql = require('mysql2');

router.get('/',async (req, res) => {
    try{
        const [rows] = await pool.query('CALL sp_Get_Veterinarios()');
        const users = rows[0];
        res.status(200).json({
            success: true,
            data: users
        });
    }catch(error){
        console.error('Error al traer los veterinarios: ', error);
        process.exit(1);
    }
});

module.exports = router;