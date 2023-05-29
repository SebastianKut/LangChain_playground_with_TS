import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAI } from "langchain/llms/openai";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import * as dotenv from 'dotenv';
dotenv.config();

export async function run() {
  // Create the models and chain
  const embeddings = new OpenAIEmbeddings();
  const model = new OpenAI({temperature: 0});
  const chain = loadQARefineChain(model);
  const loader = new CheerioWebBaseLoader('https://kb.medical-objects.com.au/display/PUB/VMR+-+Virtual+Medical+Record');
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  
  try {
    //Scrap webpage and get text from it   
    const pageContentResults = await loader.load();
    const text = pageContentResults[0].pageContent;

    /* Split the text into chunks */
    const docs = await textSplitter.createDocuments([text]);
    
    // Load the documents and create the vector store
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
    console.log('Vector store', store);

    // Select the relevant documents
    const question = "What is vmr";
    const relevantDocs = await store.similaritySearch(question);

    // Call the chain
    const res = await chain.call({
        input_documents: relevantDocs,
        question,
    });

    console.log(res);
  } catch (error) {
    console.log('Error:', error)
  }
  
}

run();