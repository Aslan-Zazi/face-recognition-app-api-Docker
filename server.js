const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');

// Controllers
const register = require('./controllers/register');
const sginin = require('./controllers/sginin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');

const db = knex({
    client: 'pg',
    connection: process.env.POSTGRES_URI
});

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => { res.json('it is working!') });

app.post('/signin', sginin.signinAuthentication(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db));

app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db));

app.put('/image', auth.requireAuth, image.handleImage(db));

app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});
