const { response } = require("express");

const handleProfileGet = (db) => (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id: id })
        .then(user => {
            if (user.length) {
                res.json(user[0]);;
            } else {
                res.status(400).json('Not Found');
            }
        })
        .catch(err => res.status(400).json('Error getting user'));
}

const handleProfileUpdate = (db) => (req, res) => {
    const { id } = req.params;
    const { name, age, pet } = req.body.formInput;
    db('users')
        .where({ id: id })
        .update({ name: name })
        .then(response => {
            if (response) {
                res.json('succsess')
            } else {
                res.status(400).json('Unable to update')
            }
        })
        .catch(err => res.status(400).json('Error updating user'));

}


module.exports = {
    handleProfileGet: handleProfileGet,
    handleProfileUpdate: handleProfileUpdate
}