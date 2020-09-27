const express = require('express');

const favoritesRouter = express.Router();
const cors = require('./cors');
const Favorites = require('../models/favorites')
const Dishes = require('../models/dishes')

var authenticate = require('../authenticate');
const f = require('session-file-store');


favoritesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOneAndDelete({user: req.user._id})
    .then((favorites) => {
        if (favorites){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }
        else {
            err = new Error('There where no favorites anyway.');
            err.status = 404;
            return next(err);
        }
    })
})
.post(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (favorites){
            for(var key in favorites){
                Dishes.findById(favorites[key])
                .then(dish => {
                    if (dish) {
                        if (!favorites.dishes.id(favorites[key])){
                            favorites.dishes.push(favorites[key]);
                            favorites.save();
                        }
                        else {
                            err = new Error('Dish ' + favorites[key] + ' is already a favourite.');
                            err.status = 404;
                            return next(err);
                        }
                    }
                    else {
                        err = new Error('Dish ' + favorites[key] + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                })
            }            
        }
        else {
            Favorites.create({user: req.user._id, dishes: req.body})
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
                
        }
            
    })
});


favoritesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (favorites){
            Dishes.findById(req.params.dishId)
            .then(dish => {
                if (dish) {
                    if (!favorites.dishes.id(req.params.dishId)){
                        favorites.dishes.push(req.params.dishId);
                        favorites.save()
                        .then(favorites => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites);
                        })
                    }
                    else {
                        err = new Error('Dish ' + req.params.dishId + ' is already a favourite.');
                        err.status = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
        }
        else {
            Favorites.create({user: req.user._id, dishes:[req.params.dishId]})
            .then(favorites => {
                Dishes.findById(req.params.dishId)
                .then(dish => {
                    if (dish) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    }
                    else {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }) 
            })
        }
            
    })
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (favorites) {  
            if (favorites.dishes.id(req.params.dishId)){
                favorites.dishes.id(req.params.dishId).remove();
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);  
            })}           
        }
        else {
            err = new Error('You have no favorites dishes.');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id, dishes: req.params.dishId})
    .populate()
    .then(dish => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish)
    })
});

module.exports = favoritesRouter;