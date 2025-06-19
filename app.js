const express = require("express");
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(cors()); // Enable CORS for all origins

const config = require('config');
const dotenv = require('dotenv');
dotenv.config();

const {DB} = require('./servises/db');

// *********** ROUTES *************************

const authRouter = require("./routes/auth");
app.use('/auth', authRouter)

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

app.get('/available', (req, res) => {
    res.status(200).json(
        {status:DB.isAvailable()}
    )
})

app.get('/init-tables', async (req, res) => {
    const result = await DB.initTables(true);
    res.status(200).send(result);
})

const appPort = config.get("app.port") || process.env.DEFAULT_APP_PORT;

app.listen(appPort, async () => {
    console.log(`Listening on port ${config.get('app.port')}`);
    
    const dbIsReady = await DB.init();
    console.log(dbIsReady);
})

