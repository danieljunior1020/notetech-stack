const allowsOrigins = require('./allowsOrigins')

const corsOption = {
    origin: (origin, callback) => {
        if (allowsOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('not allow by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}


module.exports = corsOption