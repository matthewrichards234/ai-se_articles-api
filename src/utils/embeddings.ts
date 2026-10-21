import OpenAI from 'openai';

const MODEL = 'Qwen/Qwen3-Embedding-8B';

let client: OpenAI;

const getClient = () => {
  if (!client) {
    client = new OpenAI({
      baseURL: 'https://api.tokenfactory.nebius.com/v1/',
      apiKey: process.env.NEBIUS_API_KEY!,
    });
  }
  return client;
};

export const createEmbedding = async (text: string): Promise<number[]> => {
  const response = await getClient().embeddings.create({
    model: MODEL,
    input: text,
  });

  const embeddingData = response.data[0];
  if (!embeddingData) {
    throw new Error('No embedding returned from API');
  }
  return embeddingData.embedding;
};
