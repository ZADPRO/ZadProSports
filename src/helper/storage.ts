// fileHandler.ts
import fs from "fs";
import path from "path";
import { Readable } from "stream";

// Define the type for the file object that Hapi provides
interface HapiFile {
  hapi: {
    filename: string;
    headers: Record<string, string>;
  };
  pipe: (dest: NodeJS.WritableStream) => Readable; // Specify the pipe method
}


export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now(); // e.g. 1713265479834
  const random = Math.floor(1000 + Math.random() * 9000); // e.g. 4321
  const extension = path.extname(originalName); // e.g. ".jpg", ".png"

  return `${timestamp}${random}${extension}`;
}

// Function to store a file
export const storeFile = async (
  file: any,
  uploadType: number // Renamed from `path` to `uploadType` for clarity
): Promise<string> => {
  let uploadDir: string;
  
  console.log("uploadType", uploadType);
  // Determine the directory based on the uploadType value
  if (uploadType === 1) {

    uploadDir = path.join(process.cwd(), "./src/assets/foodImage");
  } else if (uploadType === 2) {
    uploadDir = path.join(process.cwd(), "./src/assets/roomImage");
  } else if (uploadType === 3) {
    uploadDir = path.join(process.cwd(), "./src/assets/groundImage");
  } else {
    throw new Error(`Invalid upload type: ${uploadType}. `);
  }

  const uniqueFilename = generateUniqueFilename(file.hapi.filename);
  const uploadPath = path.join(uploadDir, uniqueFilename);

  // Create the directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create a writable stream for the file
  const fileStream = fs.createWriteStream(uploadPath);

  return new Promise((resolve, reject) => {
    const readableFileStream: Readable = file as unknown as Readable;

    readableFileStream.pipe(fileStream);

    readableFileStream.on("end", () => {
      resolve(uploadPath); // Resolve the promise with the path of the uploaded file
    });

    readableFileStream.on("error", (err: Error) => {
      reject(err); // Reject the promise if there's an error
    });
  });
};

// Function to view a stored file
export const viewFile = (filePath: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      filePath,
      (err: NodeJS.ErrnoException | null, data?: Buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(data!); // Return the file buffer
      }
    );
  });
};

export const deleteFile = async (filePath: string): Promise<void> => {
  console.log("filePath line ----------------- 94 \n", filePath);
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting old file:", err);
        return reject(err);
      }
      console.log("Old file deleted successfully");
      resolve();
    });
  });
};

export const convertToBase64 = async (filePath: string): Promise<string> => {
  // Read the image file and convert it to base64
  const imageBuffer = await fs.promises.readFile(filePath);
  return imageBuffer.toString("base64");
};

// export const storetheFile = async (
//   file: any, // Change this to a more flexible type
//   uploadType: number
// ): Promise<string> => {
//   if (!file) {
//     throw new Error("File is required");
//   }

//   let uploadDir: string;
//   if (uploadType === 1) {
//     uploadDir = path.join(process.cwd(), "./src/assets/gallery");
//   } else if (uploadType === 2) {
//     uploadDir = path.join(process.cwd(), "./src/assets/cars");
//   } else if (uploadType === 3) {
//     uploadDir = path.join(process.cwd(), "./src/assets/certificate");
//   } else {
//     uploadDir = path.join(process.cwd(), "./src/assets/DOC");
//   }

//   uploadDir = path.join(process.cwd(), "./src/assets/gallery");

//   const uniqueFilename = file.hapi
//     ? generateUniqueFilename(file.hapi.filename)
//     : generateUniqueFilename(file.name);
//   const uploadPath = path.join(uploadDir, uniqueFilename);

//   // Create the directory if it doesn't exist
//   if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
//   }

//   const fileStream = fs.createWriteStream(uploadPath);

//   return new Promise((resolve, reject) => {
//     const readableFileStream: Readable = file as unknown as Readable;

//     readableFileStream.pipe(fileStream);

//     readableFileStream.on("end", () => {
//       resolve(uploadPath); // Resolve the promise with the path of the uploaded file
//     });

//     readableFileStream.on("error", (err: Error) => {
//       reject(err); // Reject the promise if there's an error
//     });
//   });
// };
