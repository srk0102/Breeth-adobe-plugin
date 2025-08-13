import axios from "axios";
import { evalTS } from "../../lib/utils/bolt";

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

export const saveBase64File = async (
    // base64Data: string,
    // filename: string,
    // type: "audio" | "video" | "image",
    // fallbackExtension?: string
) => {
    // window.__adobe_cep__.evalScript("getProjectDirectory()", (projectDirPath: any) => {
    //     if (!projectDirPath) {
    //         alert("Unable to get the project directory path.");
    //         return;
    //     }

    //     console.log("Project Directory Path:", projectDirPath);

    //     const breethFolder = `${projectDirPath}/Breeth`;
    //     const subFolder = `${breethFolder}/${capitalizeFirstLetter(type)}`;

    //     // Create Breeth folder if it doesn't exist
    //     let folderStatus = window.cep.fs.readdir(breethFolder);
    //     if (folderStatus.err === window.cep.fs.ERR_NOT_FOUND) {
    //         const createStatus = window.cep.fs.makedir(breethFolder);
    //         if (createStatus.err !== window.cep.fs.NO_ERROR) {
    //             alert(`Error creating Breeth folder: ${createStatus.err}`);
    //             return;
    //         }
    //     }

    //     // Create subfolder (Audio, Video, Images) if it doesn't exist
    //     folderStatus = window.cep.fs.readdir(subFolder);
    //     if (folderStatus.err === window.cep.fs.ERR_NOT_FOUND) {
    //         const createStatus = window.cep.fs.makedir(subFolder);
    //         if (createStatus.err !== window.cep.fs.NO_ERROR) {
    //             alert(`Error creating ${type} subfolder: ${createStatus.err}`);
    //             return;
    //         }
    //     }

    //     // Parse base64
    //     let extension = fallbackExtension || 'bin';
    //     let base64Body = base64Data;

    //     const matches = base64Data.match(/^data:(.+);base64,(.*)$/);

    //     if (matches && matches.length === 3) {
    //         const mimeType = matches[1];
    //         base64Body = matches[2];

    //         if (!fallbackExtension) {
    //             extension = mimeType.split("/")[1] || 'bin';
    //         }
    //     } else {
    //         if (!fallbackExtension) {
    //             alert("Base64 is invalid and no fallback extension provided.");
    //             return;
    //         }
    //     }

    //     // Compose file path
    //     const filePath = `${subFolder}/${filename}.${extension}`;

    //     // Save file
    //     const writeStatus = window.cep.fs.writeFile(filePath, base64Body, window.cep.encoding.Base64);

    //     if (writeStatus.err === window.cep.fs.NO_ERROR) {
    //         alert(`File saved successfully at: ${filePath}`);

    //         // Optional: Import file into Premiere project automatically
    //         // importFileIntoPremiere(filePath);
    //         return filePath;
    //     } else {
    //         alert(`Error saving file: ${writeStatus.err}`);
    //     }
    // });

    try {
        const fileToImport = 'D:/breeth/premierpro-breeth-cep/src/js/main/assets/logo.png';
        const result = await evalTS("importFileIntoProject", fileToImport);
        
        console.log(result);
        if (result && typeof result === "string" && result.includes("successfully")) {
            alert(result);
        } else {
            alert(`Import failed: ${result}`);
        }
    } catch (error) {
        console.error("Error importing file:", error);
        alert(`Import error: ${error}`);
    }
};

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
