// CHAINS
//Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
import { OpenAI } from 'langchain/llms/openai';

//Import the Chains module
import { ConversationChain } from 'langchain/chains';

//Load environment variables (populate process.env from .env file)
import * as dotenv from 'dotenv';
dotenv.config();

export const run = async () => {
  //Instantiante the OpenAI model
  //Pass the "temperature" parameter which controls the RANDOMNESS of the model's output. A lower temperature will result in more predictable output, while a higher temperature will result in more random output. The temperature parameter is set between 0 and 1, with 0 being the most predictable and 1 being the most random
  const model = new OpenAI({ temperature: 0.9 });

  //Instantiate LLMChain, which consists of a PromptTemplate and an LLM. Pass the result from the PromptTemplate and the OpenAI LLM model
  const chain = new ConversationChain({ llm: model });

  //Run the chain. Pass the value for the variable name that was sent in the "inputVariables" list passed to "PromptTemplate" initialization call
  const res1 = await chain.call({ input: 'Hi I am Seb' });
  console.log({ res1 });

  const res2 = await chain.call({ input: 'What is my name' });
  console.log({ res2 });
};

run();
