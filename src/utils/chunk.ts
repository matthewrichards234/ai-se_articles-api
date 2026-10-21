const CHUNK_SIZE = 500;

export const chunkText = (text: string): string[] => {
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }

  return chunks;
};
