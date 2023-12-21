const admin = require("firebase-admin");

const serviceAccountKey = require("./serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const auth = admin.auth(app);
module.exports = auth;
