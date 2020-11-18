const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return Promise.reject('Incorrect form submission');
    }
    return db.select('email', 'hash').from('login').where({ email: email })
        .then(data => {
            if (bcrypt.compareSync(password, data[0].hash)) {
                return db.select('*').from('users').where({ email: email })
                    .then(user => user[0])
                    .catch(err => Promise.reject('Unable to get user'));
            } else {
                return Promise.reject('Wrong credentials');
            }
        })
        .catch(err => Promise.rejectn('Wrong credentials'));
}

const getAuthTokenId = (req, res) => {
    const { authorization } = req.headers;
    return redisClient.get(authorization, (err, reply) => {
        if (err || !reply) {
            return res.status(401).send('Unauthorized');
        }
        return res.json({ id: reply })
    });
}

const signToken = (email) => {
    return jwt.sign({ email: email }, 'JWT-SECRET', { expiresIn: '2 days' });
}

const setToken = (key, value) => {
    return Promise.resolve(redisClient.set(key, value));
}

const createSession = (user) => {
    const { email, id } = user;
    const token = signToken(email);
    return setToken(token, id)
        .then(() => {
            return { success: 'true', userId: id, token, user }
        })
        .catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId(req, res) : handleSignin(db, bcrypt, req, res)
        .then(data => {
            return data.id && data.email ? createSession(data) : Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
}

module.exports = {
    signinAuthentication: signinAuthentication,
    redisClient: redisClient
}