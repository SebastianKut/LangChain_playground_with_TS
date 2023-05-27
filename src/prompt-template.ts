// USING PROMPT TEMPLATES
// Import the PromptTemplate module
import { PromptTemplate } from 'langchain/prompts';

export const run = async () => {
  //Create the template. The template is actually a "parameterized prompt". A "parameterized prompt" is a prompt in which the input parameter names are used and the parameter values are supplied from external input
  const template = 'What is a good name for a company that makes {product}?';

  //Instantiate "PromptTemplate" passing the prompt template string initialized above and a list of variable names the final prompt template will expect
  const prompt = new PromptTemplate({ template, inputVariables: ['product'] });

  //Create a new prompt from the combination of the template and input variables. Pass the value for the variable name that was sent in the "inputVariables" list passed to "PromptTemplate" initialization call
  const res = await prompt.format({ product: 'colorful socks' });
  console.log({ res });

  // res gives us a prompt that replaces {product} with colorfull socks
};

run();
