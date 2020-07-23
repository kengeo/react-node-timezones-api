const { admin, db } = require('../firebase');
const express = require('express');
const users = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const collection = 'users';

// Create new user
users.post('/add', async (req, res) => {
  // try {
  //   admin.auth().createUser({
  //     email: req.body.email,
  //     emailVerified: false,
  //     // phoneNumber: req.body.user.phone,
  //     password: hash,
  //     displayName: req.body.username,
  //     disabled: false,
  //     roles: req.body.roles,
  //   });
  //   res.json({ message: 'User Created' });
  // } catch (e) {
  //   console.log(e);
  //   res.json({ message: 'Error creating user' });
  // }

  await bcrypt.hash(
    req.body.user.password,
    saltRounds,
    (err, hash) => {
      console.log(hash);
      try {
        admin.auth().createUser({
          email: req.body.email,
          emailVerified: false,
          phoneNumber: req.body.user.phone,
          password: hash,
          displayName: req.body.user.name,
          disabled: false,
        });
        res.json({ message: 'User Created' });
      } catch (e) {
        console.log(e);
        res.json({ message: 'Error creating user' });
      }
    },
  );
});

// Login user
users.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    const user = await admin.auth().getUserByEmail(req.body.email);
    try {
      const token = await admin
        .auth()
        .createCustomToken(req.body.email);
      res.json(token);
    } catch (e) {
      console.log(e);
      res.json({
        message: 'Error Generating Token!Please try again',
      });
    }
  } catch (e) {
    res.json({ message: 'no user record found' });
  }
});

// Display single timezone
users.get('/:user_id', async (req, res) => {
  try {
    const document = db
      .collection(collection)
      .doc(req.params.user_id);
    let item = await document.get();
    let response = item.data();
    res.send(response);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Display all users
users.get('/all', async (req, res) => {
  try {
    let query = db.collection(collection);
    let response = [];
    await query.get().then((querySnapshot) => {
      let docs = querySnapshot.docs;
      for (let doc of docs) {
        const selectedItem = {
          id: doc.id,
          item: doc.data().item,
        };
        response.push(selectedItem);
      }
      return res.send(response);
    });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
});

// Update timezone
users.put('/update/:user_id', async (req, res) => {
  try {
    const document = db
      .collection(collection)
      .doc(req.params.timezone_id);
    await document.update({
      item: req.body.item,
    });
    res.send();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// Delete timezone
users.delete('/delete/:user_id', async (req, res) => {
  try {
    const document = db
      .collection(collection)
      .doc(req.params.timezone_id);
    await document.delete();
    res.send();
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

module.exports = users;
