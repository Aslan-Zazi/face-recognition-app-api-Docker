const jwt = require('jsonwebtoken');

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

const getAuthTokenId = () => {
    console.log('Auth ok');
}

const signToken = (email) => {
    return jwt.sign({ email: email }, 'JWT-SECRET', { expiresIn: '2 days' });
}

const createSession = (user) => {
    const { email, id } = user;
    const token = signToken(email);
    return { success: 'true', userId: id, token, user }
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
    const { authentication } = req.headers;
    return authentication ? getAuthTokenId() : handleSignin(db, bcrypt, req, res)
        .then(data => {
            return data.id && data.email ? createSession(data) : Promise.reject(data);
        })
        .then(session => res.json(session))
        .catch(err => res.status(400).json(err));
}

module.exports = {
    signinAuthentication: signinAuthentication
}