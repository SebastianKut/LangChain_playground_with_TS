import { OpenAI } from 'langchain/llms/openai';
import { VectorDBQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();
// Reference docs: https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/hnswlib

export const run = async () => {
  /* Initialize the LLM to use to answer the question */
  const model = new OpenAI();
  /* Load in the file we want to do question answering over */
  const text = fs.readFileSync('./src/state_of_the_union.txt', 'utf8');
  /* Split the text into chunks */
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);
  /* Create the vectorstore */
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

  // Save the vector store to a directory - this is optional just an example you can pass vectorstore directly to chain no need to save and load from file
  const directory = './src/indexes/store-data';
  await vectorStore.save(directory);

  // Load the vector store from the same directory
  const loadedVectorStore = await HNSWLib.load(
    directory,
    new OpenAIEmbeddings()
  );
  console.log('Loaded vectore store', loadedVectorStore);

  /* Create the chain */
  const chain = VectorDBQAChain.fromLLM(model, loadedVectorStore);
  /* Ask it a question */
  const res = await chain.call({
    input_documents: docs,
    query: 'What did the president say about Justice Breyer?',
  });
  console.log(res);
};

run();
