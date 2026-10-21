import { Router } from 'express';
import { uploadDocument, getDocuments } from '../controllers/documents.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', uploadDocument);
router.get('/', getDocuments);

export default router;
