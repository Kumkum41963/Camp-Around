const ExpressError = require('../utils/ExpressError');

const showExpressError=(req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
}

const showErrorPage=(err, req, res, next) => {
    const { message = "Something went wrong!", statusCode = 500 } = err;
    if (!err.message) err.message = 'oh , no something is going haywireeeeee!!!'
    res.status(statusCode).render('error', { err });
}

module.exports={showExpressError,showErrorPage}