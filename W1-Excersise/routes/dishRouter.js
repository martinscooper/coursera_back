const express = require('express');

const dishRouter = express.Router();

dishRouter.all('/', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

dishRouter.get('/', (req, res, next) => {
    res.end('Will send all the dishes to you!');
})

dishRouter.post('/', (req, res, next) => {
    res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
})

dishRouter.delete('/', (req, res, next) => {
    res.end('Deleting all dishes');
});

dishRouter.put('/', (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})

dishRouter.get('/:dishId', (req, res) => {
    res.end(`Will send you the information of the dish with id: ${req.params.dishId}`);
})

dishRouter.post('/:dishId', (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /dishes/${req.params.dishId}`);
})

dishRouter.delete('/:dishId', (req, res) => {
    res.end(`Will delete the dish with id ${req.params.dishId}.`);
});

dishRouter.put('/:dishId', (req, res) => {
    res.write(`Will update the dish with id ${req.params.dishId}.`)
    res.end(`Updating dish with name: '${req.body.name}' and description: '${req.body.description}.'`)
});

module.exports = dishRouter;