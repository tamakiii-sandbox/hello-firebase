import * as functions from 'firebase-functions';
import * as BusBoy from 'busboy';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const hello = functions.https.onRequest((request, response) => {
  if (request.body.name === undefined) {
    response.status(200).send("Hello from Firebase!");
  }
  if (request.body.name === "") {
    console.log(request.body);
    response.status(400).end();
  }

  response.status(200).send(`Hello ${request.body.name}`);
});

export const upload = functions.https.onRequest((request, response) => {
  if (request.method !== 'POST') {
    response.status(405).end();
  }

  const busboy = new BusBoy({ headers: request.headers });

  console.log(JSON.stringify(request.headers));

  const uploads: any[string] = {};

  busboy.on('failed', (fieldname: string, val: any) => {
    uploads[fieldname] = val;
  })

  busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
    // Note that os.tmpdir() is an in-memory file system, so should
    // only be used for files small enough to fit in memory.
    const filepath = path.join(os.tmpdir(), filename)
    uploads[fieldname] = filepath;
    file.pipe(fs.createWriteStream(filepath));
  })

  busboy.on('finish', () => {
    // *** Process uploaded files here ***
    response.send(uploads);
    for (const name in uploads) {
      const file = uploads[name];
      fs.unlinkSync(file);
    }

    response.end();
  })

  busboy.end(request.rawBody);
});