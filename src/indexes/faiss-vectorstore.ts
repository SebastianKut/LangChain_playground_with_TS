import { FaissStore } from 'langchain/vectorstores/faiss';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

export const run = async () => {
  /* Load in the file we want to do question answering over */
  const text = fs.readFileSync('./src/state_of_the_union.txt', 'utf8');
  /* Split the text into chunks */
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  // Load the docs into the vector store
  const vectorStore = await FaissStore.fromDocuments(
    docs,
    new OpenAIEmbeddings()
  );
  const res = await vectorStore.similaritySearch(
    'What did the president say about Justice Breyer?',
    1
  );
  console.log(res);
};

run();
