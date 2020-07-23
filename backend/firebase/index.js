const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const auth = require('firebase-admin');

const serviceAccount = require('./permissions.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://timezone-toptal-398d5.firebaseio.com',
});

const db = admin.firestore();

module.exports = { functions, admin, db };
