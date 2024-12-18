const express = require('express');
const session = require('express-session');
const socketIo = require('socket.io');
const sharedSession = require('express-socket.io-session');
const sqlite3 = require('sqlite3').verbose();
const SQLiteStore = require('connect-sqlite3')(session);
const routes = require('./modules/routes');
const socket = require('./modules/socket');

const PORT = process.env.PORT || 3000;

const app = express();

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = socketIo(server);

const sessionMiddleware = session({
    store: new SQLiteStore,
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
});

app.use(sessionMiddleware);

io.use(sharedSession(sessionMiddleware, {
    autoSave: true
}));

app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database('./data/database.db', (err) => {
    if (err) {
        console.error('Could not open database', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
};

app.get('/', routes.indexGET);

app.get('/login', routes.loginGET);

app.post('/login', routes.loginPOST);

app.get('/logout', routes.logoutGET);

app.get('/chat', isAuthenticated, routes.chatGET);

io.on('connection', socket.handleConnection);