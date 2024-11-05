// src/index.ts
import express, { Express, Request, RequestHandler, Response } from "express";
import dotenv from "dotenv";
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from 'url';
import cors from "cors";
import os from "os"
import morgan from "morgan"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const homedir = os.homedir();

dotenv.config();


var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })


const app: Express = express();
const port = process.env.PORT || 3000;
const root = homedir || process.env.ROOT_PATH || "";


const getFileType = (file: fs.Dirent) => {
  let fileType = "unknown"
  const filename = file.name

  if (file.isDirectory()) {
    fileType = "folder"
  }

  if (filename.includes(".")) {
    const extension = filename.slice(filename.indexOf("."));
    fileType = extension
  }

  return fileType;
}

app.use(cors());

app.use("/", express.static(path.join(__dirname, '../app/dist')));

app.use(morgan('combined', { stream: accessLogStream }))


const mimeTypes = {
  '.pdf': 'application/pdf',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.txt': 'text/plain',
  '.mp4': 'video/mp4',
};


type Entry = {
  name: string;
  parent: string;
  type: string;
}

const downloadHandler: RequestHandler = (req: Request, res: Response) => {
  try {
    const fullpath = path.resolve(root, `.${req.originalUrl}`);
    const filename = path.basename(fullpath);

    if (!fullpath.startsWith(root)) {
      res.status(403).send("Access denied.");
      return;
    }

    if (!fs.existsSync(fullpath)) {
      res.status(404).send("File or directory not found.");
      return;
    }

    const stats = fs.lstatSync(fullpath);
    if (stats.isDirectory()) {
      const dirEntries = fs.readdirSync(fullpath, { withFileTypes: true });

      const result = dirEntries.map(entry => ({
        name: entry.name,
        parent: req.originalUrl,
        type: entry.isDirectory() ? "directory" : entry.name.split('.').pop()
      }));

      res.status(200).json(result);
      return;
    } else {
      try {
        fs.accessSync(fullpath, fs.constants.R_OK);
      } catch (err) {
        console.error("File not accessible:", err);
        res.status(403).send("File access denied.");
        return;
      }

      const fileExtension = path.extname(filename).toLowerCase();
      const contentType = mimeTypes?.[fileExtension as keyof typeof mimeTypes] || 'application/octet-stream';

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', contentType);

      const fileStream = fs.createReadStream(fullpath);
      fileStream.pipe(res).on('error', (err) => {
        console.error("Error streaming file:", err);
        if (!res.headersSent) {
          res.status(500).send("Error downloading the file.");
        }
      });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Internal server error.");
  }
};

app.post("*", downloadHandler);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});