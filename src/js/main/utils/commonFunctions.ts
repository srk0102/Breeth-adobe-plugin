import axios from "axios";

export const uploadFileToBackend = async (filePath: string) => {
    const fileData = window.cep.fs.readFile(filePath, window.cep.encoding.Base64);
    if (fileData.err !== 0) {
        console.error("Error reading file for upload:", fileData.err);
        return;
    }

    try {
        const response = await axios.post("http://localhost:8080/BREETH-CORE/pp/uploadTestFile", {
            fileName: filePath.split(/(\\|\/)/g).pop(),
            fileContent: fileData.data
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        alert(response.data.message)
        console.log("Upload response:", response.data);
        return response.data;
    } catch (error: any) {
        alert(error.message)
        console.error("Error uploading file to backend:", error);
    }
};


export const getTheFileData = async (filePath: string) => {
    try {
        const result = await window.cep.fs.readFile(filePath, window.cep.encoding.Base64);
        if (result.err === 0) {
            return result.data;
        } else {
            throw new Error("Failed to read file. Error code: " + result.err);
        }
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
};