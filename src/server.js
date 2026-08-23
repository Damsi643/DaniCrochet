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

async function start() {
  try {
    await sequelize.authenticate();
    console.log(
      `Conexion a la base de datos (${sequelize.getDialect()}) establecida`
    );
    await sequelize.sync();
    await asegurarColumnaActivo();
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
