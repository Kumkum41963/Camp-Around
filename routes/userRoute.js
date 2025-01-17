const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser } = require('../controller/userController')

router.get('/register', showRegisterForm)

router.post('/register', registerUser)

router.get('/login', showLoginForm)

router.post('/login', loginUser)

router.get('/logout', logoutUser)

module.exports = router