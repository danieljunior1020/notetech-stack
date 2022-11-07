const mongoose = require('mongoose')

const connDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connDB