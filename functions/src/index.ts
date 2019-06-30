import * as functions from 'firebase-functions';

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
