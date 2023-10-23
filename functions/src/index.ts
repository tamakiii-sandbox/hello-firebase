import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as BusBoy from 'busboy';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

const app = express();

app.get('/', (request, response) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr
  response.send(`
    <!doctype html>
      <head>
        <title>Time</title>
        <link rel="stylesheet" href="/style.css">
        <script src="/script.js"></script>
      </head>
      <body>
        <p>In London, the clock strikes: <span id="bongs">${'BONG ' . repeat(hours)}</span></p>
        <button onClick="refresh(this)">Refresh</button>
      </body>
    </html>
  `)
});

app.get('/api', (request, response) => {
  const date = new Date();
  const hours = (date.getHours() % 12) + 1; // London is UTC + 1hr
  response.json({ bongs: 'BONG ' . repeat(hours) });
});

app.use(cors({ origin: true }));

exports.app = functions.https.onRequest(app);

export const addMessage = functions.https.onRequest(async (request, response) => {
  const original = request.query.text;
  const snapshot = await admin.database().ref('/message').push({ original });
  response.redirect(303, snapshot.ref.toString());
});

export const hello = functions.https.onRequest((request, response) => {
  if (request.body.name === undefined) {
    response.status(200).send("Hello from Firebase!");
  } else if (request.body.name === "") {
    console.log(request.body);
    response.status(400).end();
  } else {
    response.status(200).send(`Hello ${request.body.name}`);
  }
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

exports.helloPubSub = (event: any, callback: any) => {
  const pubsubMessage = event.data;
  const name = pubsubMessage.data ? Buffer.from(pubsubMessage.data, 'base64').toString() : 'World';

  console.log(`Hello, ${name}`);

  callback();
}
