import * as readline from 'readline'; // https://stackoverflow.com/a/49055758
import * as fs from 'fs';

const contractAddressStoragePath = 'contract-data.json'

/**
 * 
 * 
 * @see https://www.google.com/search?q=TypeScript+and+nodejs%3A+read+a+key+value+pair+from+json+file+and+save+to+variable
 * @param key 
 * @returns value
 */
function readKeyValue(/*filePath: string,*/ key: string): string | undefined { //data-type can also be :any instead of string
    try {
        /**
        * readFileSync reads the file synchronously. The event loop and execution of the remaining code is blocked 
        * until all the data has been read.
        */
        const jsonData = JSON.parse(fs.readFileSync(contractAddressStoragePath, 'utf-8'));
        return jsonData[key];
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return undefined;
        //   // If the file doesn't exist, create an empty object
        //   if (err.code === 'ENOENT') {
        //     jsonData = {};
        //   } else {
        //     throw err;
        //   }

    }
}

export { readKeyValue, fs, contractAddressStoragePath }