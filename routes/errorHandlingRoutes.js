const express = require('express');
const router = express.Router();
const {showExpressError,showErrorPage}=require('../controller/errorHandlingController')

router.all('*',showExpressError )

router.use(showErrorPage);

module.exports=router