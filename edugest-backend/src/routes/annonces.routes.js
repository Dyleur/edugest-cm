const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const annoncesController = require('../controllers/annonces.controller');
const { verifyToken } = require('../middlewares/auth');
const { autoriser, ROLES } = require('../middlewares/rbac');

const annonceUploadDir = path.join(__dirname, '../../uploads/annonces');
if (!fs.existsSync(annonceUploadDir)) {
  fs.mkdirSync(annonceUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, annonceUploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.doc', '.docx', '.xls', '.xlsx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Type de fichier non autorisé'));
  },
});

router.use(verifyToken);
router.use(autoriser([ROLES.ADMIN, ROLES.RESPONSABLE_ADMIN, ROLES.DIRECTEUR, ROLES.ENSEIGNANT, ROLES.PARENT]));

router.get('/', annoncesController.list);
router.get('/:id', annoncesController.getOne);
router.post('/', annoncesController.create);
router.post('/upload', upload.single('fichier'), annoncesController.uploadFile);
router.delete('/:id', annoncesController.remove);

module.exports = router;
