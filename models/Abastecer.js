const mongoose = require('mongoose');

const AbastecerSchema = new mongoose.Schema({
    id_Sector: { type: Number, required: true},
    id_Alimento: { type: Number, required: true},
    Fecha_hora: { type: Date, required: true},
    Cantidad: { type: Number, required: true}
});

module.exports = mongoose.model('Abastecer', AbastecerSchema, 'Abastecer');