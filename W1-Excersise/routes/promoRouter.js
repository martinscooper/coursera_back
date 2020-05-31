const express = require('express');

const promotionRouter = express.Router();

promotionRouter.all('/', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

promotionRouter.get('/', (req, res, next) => {
    res.end('Will send all the promotions to you!');
})

promotionRouter.post('/', (req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})

promotionRouter.delete('/', (req, res, next) => {
    res.end('Deleting all promotions');
});

promotionRouter.put('/', (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})

promotionRouter.get('/:promotionId', (req, res) => {
    res.end(`Will send you the information of the promotion with id: ${req.params.promotionId}`);
})

promotionRouter.post('/:promotionId', (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})

promotionRouter.delete('/:promotionId', (req, res) => {
    res.end(`Will delete the promotion with id ${req.params.promotionId}.`);
});

promotionRouter.put('/:promotionId', (req, res) => {
    res.write(`Will update the promotion with id ${req.params.promotionId}.`)
    res.end(`Updating promotion with name: '${req.body.name}' and description: '${req.body.description}.'`)
});

module.exports = promotionRouter;