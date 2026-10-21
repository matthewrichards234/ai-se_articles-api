import { Router } from 'express';
import { uploadDocument, getDocuments } from '../controllers/documents.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), uploadDocument);
router.get('/', getDocuments);

export default router;
