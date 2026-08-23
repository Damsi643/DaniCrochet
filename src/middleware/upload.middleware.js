const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadDirectory = path.join(__dirname, '..', '..', 'public', 'img', 'productos');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const uploadImagen = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
      return;
    }
    callback(new Error('El archivo debe ser una imagen'));
  },
});

function guardarImagen(req, _res, next) {
  uploadImagen.single('imagen')(req, _res, (error) => {
    if (error) return next(error);
    if (req.file) req.body.imagen = `/img/productos/${req.file.filename}`;
    next();
  });
}

module.exports = guardarImagen;
