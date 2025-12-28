const express = require('express');
const router = express.Router();
const db = require('../config/database').pool;
const Historial = require('../models/HistorialRepro');
const { ObjectId } = require('mongodb'); // Asegúrate de tener esta importación

router.post('', async (req, res) => {
    try {
      const {
        id_Vaca, id_Toro,
        Fecha_Gestion, Fecha_Nacimiento,
        Crias_Hembras, Crias_Macho
      } = req.body;
  
      // Validaciones básicas de campos vacíos
      if (!id_Vaca || !id_Toro || !Fecha_Gestion || !Fecha_Nacimiento || Crias_Hembras == null || Crias_Macho == null) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Validar que las cantidades de crías sean números y no negativos
      if (isNaN(Crias_Hembras) || Crias_Hembras < 0 || isNaN(Crias_Macho) || Crias_Macho < 0) {
        return res.status(400).json({ error: 'Crias_Hembras y Crias_Macho deben ser números positivos' });
      }
  
      // Validar existencia y género de la vaca
      const [vaca] = await db.query("SELECT * FROM Ganado WHERE id_Ganado = ? AND Genero = 'H'", [id_Vaca]);
      if (vaca.length === 0) {
        return res.status(400).json({ error: 'La vaca no existe o no es hembra' });
      }
  
      // Validar existencia y género del toro
      const [toro] = await db.query("SELECT * FROM Ganado WHERE id_Ganado = ? AND Genero = 'M'", [id_Toro]);
      if (toro.length === 0) {
        return res.status(400).json({ error: 'El toro no existe o no es macho' });
      }
  
      // Guardar historial en MongoDB y obtener el ObjectId generado
      const historial = new Historial({
        id_Vaca, id_Toro,
        Fecha_Gestion, Fecha_Nacimiento,
        Crias_Hembras, Crias_Macho
      });
      const savedHistorial = await historial.save();
      const mongoObjectId = savedHistorial._id; // Obtenemos el ObjectId generado
  
      // Insertar crías en MySQL (incluyendo el ObjectId de MongoDB)
      const totalCrías = [
        ...Array(Number(Crias_Hembras)).fill('H'),
        ...Array(Number(Crias_Macho)).fill('M')
      ];
  
      for (const genero of totalCrías) {
        await db.query("CALL Insertar_Ganado(?, ?, ?, ?, ?)", [
          vaca[0].id_Sector, genero, 0, Fecha_Nacimiento, mongoObjectId.toString()
        ]);
      }
  
      res.json({ 
        mensaje: 'Historial registrado y crías insertadas correctamente.',
        mongoId: mongoObjectId
      });
  
    } catch (err) {
      console.error('Error en el proceso:', err);
      res.status(500).json({ error: 'Error en el proceso' });
    }
  });
  
  module.exports = router;