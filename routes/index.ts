import express from 'express';
import path from "path";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import errorHandler from "errorhandler";
import jwt from 'jsonwebtoken';
// import jwt from 'express-jwt';
import "reflect-metadata";

export const router = express.Router();

router.get('/login', function (req, res) {
    // if user is found and password is right
    // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
        username: req.body.username
    };

    const token = jwt.sign(payload, '@9O37m1O3ISg', {
        expiresIn: '1d' // expires in 24 hours
    });

    // return the information including token as JSON
    res.json({
        success: true,
        token: token
    });
});

