const express = require('express');
const router = express.Router();
const Monitoreo = require('../models/monitoringModel');
const { pool } = require('../config/database');

router.get('/', async (req, res) =>{
    try{
        const {id, tipo} = req.query;

        if (!id || !tipo) {
            return res.status(400).json({ error: 'Los parámetros id y tipo son requeridos' });
        }

        let monitoreo;

        if (tipo == 1 || tipo == 2) {
            monitoreo = await Monitoreo.find();
        } else {                    
            monitoreo = await Monitoreo.find({ id_Veterinario: id });
        }
        
        res.json({ 
            success: true,
            count: monitoreo.length,
            data: monitoreo 
        });
    }catch(error){
        console.error("Error:", error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

module.exports = router;