// src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs"
import path, { dirname } from "path"
import { fileURLToPath } from 'url';
import cors from "cors";
import mime from "mime";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const root = process.env.ROOT_PATH || "";


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


type Entry = {
  name: string;
  parent: string;
  type: string;
}

app.get("*", (req: Request, res: Response) => {
  console.log(req.originalUrl)

  let result: Entry[] | Entry | null = null

  const fullpath = root + req.originalUrl;

  const target = path.basename(fullpath)
  const exist = fs.existsSync(fullpath)

  console.log(exist, fullpath)

  const isFolder = fs.lstatSync(fullpath).isDirectory()

  if (isFolder) {

    const dirEntries = fs.readdirSync(fullpath, { withFileTypes: true });

    const files = dirEntries.map(entry => ({ name: entry.name, parent: entry.parentPath, type: getFileType(entry) }))

    result = files
  } else {

    const file = fs.readFileSync(fullpath, {})

    console.log(file, "FDSaf")

    const fileW = `${__dirname}/${req.originalUrl}`;


    console.log(fileW, fullpath)

    // res.download(fileW)

    var filename = path.basename(fullpath);
    var mimetype = mime.load(fullpath);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    // res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(fullpath);
    filestream.pipe(res);
  }





  res.send(result);
});







app.get("/status", (request, response) => {

  const result = {

  }

  const status = {
    "Status": "Running"
  };

  const res = path.basename(root)

  const exist = fs.existsSync(res)

  const test = fs.readdirSync(res);


  console.log(res, exist, test)
  response.send(status);
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});