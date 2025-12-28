
const Supply = require('../models/supplyModel');
const AlmacenAlimento = require('../models/foodModel');
const { sequelize } = require('../models/db');

exports.updateSupply = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_Sector, id_Alimento, Cantidad } = req.body;

    console.log('Iniciando actualización. Datos recibidos:', { id, id_Sector, id_Alimento, Cantidad });

    // Validaciones básicas
    if (!id_Sector || !id_Alimento || Cantidad === undefined) {
      throw new Error('Todos los campos son obligatorios: id_Sector, id_Alimento, Cantidad');
    }
    if (isNaN(Cantidad)) {
      throw new Error('Cantidad debe ser un número');
    }
    if (parseFloat(Cantidad) <= 0) {
      throw new Error('Cantidad debe ser mayor a 0');
    }

    // Convertir tipos
    const alimentoId = parseInt(id_Alimento, 10);
    const cantidadNumber = parseFloat(Cantidad);

    // Obtener datos actuales
    const [currentSupply, alimentoInMySQL] = await Promise.all([
      Supply.findById(id),
      AlmacenAlimento.findByPk(alimentoId)
    ]);

    console.log('Datos actuales:', {
      currentSupply,
      alimentoMySQL: alimentoInMySQL?.dataValues
    });

    if (!currentSupply) throw new Error('Registro de abastecimiento no encontrado en MongoDB');
    if (!alimentoInMySQL) throw new Error(`Alimento con ID ${alimentoId} no existe en MySQL`);

    // Calcular diferencia
    const diferenciaNeta = parseFloat(currentSupply.Cantidad) - cantidadNumber;
    console.log('Diferencia calculada:', diferenciaNeta);

    // Validar stock (solo si se está restando)
    if (diferenciaNeta < 0) {
      const cantidadDisponible = parseFloat(alimentoInMySQL.cantidad);
      if (Math.abs(diferenciaNeta) > cantidadDisponible) {
        throw new Error(`Stock insuficiente. Disponible: ${cantidadDisponible}, Se requiere: ${Math.abs(diferenciaNeta)}`);
      }
    }

    // Actualizar MongoDB
    const updatedSupply = await Supply.findByIdAndUpdate(
      id,
      { 
        id_Sector: parseInt(id_Sector, 10), 
        id_Alimento: alimentoId, 
        Cantidad: cantidadNumber 
      },
      { new: true, runValidators: true }
    );
    console.log('MongoDB actualizado:', updatedSupply);

    // Actualizar MySQL
    const nuevaCantidad = parseFloat(alimentoInMySQL.cantidad) + diferenciaNeta;
    const [affectedRows] = await AlmacenAlimento.update(
      { cantidad: nuevaCantidad },
      {
        where: { id_Alimento: alimentoId },
        silent: false
      }
    );
    console.log('Filas afectadas en MySQL:', affectedRows);

    if (affectedRows === 0) {
      throw new Error('No se actualizó ningún registro en MySQL. Verifica el ID del alimento');
    }

    res.status(200).json({
      success: true,
      data: {
        mongo: updatedSupply,
        mysql: {
          id_Alimento: alimentoId,
          cantidad_anterior: alimentoInMySQL.cantidad,
          cantidad_actual: nuevaCantidad
        }
      }
    });

  } catch (error) {
    console.error('Error en updateSupply:', error.message);
    res.status(400).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development'
        ? { stack: error.stack, receivedData: req.body }
        : undefined
    });
  }
};
