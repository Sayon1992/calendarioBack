require("dotenv").config();
var firebase = require("firebase");

var configUrl = {
  apiKey: "AIzaSyAupGCTAxHn9XrFi5gqo3p9bBFJeYd1dQo",
  authDomain: "calendario-fd9dc.firebaseapp.com",
  databaseURL: "https://calendario-fd9dc.firebaseio.com/",
  storageBucket: "gs://calendario-fd9dc.appspot.com",
};

firebase.initializeApp(configUrl);

const db = firebase.database();

const Database = {
  db,
};

module.exports = Database;
