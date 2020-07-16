const express = require('express');
const cors = require('./cors');
const leaders = require('../models/leaders')
const leaderRouter = express.Router();
const authenticate = require('../authenticate')
leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, cors.cors, (req, res, next) => {
    leaders.find({})
    .then(leaders => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders)
    })
    .catch( err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.create(req.body)
    .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
    })
    .catch( err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch( err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})


leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    leaders.findById(req.params.leaderId)
    .then(leader => {
        if (leader != null ){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader)
        }
        else {
            err = new Error(`leader ${req.params.leaderId} not found`);
            err.statusCode= 404;
            return next(err); 
        }
    })
    .catch( err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.findByIdAnddelete(cors.corsWithOptions, req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch( err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
    .then(leader => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
    })
    .catch( err => next(err));
})

module.exports = leaderRouter;