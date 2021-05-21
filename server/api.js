const express = require('express');
const apiRouter = express.Router();

const morgan = require('morgan');
apiRouter.use(morgan('tiny'));

// import the database functions
const db = require('./db');

// Extract the minion id
apiRouter.param('minionId', (req, res, next, id) => {
    const minionId = Number(id);
    const allMinions = db.getAllFromDatabase('minions');
    const minionIndex = allMinions.findIndex(minion => minion.id === minionId);
    // If minion id given is not found in the minions array
    if (minionIndex === -1) {
        res.status(404).send('Minion not found');
    } else {
        // store the minion index in the request object and call next 
        req.minionIndex = minionIndex;
        req.minion = allMinions[minionIndex];
        next();
    }
});

// Extract the idea id
apiRouter.param('ideaId', (req, res, next, id) => {
    const ideaId = Number(id);
    const allIdeas = db.getAllFromDatabase('ideas');
    const ideaIndex = allIdeas.findIndex(idea => idea.id === ideaId);
    // If idea id given is not found in the ideas array
    if (ideaIndex === -1) {
        res.status(404).send('Idea not found');
    } else {
        // store the minion index in the request object and call next 
        req.ideaIndex = ideaIndex;
        req.idea = allIdeas(ideaIndex);
        next();
    }
});



apiRouter.get('/minions', (req, res, next) => {
    // Return an array of all the minions
    const allMinions = db.getAllFromDatabase('minions');
    res.send(allMinions);
     
});

apiRouter.post('/minions', (req, res, next) => {
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

apiRouter.get('/minions/:minionId', (req, res, next) => {
    // get a single minion by id
    res.send(req.minion);
});

apiRouter.put('/minions/:minionId', (req, res, next) => {
    // update a single minion by id
    req.body.id = req.minionIndex;
    const updatedMinion = db.updateInstanceInDatabase('minions', req.body);
    res.send(updatedMinion);
});

apiRouter.delete('/minions/:minionId', (req, res, next) => {
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

apiRouter.get('/ideas', (req, res, next) => {
    // Get an array of all ideas
    res.send(req.idea);
});

apiRouter.post('/ideas', (req, res, next) => {
    // create a new idea and save it to the database
    const idea = req.body;
    // Check that the idea has a name, a description, number of weeks and weekly revenue
    // Create a validateIdea() to check that all info is present and return relevent error message
    if (!idea.name || !idea.description || !idea.numWeeks || idea.weeklyRevenue) {
        res.status(400).send('Idea information missing');
    } else {
        // add new idea to the database
        const newIdea = addToDatabase('ideas', idea);
        res.send(newIdea);
    }
});

apiRouter.get('/ideas/:ideaId', (req, res, next) => {
    // get a single idea by id
    const idea = db.getFromDatabaseById('ideas', req.ideaIndex);
    res.send(idea);
});

apiRouter.put('/ideas/ideaId', (req, res, next) => {
    // Update a single idea by id
});

apiRouter.delete('/ideas/:ideaId', (req, res, next) => {
    // delete a single idea by id
       
});

apiRouter.get('/meetings', (req, res, next) => {
    // get an array of all meetings
    const allMeetings = db.getAllFromDatabase('meetings');
    res.send(allMeetings);
});

apiRouter.post('/meetings', (req, res, next) => {
    // create a new meeting and save it to the database
});

apiRouter.delete('/meetings', (req, res, next) => {
    // delete all meetings from the database
});
module.exports = apiRouter;
