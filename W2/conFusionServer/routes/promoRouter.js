const express = require('express');
const cors = require('./cors');
const promotions = require('../models/promotions')
const promotionRouter = express.Router();
const authenticate = require('../authenticate')

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    promotions.find({})
    .then(promotions => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions)
    })
    .catch( err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.create(req.body)
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
    })
    .catch( err => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.deleteMany({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch( err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})


promotionRouter.route('/:promId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    promotions.findById(req.params.promId)
    .then(promotion => {
        if (promotion != null ){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion)
        }
        else {
            err = new Error(`Promotion ${req.params.promId} not found`);
            err.statusCode= 404;
            return next(err); 
        }
    })
    .catch( err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.findByIdAnddelete(cors.corsWithOptions, req.params.promId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch( err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    promotions.findByIdAndUpdate(req.params.promId, {$set: req.body}, {new: true})
    .then(promotion => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion)
    })
    .catch( err => next(err));
})

module.exports = promotionRouter;