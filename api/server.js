require('dotenv').config()

const express = require('express')


// API config
const app = express()

const path = require('path')

const { logger } = require('./middlewares/logger')

const errorHandler = require('./middlewares/errorHandler')

const cookieParser = require('cookie-parser')

const cors = require('cors')

const corsOption = require('./config/corsOption')

const connDB = require('./config/dbCon')

const mongoose = require('mongoose')

const { logEvent } = require('./middlewares/logger')

const PORT = process.env.PORT || 4000

console.log(process.env.NODE_ENV)


connDB()

// middlewares
app.use(logger)

app.use(cors(corsOption))

app.use(express.json())

app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))

app.use('/users', require('./routes/userRoutes'))

app.all('*', (req, res) => {
    res.status(404)

    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 not found.' })
    } else {
        res.type('txt').send('404 not found.')
    }
})


app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('connect to dbmongo')

    // run server
    app.listen(PORT, () => console.log(`server is run at: ${PORT}`))
})


mongoose.connection.on('error', err => {
     console.log(err)

     logEvent(`${err.no}: ${err.code}\t${err.syscall}\t
     ${err.hostname}`, 'mongoErrLog.log')
})