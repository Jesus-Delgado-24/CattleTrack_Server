const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database').pool;

router.post('/', async (req, res) => {
    const { Nombre, Apellido_P, Apellido_M, Email, Telefono, Contraseña, Tipo_U, Id_Sector, Especialidad } = req.body;
    const tipoUsuario = Number(Tipo_U);

    // Validaciones de campos obligatorios generales
    if (!Nombre || !Apellido_P || !Apellido_M || !Email || !Telefono || !Contraseña || Tipo_U === undefined) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ mensaje: 'Email no válido' });
    }

    const telefonoRegex = /^[0-9]{10}$/;
    if (!telefonoRegex.test(Telefono)) {
        return res.status(400).json({ mensaje: 'El teléfono debe tener 10 dígitos numéricos' });
    }

    if (Contraseña.length < 6) {
        return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const tiposPermitidos = [1, 2, 3, 4];
    if (!tiposPermitidos.includes(tipoUsuario)) {
        return res.status(400).json({ mensaje: 'Tipo de usuario no válido. Debe ser 1, 2, 3 o 4' });
    }

    // Validaciones específicas para veterinario (tipo 4)
    if (tipoUsuario === 4) {
        if (!Id_Sector || !Especialidad) {
            return res.status(400).json({ mensaje: 'Los campos Id_Sector y Especialidad son obligatorios para un veterinario' });
        }

        try {
            const [sectorResult] = await db.query('SELECT COUNT(*) AS count FROM Sector WHERE id_Sector = ?', [Id_Sector]);
            const sectorExists = sectorResult[0]?.count > 0;

            if (!sectorExists) {
                return res.status(400).json({ mensaje: 'El sector especificado no existe' });
            }
        } catch (error) {
            console.error('Error al verificar el sector:', error);
            return res.status(500).json({ mensaje: 'Error interno al validar el sector' });
        }
    }

    // Crear usuario
    try {
        const hashedPassword = await bcrypt.hash(Contraseña, 10);
        const query = 'CALL Crear_Usuario(?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const valores = [Nombre, Apellido_P, Apellido_M, Email, Telefono, hashedPassword, tipoUsuario, Id_Sector, Especialidad];

        const respuesta = await db.query(query, valores);
        const mensaje = respuesta[0][0][0]?.mensaje || 'Operación completada';
        return res.status(200).json({ mensaje });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        return res.status(500).json({ mensaje: 'Error interno al crear el usuario' });
    }
});

module.exports = router;
