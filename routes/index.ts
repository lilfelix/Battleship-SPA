"use strict";
import express from 'express';
import path from "path";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import errorHandler from "errorhandler";
import jwt from 'jsonwebtoken';
import "reflect-metadata";
import * as handler from '../bin/requestHandler';
import { server } from '../bin/www';
import { User } from '../entity/User';

const authSecret = '@9O37m1O3ISg';
export const router = express.Router();

router.post('/auth', async function (req, res, next) {
    var result: any;
    if (req.body.type === 'login') {
        result = await handler.authUser(req.body); // Returns auth object

        // Check if authentication was successful. If not, {} is returned
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            return emptyResponse(res, 'ERROR: user authentication failed');
        } else {
            result.payload.pwHash = '';
        }
    } else if (req.body.type === 'register') {
        result = await handler.createUser(req.body);

        // Check if registration was successful. If not, {} is returned
        if (Object.keys(result).length === 0 && result.constructor === Object) {
            return emptyResponse(res, 'ERROR: user registration failed');
        } else {
            result.payload.pwHash = '';
        }
    } else {
        return emptyResponse(res, 'ERROR: invalid auth request received');
    }
    const token = jwt.sign({ username: req.body.username }, authSecret, { expiresIn: '1d' });
    res.cookie('token', token, { maxAge: 360000 });
    res.json(result);
    server.broadcast({ type: 'user', payload: { username: req.body.username } });
    // updateActiveUsers(result.payload);
});

// // For all requests after login, authenticate token
// router.use('*', function (req, res) {
//     const cookies = req.cookies;
//     if (cookies.token == null) {
//         console.log('token cookie is null or undefined');
//         return; // TODO 
//     }
//     // verify a token symmetric
//     jwt.verify(cookies.token, authSecret, function (err: any, decoded: any) {
//         console.log('decoded token: ');
//         console.dir(decoded);
//     });
// });

// Returns names of users with open websockets
router.get('/active', function (req, res) {
    const users = handler.getActiveUsers();
    if (users === []) {
        console.log('No active users :(');
    } else {
        console.log('Sending active users: ', users);
        res.json(users);
    }
});

// Process challenge
router.post('/challenge', function (req, res) {
    const success = handler.sendChallenges(req.body);
    success ? res.json({ success: true }) : res.json({ success: false });
});

router.post('/message', function(req, res) {
    const success = server.broadcast(req.body);
    console.log('success in router is', success);
    success ? res.json({ success: true }) : res.json({ success: false });
    // TODO save msg to chat history table in db
});

function emptyResponse(res: express.Response, msg: string) {
    console.log(msg);
    res.json({});
}

// function updateActiveUsers(user: User) {
//     server.activeUsers.push(user);
//     console.log('Currently active users:');
//     console.dir(server.activeUsers);
// }