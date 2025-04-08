const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const db = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: '',
    database: 'smart-brain',
  },
});

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
const profile = require('./controllers/profile');

const app = express();
app.use(express.json());
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:5173' // Allow specific origin
// }));

app.get('/', (req, res) => { res.send('success'); })
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) })
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })
app.listen(3000, () => { console.log('app is running on port 3000'); });

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = user or count
*/