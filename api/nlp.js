
async function getEnt(textIn) {

    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
    const { getEnabledCategories } = require('trace_events');

    // Creates a client
    const client = new language.LanguageServiceClient();

   let text = textIn;

    // Prepares a document, representing the provided text
    const document = {
    content: text,
    type: 'PLAIN_TEXT',
    };

    // Detects entities in the document
    const [result] = await client.analyzeEntities({document});

    const entities = result.entities;

    console.log('Entities:');
    const imageWords = entities.map(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        console.log(` - Mentions: ${entity.mentions[0].text.beginOffset}`);
        if (entity.metadata && entity.metadata.wikipedia_url) {
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
        }
        return entity.name;
    });
    const sortedImages = [];
    for (let i = 0; i < imageWords.length; i++) {
        const index = text.indexOf(imageWords[i]);
        let insertIndex = sortedImages.findIndex((image) => image.index > index);
        if (insertIndex == -1) insertIndex = sortedImages.length;
        sortedImages.splice(insertIndex, 0, {imageWord: imageWords[i], index});
    }
    const sortedImageWords = sortedImages.map((image) => image.imageWord);
    let previous = "";
    for (let i = 0; i < sortedImageWords.length; i++) {
        if (previous === sortedImageWords[i]) {
            previous = sortedImageWords.splice(i, 1);
        } else {
            previous = sortedImageWords[i];
        }
    }
    return sortedImageWords;
};

module.exports.getEnt = text => getEnt(text);