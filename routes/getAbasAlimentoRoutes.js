const express = require('express');
const router = express.Router();
const Abastecer = require('../models/Abastecer');
const { pool } = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const { id, tipo } = req.query;

        if (!id || !tipo) {
            return res.status(400).json({ error: 'Los parámetros id y tipo son requeridos' });
        }

        let abastece;
        
        if (tipo == 1 || tipo == 2 || tipo == 3) {
            abastece = await Abastecer.find();
        } else {
            const [result] = await pool.query('SELECT id_Sector FROM veterinario WHERE id_Usuario = ?', [id]);
            
            if (!result || result.length === 0) {
                return res.status(404).json({ error: 'Veterinario no encontrado' });
            }
            
            const id_sector = result[0].id_Sector;
            abastece = await Abastecer.find({ id_Sector: id_sector });
        }

        res.json({ 
            success: true,
            count: abastece.length,
            data: abastece 
        });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

module.exports = router;