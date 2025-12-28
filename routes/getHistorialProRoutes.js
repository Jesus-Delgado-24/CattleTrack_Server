const express = require('express');
const router = express.Router();
const HistorialRepro = require('../models/HistorialRepro');

router.get('/', async (req, res) =>{
    try{
        const historial = await HistorialRepro.find();
        res.status(200).json({
            success:true,
            data: historial
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