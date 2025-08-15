const express = require('express')
const router = express.Router()
const { showRegisterForm, registerUser, showLoginForm,  logoutUser , loginUser} = require('../controller/userController')

router.get('/register', showRegisterForm)
router.get('/login', showLoginForm)

router.post('/register', registerUser)

router.post('/login', loginUser)

router.get('/logout', logoutUser)

module.exports = router