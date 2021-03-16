
async function getEnt(textIn) {

    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
    const { getEnabledCategories } = require('trace_events');

    // Creates a client
    const client = new language.LanguageServiceClient();

   const text = textIn;

    // Prepares a document, representing the provided text
    const document = {
    content: text,
    type: 'PLAIN_TEXT',
    };

    // Detects entities in the document
    const [result] = await client.analyzeEntities({document});

    const entities = result.entities;

    console.log('Entities:');
    entities.forEach(entity => {
    console.log(entity.name);
    console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
    if (entity.metadata && entity.metadata.wikipedia_url) {
        console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);

    }
    });
};

module.exports.getEnt = text => getEnt(text);