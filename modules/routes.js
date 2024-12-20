const crypto = require('crypto');
const db = require('../database'); // Assuming you have a database module to handle DB operations

const indexGET = (req, res) => {
    res.send('Hello World!');
};

const loginGET = (req, res) => {
    res.send('Login page');
};

const loginPOST = (req, res) => {
    if (req.body.user && req.body.pass) {
        db.get("SELECT * FROM users WHERE username=?;", req.body.user, (err, row) => {
            if (err) {
                console.error(err);
                res.send("There was an error:\n" + err);
            } else if (!row) {
                // Create a new salt for this user
                const salt = crypto.randomBytes(16).toString("hex");

                // Use this salt to "hash" the password
                crypto.pbkdf2(req.body.pass, salt, 1000, 64, "sha512", (err, derivedKey) => {
                    if (err) {
                        res.send("Error hashing password: " + err);
                    } else {
                        const hashedPassword = derivedKey.toString("hex");
                        db.run("INSERT INTO users (username, password, salt) VALUES (?, ?, ?);", [req.body.user, hashedPassword, salt], (err) => {
                            if (err) {
                                res.send("Database error:\n" + err);
                            } else {
                                res.send("Created new user");
                            }
                        });
                    }
                });

            } else {
                // Compare stored password with provided password
                crypto.pbkdf2(req.body.pass, row.salt, 1000, 64, "sha512", (err, derivedKey) => {
                    if (err) {
                        res.send("Error hashing password: " + err);
                    } else {
                        const hashedPassword = derivedKey.toString("hex");
                        if (row.password === hashedPassword) {
                            req.session.user = row.username;
                            res.redirect("/home");
                        } else {
                            res.send("Incorrect password");
                        }
                    }
                });
            }
        });
    } else {
        res.send("You need a username and password");
    }
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