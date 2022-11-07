const User = require('../models/User')
const Note = require('../models/Note')

const asyncHandler = require('express-async-handler')

const bcrypt = require('bcrypt')


// requestings
const getAllUser = asyncHandler( async (req, res) => {
      const users = await User.find().select('-password').lean()

      if (!users?.length) {
         return res.status(400).json({ message: 'user not found'})
      }

      res.json(users)
})


const createNewUser = asyncHandler( async (req, res) => {
     const { username, password, rol } = req.body

     if (!username || !password || !Array.isArray(rol) || !rol.length) {
           return res.status(400).json({ message: 'the users are required'})
     }

     const duplicate = await User.findOne({ username }).lean().exec()

     if (duplicate) {
        return res.status(409).json({ message: 'duplicate user'})
     }


     const hashs = await bcrypt.hash(password, 10)

     const userObj = { username, 'password': hashs, rol }

    //  create and store new user
    const user = await User.create(userObj)

    if (user) {
        res.status(201).json({ message: `new user ${username} create`})
    } else {
        res.status(400).json({ message: 'user not create'})
    }
})


const updateUser = asyncHandler( async (req, res) => {
    const { id, username, rol, active, password} = req.body

    // confirm dates
    if (!id || !username || !Array.isArray(rol) || !rol.length ||
    typeof active !== 'boolean') {
         return res.status(400).json({ message: 'all fields are required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'user not found'})
    }

    // check duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    // allow update to original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'user duplicate' })
    }

    user.username = username
    user.rol = rol
    user.active = active

    if (password) {
        // hashing password
        user.password = await bcrypt.hash(password, 10)
    }

    const updateUser = await user.save()

    res.json({ message: `${updateUser.username} update`})
})


const deleteUser = asyncHandler( async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'user ID required'})
    }

    const note = await Note.findOne({ user: id }).lean().exec()

    if (note) {
        return res.status(400).json({ message: 'user has assign for notes'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'user not found'})
    }

    const results = await user.deleteOne()

    const replyBy = `username ${results.username} with ID
    ${results._id} delete on`

    res.json(replyBy)
})


module.exports = {
    getAllUser,
    createNewUser,
    updateUser,
    deleteUser
}