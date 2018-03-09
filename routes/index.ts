import express from 'express';
import path from "path";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import errorHandler from "errorhandler";
import 'jsonwebtoken';
import jwt from 'express-jwt';
import "reflect-metadata";

export const router = express.Router();

router.get('/login', function(req, res) {
    const obj = {success: true, token: 'exampleToken'};
    res.setHeader('Content-Type', 'application/json');
    res.send(obj);
});

