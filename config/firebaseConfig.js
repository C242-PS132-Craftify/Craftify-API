const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(
    require("../keys/craftify-capstone-firebase-adminsdk-z38iz-e04538ac04.json")
  ),
  databaseURL: "https://craftify-capstone.firebaseio.com",
});

const db = admin.firestore();
module.exports = { admin, db };
