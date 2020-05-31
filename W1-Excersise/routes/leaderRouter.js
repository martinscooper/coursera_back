const express = require('express');

const leaderRouter = express.Router();

leaderRouter.all('/', (req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

leaderRouter.get('/', (req, res, next) => {
    res.end('Will send all the leaders to you!');
})

leaderRouter.post('/', (req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

leaderRouter.delete('/', (req, res, next) => {
    res.end('Deleting all leaders');
});

leaderRouter.put('/', (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})

leaderRouter.get('/:leaderId', (req, res) => {
    res.end(`Will send you the information of the leader with id: ${req.params.leaderId}`);
})

leaderRouter.post('/:leaderId', (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /leaders/${req.params.leaderId}`);
})

leaderRouter.delete('/:leaderId', (req, res) => {
    res.end(`Will delete the leader with id ${req.params.leaderId}.`);
});

leaderRouter.put('/:leaderId', (req, res) => {
    res.write(`Will update the leader with id ${req.params.leaderId}.`)
    res.end(`Updating leader with name: '${req.body.name}' and description: '${req.body.description}.'`)
});

module.exports = leaderRouter;