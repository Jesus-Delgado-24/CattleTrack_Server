const { Sequelize, sequelize } = require('./db');

const User = sequelize.define('Usuario', {
  id_Usuario: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Nombre: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  Apellido_P: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  Apellido_M: {
    type: Sequelize.STRING(100),
    allowNull: false
  },
  Email: {
    type: Sequelize.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "El email debe tener un formato válido"
      }
    }
  },
  Telefono: {
    type: Sequelize.CHAR(10),
    allowNull: false
  },
  Tipo_U: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isIn: {
        args: [[1, 2, 3, 4]], // Valores permitidos
        msg: "El tipo de usuario debe ser 1 (Dueño), 2 (Admin), 3 (Trabajador) o 4 (Veterinario)"
      }
    }
  },
  Contraseña: {
    type: Sequelize.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: "La contraseña debe tener al menos 6 caracteres"
      }
    }
  }
}, {
  tableName: 'Usuario',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['email']
    }
  ]
});

module.exports = User;