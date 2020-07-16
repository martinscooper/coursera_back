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
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
// .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {

//     Favorites.findById(req.body.user)
//     .then((favorites) => {
//         if (favorites != null){
//             req.body.dishes.map((dishId) => {
//                 Dishes.findById(dishId).
//                 then((dish => {
//                     if (dish != null){
//                         favorites.dishes.findOne({_id: dishId})
//                         .then((d) => {
//                             if (d != null){
//                                 err = new Error('Favorite dish ' + dishId + ' already exists.');
//                                 err.status = 404;
//                                 return next(err);
//                             }
//                         })
//                     }
//                     else {

//                     }
//                 })

//             })
//         }
//         else {
            
//         }
//         console.log('Favorite dish added ', favoriteDish);
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(favoriteDish);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })

favoritesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (favorites){
            Dishes.findById(req.params.dishId)
            .then(dish => {
                if (dish) {
                    Favorites.findOne({dishes: req.params.dishId})
                    .then(dish => {
                        if (!dish) {
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
                    })
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
            
        }
        else {
            Favorites.create({user: req.user._id})
            .then(favorites => {
                Dishes.findById(req.params.dishId)
                .then(dish => {
                    if (dish) {
                        Favorites.findOne({dishes: req.params.dishId})
                        .then(dish => {
                            if (!dish) {
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
                        })
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

module.exports = favoritesRouter;