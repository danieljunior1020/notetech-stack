const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
     username: {
        type: String,
        required: true
     },
     password: {
        type: String,
        required: true
     },
     rol: [{
        type: String,
        default: 'Participants'
     }],
     active: {
        type: Boolean,
        default: true
     },
})

module.exports = mongoose.model('User', userSchema)