import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
// In node version < 18 theres no fetch by default module so you have to install node-fetch and import it in the lanchain file that throws an error
// like this
// import fetch from 'node-fetch';

const loader = new CheerioWebBaseLoader(
  'https://kb.medical-objects.com.au/display/PUB/Clinical+Decision+Support'
);

const docs = await loader.load();

console.log('Loaded page', docs);
