const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

router.get('/',async (req, res) => {
    try{
        const [rows] = await pool.query('CALL sp_Get_Usuarios()');
        const users = rows[0];
        res.status(200).json({
            success: true,
            data: users
        });
    }catch(error){
        console.error('Error al traer los usuarios: ', error);
        process.exit(1);
    }
});

module.exports = router;