const express = require('express');
var cookieParser = require('cookie-parser')

const bodyParser = require('body-parser');

const app = express();

app.use(cookieParser())
app.use(bodyParser.json())

var loginRouter = require('./routes/user')

app.use('/user', loginRouter)

app.listen(3000, () => {
    console.log("API at port 3000")
})

module.exports = app;