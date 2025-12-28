
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models/db');
const { pool, conectarMongoDB } = require('./config/database');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de migraciones (MySQL)
const setupMigrations = async () => {
  try {
    const { execSync } = require('child_process');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    console.log('✅ Migraciones MySQL ejecutadas correctamente');
  } catch (error) {
    console.error('❌ Error en migraciones MySQL:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    // 1. Conectar a MySQL
    await sequelize.authenticate();
    console.log('✅ MySQL conectado');
    
    // 2. Conectar a MongoDB usando la función importada
    await conectarMongoDB();
    
    // 3. Ejecutar migraciones MySQL
    await setupMigrations();
    
    // 4. Cargar modelos
    require('./models/userModel');
    require('./models/foodModel');
    require('./models/sectorModel');
    require('./models/cattleModel'); 
    require('./models/diseaseModel');
    require('./models/veterinarioModel');

    require('./models/monitoringModel'); 
    require('./models/breedingModel');
    require('./models/supplyModel');
    
    // 5. Configurar rutas
    const userRoutes = require('./routes/userRoutes');
    const foodRoutes = require('./routes/foodRoutes');
    const sectorRoutes = require('./routes/sectorRoutes');
    const cattleRoutes = require('./routes/cattleRoutes'); 
    const diseaseRoutes = require('./routes/diseaseRoutes');
    const vetRoutes = require('./routes/vetRoutes');

    const monitoringRoutes = require('./routes/monitoringRoutes');
    const breedingRoutes = require('./routes/breedingRoutes');
    const supplyRoutes = require('./routes/supplyRoutes');

    app.use('/api/login', require('./routes/authRoutes'));
    
    app.use('/api/a_users', userRoutes);
    app.use('/api/a_food', foodRoutes); 
    app.use('/api/a_sectors', sectorRoutes);
    app.use('/api/a_cattle', cattleRoutes);
    app.use('/api/a_diseases', diseaseRoutes);
    app.use('/api/a_monitoring', monitoringRoutes);
    app.use('/api/a_breeding', breedingRoutes);
    app.use('/api/a_food/supply', supplyRoutes);
    app.use('/api/a_vets', vetRoutes);

    app.use('/api/g_users', require('./routes/getUsersRoutes'));
    app.use('/api/g_almacenes', require('./routes/getAlmacenRoutes'));
    app.use('/api/g_enfermedades', require('./routes/getEnfermedadRoutes'));
    app.use('/api/g_veterinarios', require('./routes/getVeterinariosRoutes'));
    app.use('/api/g_ganado', require('./routes/getGanadoRoutes'));
    app.use('/api/g_sectores', require('./routes/getSectoresRoutes'));
    app.use('/api/g_proleche', require('./routes/getPLecheRoutes'));
    app.use('/api/g_abastecer', require('./routes/getAbasAlimentoRoutes'));
    app.use('/api/g_historialpro', require('./routes/getHistorialProRoutes'));
    app.use('/api/g_monitoreo', require('./routes/getMonitoreo'));

    app.use('/api/b_abastecer', require('./routes/B_abastecerRoutes'));
    app.use('/api/b_alimento', require('./routes/B_alimentoRoutes'));
    app.use('/api/b_enfermedad', require('./routes/B_enfermedadRoutes'));
    app.use('/api/b_ganado', require('./routes/B_ganadoRoutes'));
    app.use('/api/b_h_reproduccion', require('./routes/B_h_reproduccionRoutes'));
    app.use('/api/b_monitoreo', require('./routes/B_monitoreoRoutes'));
    app.use('/api/b_p_leche', require('./routes/B_prod_lecheRoutes'));
    app.use('/api/b_usuario', require('./routes/B_usuarioRoutes'));
    app.use('/api/b_veterinario', require('./routes/B_veterinarioRoutes'));
    app.use('/api/b_sector', require('./routes/B_sectorRoutes'));
    
    app.use('/api/e_alimento', require('./routes/E_alimentoRoutes'));
    app.use('/api/e_enfermedad', require('./routes/E_enfermedadRoutes'));
    app.use('/api/e_p_leche', require('./routes/E_prodlecheRoutes'));
    app.use('/api/e_sector', require('./routes/E_sectorRoutes'));
    app.use('/api/e_usuario', require('./routes/E_UsuarioRoutes'));
    app.use('/api/e_ganado', require('./routes/E_ganado2Routes'));

    app.use('/api/r_monitoreo', require('./routes/registrar_monitoreo'));
    app.use('/api/r_historial', require('./routes/registrar_historialEnfermedades'));
    app.use('/api/r_sector', require('./routes/registrar_sector'));
    app.use('/api/r_usuario',require ('./routes/registrar_usuario'))
    app.use('/api/r_alimento',require('./routes/registrar_alimento'));
    app.use('/api/r_enfermedades',require('./routes/registrar_enfermedades'));
    app.use('/api/r_produccion',require('./routes/registrar_produccion_leche'));
    app.use('/api/r_abastecimiento',require('./routes/registrar_abastecimiento'));
    app.use('/api/r_reproduccion',require('./routes/registrar_ganado'));


    // 6. Iniciar servidor
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor en http://localhost:${PORT}`);
      console.log('🔍 Modo:', process.env.NODE_ENV || 'development');
      console.log('📦 Bases de datos: MySQL y MongoDB conectadas');
    });
    
  } catch (error) {
    console.error('🔥 Error de inicialización:', error);
    process.exit(1);
  }
};

startServer();
