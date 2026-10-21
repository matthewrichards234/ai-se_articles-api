type ChunkCandidate = {
  id: string;
  documentId: string;
  text: string;
  embedding: number[];
};

type ScoredChunk = {
  id: string;
  documentId: string;
  text: string;
  score: number;
};

const dot = (a: number[], b: number[]): number => {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    sum += (a[i] ?? 0) * (b[i] ?? 0);
  }
  return sum;
};

const magnitude = (vec: number[]): number => {
  let sum = 0;
  for (const v of vec) {
    sum += v * v;
  }
  return Math.sqrt(sum) || 1;
};

export const rankBySimilarity = (
  queryEmbedding: number[],
  items: ChunkCandidate[],
  limit = 5,
): ScoredChunk[] => {
  const queryMagnitude = magnitude(queryEmbedding);

  // Create array of objects of `ScoredChunks` with `score` having used the vector math functions.
  const scored = items.map((item) => {
    const score =
      dot(queryEmbedding, item.embedding) /
      (queryMagnitude * magnitude(item.embedding));
    return { id: item.id, documentId: item.documentId, text: item.text, score };
  });

  // Sort array based on similarity and return the first `X` from limit.
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
};
