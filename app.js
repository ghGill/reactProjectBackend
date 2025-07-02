const express = require("express");
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl or Postman)
        if (!origin) return callback(null, true);

        // You can allow all domains here — or check against a list
        // For total flexibility (use with caution in production):
        callback(null, true);
    },
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	maxAge: 600, // cache preflight for 10 minutes
    credentials: true,
    exposedHeaders: ['x-access-token', 'x-refresh-token'],
})); // Enable CORS for all origins

const config = require('config');
const dotenv = require('dotenv');
dotenv.config();

const { DB } = require('./servises/db');
const authenticate = require('./middleware/auth');

// to use when we want to send and recieve cookies from and to requests
/*
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl or Postman)
        if (!origin) return callback(null, true);

        // You can allow all domains here — or check against a list
        // For total flexibility (use with caution in production):
        callback(null, true);
    },
    credentials: true,
})); // Enable CORS for all origins

// create cookie example
res.cookie('username', 'cookie content', {
    httpOnly: true,      // cannot be accessed via JavaScript
    secure: false,       // set to true if using HTTPS
    maxAge: 60 * 1000    // 1 minute in milliseconds
});
*/

// *********** ROUTES *************************

app.get('/available', (req, res) => {
    res.status(200).json(
        { status: DB.isAvailable() }
    )
})

app.get('/init-tables', async (req, res) => {
    const result = await DB.initTables(true);
    res.status(200).send(result);
})

const authRouter = require("./routes/auth");
app.use('/auth', authRouter)

app.use(authenticate);

const userRouter = require("./routes/user");
app.use('/user', userRouter)

const potRouter = require("./routes/pot");
app.use('/pot', potRouter)

const colorRouter = require("./routes/color");
app.use('/color', colorRouter)

const overviewRouter = require("./routes/overview");
app.use('/overview', overviewRouter)

const transactionRouter = require("./routes/transaction");
app.use('/transaction', transactionRouter)

const categoryRouter = require("./routes/category");
app.use('/category', categoryRouter)

const appPort = config.get("app.port") || process.env.DEFAULT_APP_PORT;

app.listen(appPort, async () => {
    console.log(`Listening on port ${config.get('app.port')}`);

    const dbIsReady = await DB.init();
    console.log(dbIsReady);
})

