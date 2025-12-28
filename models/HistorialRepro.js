const mongoose = require('mongoose');

const HistorialReproSchema = new mongoose.Schema({
    id_Vaca: { type: Number, required: true},
    id_Toro: { type: Number, required: true},
    Fecha_Gestion: { type: Date, required: true},
    Fecha_Nacimiento: { type: Date, required: true},
    Crias_Hembras: { type: Number, required: true},
    Crias_Macho: { type: Number, required: true}
});

module.exports= mongoose.model('Historial de Reproduccion', HistorialReproSchema, 'Historial de Reproduccion');