require('dotenv').config();
const { DataTypes } = require('sequelize');
const app = require('./app');
const { sequelize } = require('./models');

const PORT = Number(process.env.PORT) || 3000;

async function asegurarColumnaActivo() {
  const qi = sequelize.getQueryInterface();
  const descripcion = await qi.describeTable('productos');
  if (!descripcion.activo) {
    await qi.addColumn('productos', 'activo', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    console.log('Columna "activo" agregada a la tabla productos');
  }
}

async function asegurarColumnasAutenticacion() {
  const qi = sequelize.getQueryInterface();
  const usuarios = await qi.describeTable('usuarios');
  const clientes = await qi.describeTable('clientes');

  if (!usuarios.rol) {
    await qi.addColumn('usuarios', 'rol', {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'admin',
    });
  }
  if (!clientes.usuarioId) {
    await qi.addColumn('clientes', 'usuarioId', {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    });
  }
}

async function start() {
  try {
    await sequelize.authenticate();
    console.log(
      `Conexion a la base de datos (${sequelize.getDialect()}) establecida`
    );
    await sequelize.sync();
    await asegurarColumnaActivo();
    await asegurarColumnasAutenticacion();
    console.log('Modelos sincronizados con la base de datos');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor:', err.message);
    process.exit(1);
  }
}

start();
