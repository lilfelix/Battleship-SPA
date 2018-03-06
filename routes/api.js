var models = require('../models');
var express = require('express');
var engine = require('../app/engine');
var router = express.Router();
const Op = models.Sequelize.Op;
const WebSocket = require('ws');
const app = require('../app/app');

/* GET static content */
router.get('*',
    express.static(__dirname + '/../client/dist'));

/* GET all securities */
router.get('/securities', function (req, res) {
    models.securities.findAll({ raw: true }).then(function (securities) {
        res.setHeader('Content-Type', 'application/json');
        res.send(securities);
    });
});

/* GET user */
router.get('/user', function (req, res) {
    models.users.findOrCreate({ where: { [Op.or]: [{ id: req.query.id }, { name: req.query.username }] }, defaults: { name: req.query.username }, raw: true }).then(function (user) {
        res.setHeader('Content-Type', 'application/json');
        res.send(user);
    });
});

/* GET portfolio of user */
router.get('/portfolio', function (req, res) {
    let userObj;
    models.users.findOrCreate({
        where: {
            [Op.or]: [{ id: req.query.id }, { name: req.query.username }] // TODO: id is never sent as param
        },
        defaults: { name: req.query.username }
    })
        .spread(function (users, meta) {
            userObj = users.dataValues;
            models.portfolioEntries.findAll({
                where: {
                    userID: userObj.id
                },
                raw: true
            })
                .then((function (entries) {
                    const data = [userObj, entries]; // Return user and user's portfolio
                    res.setHeader('Content-Type', 'application/json');
                    res.send(data);
                }));
        });
});

/* GET security to be added to user portfolio */
router.get('/add', function (req, res) {
    // TODO integrity check of sec
    models.portfolioEntries.findOrCreate({
        where: { userID: req.query.userID, securityID: req.query.securityID },
        defaults: {
            amount: 1,
            userID: req.query.userID,
            securityID: req.query.securityID,
            securityName: req.query.securityName
        }
    })
        .spread((entry, meta) => {
            if (entry._options.isNewRecord) {
                res.setHeader('Content-Type', 'application/json');
                res.send(entry);
            } else {
                return entry.increment('amount', { by: 1 })
                    .then((entry) => { return entry.reload() })
                    .then((entry) => {
                        res.setHeader('Content-Type', 'application/json');
                        res.send(entry);
                    })
            }
        });
});

/* GET orders */
router.get('/orders', function (req, res) {
    models.orders.findAll()
        .then((orders) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(orders);
        });
});


/* POST order from client to server */
router.post('/order', function (req, res) {
    const order = req.body;
    engine.processOrder(models, order).then((broadcastObjects) => {
        if (broadcastObjects !== undefined) {
            console.log('broadcasting:');
            console.dir(broadcastObjects);
            wss.broadcast(broadcastObjects);
            res.setHeader('Content-Type', 'application/json');
            res.send({success: true});
        } else {
            console.log('ERROR: undefined broadcastObjects');
            res.setHeader('Content-Type', 'application/json');
            res.send({success: false});
        }
    });
});

module.exports = router;

