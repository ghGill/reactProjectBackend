const express = require("express");
const cors = require('cors');
const User = require("./models/User");
const userController = require('./controllers/user.js')

const app = express()
app.use(express.json())
app.use(cors()); // Enable CORS for all origins

const config = require('config');

const dotenv = require('dotenv');
dotenv.config();

const authRouter = require("./routes/auth");
const {DB} = require('./servises/db');

app.use('/auth', authRouter)

app.get('/available', (req, res) => {
    res.status(200).json(
        {status:DB.isAvailable()}
    )
})

const appPort = config.get("app.port") || process.env.DEFAULT_APP_PORT;

app.listen(appPort, async () => {
    console.log(`Listening on port ${config.get('app.port')}`);
    
    const dbIsReady = await DB.init();
    console.log(dbIsReady);
    
})

