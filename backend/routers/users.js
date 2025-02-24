const User = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.get(`/`, async (req, res) => {
    const userList = await User.find()

    if(!userList) {
        res.status(500).json({success:false})
    }
    res.send(userList)
})

// single user
router.get(`/:id`, async (req, res) => {
    const user = await User.findById(req.params.id)

    if(!user) {
        res.status(500).json({message: 'The user with given ID was not found'})
    }
    res.status(200).send(user)
})

router.post(`/login`, async (req, res) => {
    const user = await User.findOne({userName: req.body.userName})
    const secret = process.env.secret

    if (!user) {
        return res.status(400).send('The user was not found')
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        },
        secret,
        {expiresIn: '1d'}
        )
        res.status(200).send({user: user, token: token})
    }
    else {
        res.status(400).send('The password is wrong')
    }
})

router.post(`/signup`, (req, res) => {
    const user = new User({
        userName: req.body.userName,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        lastLogin: req.body.lastLogin,
        isAdmin: req.body.isAdmin
    })
    user.save().then((createdUser=> {
        res.status(201).json(createdUser)
    })).catch((err) => {
        res.status(500).json({
            error:err,
            success: false
        })
    })
})
module.exports = router
