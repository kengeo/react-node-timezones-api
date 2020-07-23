const { db } = require('../firebase');
const express = require('express');
const timezones = express.Router();

const collection = 'timezones';

// Display all timezones
timezones.get('/all', async (req, res) => {
  let response = [];
  await db
    .collection(collection)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach(function (doc) {
        // doc.data() is never undefined for query doc snapshots
        //console.log(doc.id, ' => ', doc.data());
        let item = {
          id: doc.id,
          name: doc.data().name,
          timezone: doc.data().timezone,
        };
        // console.log(item);
        response.push(item);
      });
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });
  res.send(response);
});

// Create new timezone
timezones.post('/add', async (req, res) => {
  await db
    .collection(collection)
    .add({
      timezone: req.body.timezone,
      name: req.body.name,
    })
    .then(function (docRef) {
      console.log('Document written with ID: ', docRef.id);
      res.send(docRef.id);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

// Display single timezone
timezones.get('/:timezone_id', async (req, res) => {
  try {
    const document = db
      .collection(collection)
      .doc(req.params.timezone_id);
    let item = await document.get();
    let response = item.data();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Update timezone
timezones.put('/update/:timezone_id', async (req, res) => {
  db.collection(collection)
    .doc(req.params.timezone_id)
    .update({
      timezone: req.body.timezone,
      name: req.body.name,
    })
    .then(() => {
      res.send();
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

// Delete timezone
timezones.delete('/delete/:timezone_id', async (req, res) => {
  console.log(req.params.timezone_id);
  db.collection(collection)
    .doc(req.params.timezone_id)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!');
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

module.exports = timezones;
