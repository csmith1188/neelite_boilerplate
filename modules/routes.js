const crypto = require('crypto');
const db = require('../database'); // Assuming you have a database module to handle DB operations

const indexGET = (req, res) => {
    res.send('Hello World!');
};

const loginGET = (req, res) => {
    res.send('Login page');
};

const loginPOST = (req, res) => {
    const loginPOST = (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const hash = crypto.createHash('sha256').update(password).digest('hex');

        db.getUserByUsername(username, (err, user) => {
            if (err) {
                return res.status(500).send('Internal server error');
            }

            if (!user || user.password !== hash) {
                return res.status(401).send('Invalid username or password');
            }

            // Assuming you have a function to create a session or token
            const token = createSession(user);

            res.status(200).send({ message: 'Login successful', token });
        });
    };
};

const logoutGET = (req, res) => {
    res.send('Logout page');
};

const chatGET = (req, res) => {
    res.send('Chat page');
};

module.exports = {
    indexGET
};