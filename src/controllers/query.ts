import type { Request, Response } from 'express';
import Chunk from '../models/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';

export const queryDocuments = async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'question is required' },
    });
    return;
  }

  const chunkRecords = await Chunk.find({});
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));

  const queryEmbedding = await createEmbedding(question);

  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);

  res.status(200).json({
    success: true,
    data: { question, chunks: ranked },
    error: null,
  });
};
