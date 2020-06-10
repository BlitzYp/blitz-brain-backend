const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const register = require('./controlers/register');
const signin = require("./controlers/signin");
const profile = require("./controlers/profile");
const image = require('./controlers/image');
const knex = require('knex');


const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'd-*sapni',
    database: 'blitz-brain'
  }
});

const app = express();

// app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => { res.send("Epic! Everything is working!") })
app.post("/signin", signin.handleSignIn(db, bcrypt))
app.post("/register", (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get("/profile/:id", (req, res) => { profile.handleProfileGet(req, res, db) })
app.put("/image", (req, res) => { image.handleImage(req, res, db) })
app.post("/imageurl", (req, res) => { image.handleAPICall(req, res) })
// bcrypt.hash("bacon", null, null, function (err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function (err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function (err, res) {
//     // res = false
// });

app.listen(process.env.PORT || 3000, () => {
  console.log(`Everything is working on port ${process.env.PORT}`)
})


/*
/ => res = this is working
/signin => POST success or fail
/ register => POST = return the new created user
/profile/:userid => GET = user
/image => PUT => updated user
*/