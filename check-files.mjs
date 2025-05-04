// check-files.js
import fs from 'fs';
import path from 'path';

function checkFile(filePath) {
  console.log(`\nChecking ${filePath}:`);
  console.log('------------------------');

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Look for method calls
    const methodCalls = content.match(/this\.storyblokApi\.getSite\w+/g);
    if (methodCalls) {
      console.log('Found StoryblokApi method calls:');
      methodCalls.forEach((call) => console.log(`- ${call}`));
    } else {
      console.log('No StoryblokApi method calls found');
    }

    // Check if the method definition exists
    const methodDef = content.match(/async getSite\w+\(/g);
    if (methodDef) {
      console.log('\nFound method definitions:');
      methodDef.forEach((def) => console.log(`- ${def}`));
    }

    // Show a snippet around the problem line
    const lines = content.split('\n');
    const problemLine = lines.findIndex((line) => line.includes('getSiteConfiguration'));
    if (problemLine !== -1) {
      console.log('\nFound getSiteConfiguration at line', problemLine + 1);
      console.log('Context:');
      for (
        let i = Math.max(0, problemLine - 2);
        i <= Math.min(lines.length - 1, problemLine + 2);
        i++
      ) {
        console.log(`${i + 1}: ${lines[i]}`);
      }
    }
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
  }
}

// Check the files
checkFile('./src/pages/home.js');
checkFile('./src/cms/storyblok.js');
