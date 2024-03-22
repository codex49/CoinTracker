import fs from 'fs';


export const isPairExists = async (chain, pairID) => {
    try {
        const path = `./${chain}.log`;
        await fs.promises.access(path, fs.constants.F_OK);
        const data = await fs.promises.readFile(path, 'utf-8');
        if (data.includes(pairID)) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

export const saveCheckedPairs = async (chain, pairID) => {
    try {
        const path = `./${chain}.log`;
        let fileContent = "";
        try {
            fileContent = await fs.promises.readFile(path, 'utf-8');
        } catch (error) {
            if (error.code !== 'ENOENT') {
                // If the error is not "File Not Found", log it.
                console.error(`Error reading from ${path}:`, error);
            }
        }

        if (!fileContent.includes(pairID)) {
            // ID not found in the file, append it
            await fs.promises.appendFile(path, pairID + '\n');
        }
        // If the ID is already present, nothing is done, effectively avoiding duplicates
    } catch (error) {
        console.error(`Error in saveCheckedPairs for pairID ${pairID}:`, error);
    }
}


export const uncheckedPairs = async (chain, pairIDs) => {
    try {
        const path = `./${chain}.log`;
        await fs.promises.access(path, fs.constants.F_OK);
        const data = (await fs.promises.readFile(path, 'utf-8')).trim().split('\n');
        return pairIDs.filter(item => !data.includes(item));
    } catch (error) {
        return pairIDs;
    }
}

