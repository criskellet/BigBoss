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
        // store the minion in the request object and call next 
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


// Minion work routes


// Get the all the work for the given minion
minionsRouter.get('/:minionId/work', (req, res, next) => {
    // get the work array for the specified minion
    let allWork = getAllFromDatabase('work');
    // filter out the work for the specified minion
    let minionWork = allWork.filter((work) => {
        return work.minionId === req.params.minionId;
        });
        
    res.send(minionWork);

});

// add work to existing work for the given minion
minionsRouter.post('/:minionId/work', (req, res, next) => {
    // add work to minions exiting work load
    let workToAdd = req.body;
    workToAdd.minionId = req.params.minionId;
    const newWork = addToDatabase('work', workToAdd);
    res.status(201).send(newWork);
    
});

// Extract the work id
minionsRouter.param('workId', (req, res, next, id) => {
    const work = getFromDatabaseById('work', id);
    // If work id given is not found in the minions array
    if (!work) {
        res.status(404).send('Work not found');
    } else {
        // store the work in the request object and call next 
        req.work = work;
        next();
    }
});


// Update given work entry for specified minion
minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
    if (req.params.minionId !== req.body.minionId) {
        res.status(400).send();
    }
    else {
        let updatedWorkInstance = updateInstanceInDatabase('work', req.body);
        res.send(updatedWorkInstance);
    }
});

// delete selected work item from minions work load
minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
    const deletedWork = deleteFromDatabasebyId('work', req.params.workId);
    if (deletedWork) {
        res.status(204).send();
    } else {
        res.status(500).send();;
    }

});

module.exports = minionsRouter;
