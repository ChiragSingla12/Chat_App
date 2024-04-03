const express = require('express');
const app = express();

const dotenv = require('dotenv')
dotenv.config();

const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');

const userRoutes = require('./router/user');
const pageRoutes = require('./router/page');

app.use(cors({
    origin: '*',
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json({extended: false}));

app.use(pageRoutes);
app.use('/user', userRoutes);

app.use((req, res) =>{
    res.sendFile(path.join(__dirname,`${req.url}`))
})

sequelize
    .sync()
    .then(() => {
        app.listen(3000, (err) => {
            console.log("listening dynamic-routing at 3000")
            // app.listen(3000);
        });
    })
    .catch((err) => {
        console.log(err)
    })