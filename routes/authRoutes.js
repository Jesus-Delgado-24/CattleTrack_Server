const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    try{
        const { email, password } = req.query;
        const [rows] = await pool.query('SELECT * FROM Usuario WHERE email = ?',[email]);

        const user=rows[0];

        if(!user || !(await bcrypt.compare(password, user.Contraseña))){
            return res.status(401).json({ message: 'Credenciales inválidas'});
        }

        const tipoU = user.Tipo_U;
        const IdU = user.id_Usuario;

        res.status(200).json({
            message: 'Login exitoso',
            idUsuario: IdU,
            tipoUsuario: tipoU
        });

    }catch(error){
        console.error('Error en el login: ', error);
        res.status(500).json({ message: 'Error en el servidor'});
    }
});

module.exports=router;