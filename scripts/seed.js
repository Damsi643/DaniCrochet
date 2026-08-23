require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Usuario } = require('../src/models');

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    if ((await Usuario.count()) === 0) {
      await Usuario.create({
        nombre: 'Daniela',
        correo: 'dani@danicrochet.com',
        passwordHash: bcrypt.hashSync('crochet123', 10),
        rol: 'admin',
      });
      console.log('Administradora creada: dani@danicrochet.com / crochet123');
    }

    console.log('Seed finalizado. Solo se creó o conservó la cuenta administradora.');
    process.exit(0);
  } catch (err) {
    console.error('Error ejecutando el seed:', err.message);
    process.exit(1);
  }
})();
