const express = require('express');
export const router = express.Router();
import WebSocket from 'ws';
import 'body-parser';
import jwt from 'express-jwt';
// const app = require('../server');
import { Server } from '../server';

const tokenSecret = "In a real app, this would come from a config file";

/* GET static content */
router.get('*', express.static(__dirname + '/../client/dist'));


router.get('/login', function(req: Request, res: Response) {
    // TODO authenticate user in db
    const token = {
        // TODO hash password
        // username: req.
    };
    const signedToken = jwt.sign(token, tokenSecret, { expiresIn: 90000 } );
})
