const fs = require('fs');
const path = require('path');

// Specify the path to your text file
const filePath = path.join(__dirname, 'sorted-data.txt');

// Function to randomize the order of entries
function randomizeEntries(filePath) {
    try {
        // Read the content of the text file
        const content = fs.readFileSync(filePath, 'utf-8');

        // Split the content into blocks of entries
        const entries = content.split('\n\n');

        // Shuffle the entries array
        for (let i = entries.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [entries[i], entries[j]] = [entries[j], entries[i]];
        }

        // Join the randomized entries into a single string
        return entries.join('\n\n');
    } catch (error) {
        console.error('Error processing the file:', error.message);
        return null;
    }
}

// Run the randomization and output the result
const randomizedContent = randomizeEntries(filePath);
if (randomizedContent) {
    console.log(randomizedContent);

    // Optionally save the randomized content to a new file
    const outputFilePath = path.join(__dirname, 'randomized_file.txt');
    fs.writeFileSync(outputFilePath, randomizedContent, 'utf-8');
    console.log(`Randomized entries saved to ${outputFilePath}`);
}
