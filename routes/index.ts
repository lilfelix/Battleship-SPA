"use strict";
import express from 'express';
import path from "path";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import errorHandler from "errorhandler";
import jwt from 'jsonwebtoken';
import "reflect-metadata";
import * as handler from '../bin/requestHandler';

const authSecret = '@9O37m1O3ISg';
export const router = express.Router();

router.post('/auth', async function (req, res) {
    if (req.body.type === 'login') {
        res.json(await handler.authUser(req.body));
    } else if (req.body.type === 'register') {
        const result = await handler.createUser(req.body);

        // Check if registration was successful. If not, {} is returned
        if (Object.keys(result).length === 0 && result.constructor === Object) { 
            console.log('ERROR: user registration failed');
            res.json({});
        } else {
            const token = jwt.sign({ username: req.body.username }, authSecret, {expiresIn: '1d'});
            res.cookie('token', token, { maxAge: 360000 });
            res.json(result); // TODO remove pwHash from user obj 
        }
    } else {
        console.log('ERROR: invalid auth request received');
        res.json({});
    }

});

router.get('/login', function (req, res) {

    // if user is found and password is right
    // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
        username: req.body.username
    };

    const token = jwt.sign(payload, authSecret, {
        expiresIn: '1d' // expires in 24 hours
    });

    // Set token cookie
    res.cookie('token', token, { maxAge: 360000 });

    // return the information including token as JSON
    res.json({
        success: true,
        token: token
    });
});

// For all requests after login, authenticate token
router.use('*', function (req, res) {
    const cookies = req.cookies;
    if (cookies.token == null) {
        console.log('token cookie is null or undefined');
        return; // TODO 
    }
    // verify a token symmetric
    jwt.verify(cookies.token, authSecret, function (err: any, decoded: any) {
        console.log('decoded token: ');
        console.dir(decoded);
    });
});

function genToken(username: string) {

    return
}