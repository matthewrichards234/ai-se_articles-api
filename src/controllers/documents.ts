import type { Request, Response } from 'express';
import { readFileSync } from 'fs';
import { PDFParse } from 'pdf-parse';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { chunkText } from '../utils/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send({
      success: false,
      data: null,
      error: { message: 'File is required' },
    });
  }

  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();

  const chunks = chunkText(text);
  const title = req.body.title || req.file.originalname;

  const document = await Document.create({
    title,
    fileName: req.file.originalname,
  });

  await Promise.all(
    chunks.map(async (chunk) =>
      Chunk.create({
        documentId: document._id,
        text: chunk,
        embedding: await createEmbedding(chunk),
      }),
    ),
  );

  return res.status(201).send({
    success: true,
    error: null,
    data: document,
  });
};

export const getDocuments = async (_req: Request, res: Response) => {
  try {
    const documents = await Document.find({});
    return res.status(200).send({
      success: true,
      error: null,
      data: documents,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      data: null,
      error: { message: 'Failed to retrieve documents' },
    });
  }
};
