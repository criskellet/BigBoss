// minions.js

const express = require('express');
const minionsRouter = express.Router();
minionsRouter.use(express.static('public'));

// import the database functions
const {
    addToDatabase,
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase,
    deleteFromDatabasebyId
} = require('./db');

// Extract the minion id
minionsRouter.param('minionId', (req, res, next, id) => {
    const minion = getFromDatabaseById('minions', id);
    // If minion id given is not found in the minions array
    if (!minion) {
        res.status(404).send('Minion not found');
    } else {
        // store the minion index in the request object and call next 
        req.minion = minion;
        next();
    }
});



minionsRouter.get('/', (req, res, next) => {
    // Return an array of all the minions
    const allMinions = getAllFromDatabase('minions');
    res.send(allMinions);
     
});

minionsRouter.post('/', (req, res, next) => {
    // create a new minion and save it to the database
    const minion = req.body;
    // Check that the minion has a name, a title and a salary
    if (!minion.name || !minion.title || !minion.salary) {
        res.status(400).send('Minion information missing');
    } else {
        // add new minion to the database
        const newMinion = addToDatabase('minions', minion);
        res.send(newMinion);
    }
   
});

minionsRouter.get('/:minionId', (req, res, next) => {
    // get a single minion by id
    res.send(req.minion);
});

minionsRouter.put('/:minionId', (req, res, next) => {
    // update a single minion by id
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    res.send(updatedMinion);
});

minionsRouter.delete('/:minionId', (req, res, next) => {
    // delete a single minion by id
    const deletedMinion = deleteFromDatabaseById('minions', req.minionIndex);
    // delete was successful
    if (deletedMinion) {
        res.status(204).send();
    } else {
        // failed to delete minion
        res.status(404).send('Failed to delete minion');
    }
});


module.exports = minionsRouter;
