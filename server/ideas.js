// ideas.js
const express = require('express');
const ideasRouter = express.Router();
ideasRouter.use(express.static('public'));

const morgan = require('morgan');
ideasRouter.use(morgan('tiny'));

// import the database functions
const {
    addToDatabase,
    getAllFromDatabase,
    getFromDatabaseById,
    updateInstanceInDatabase,
    deleteFromDatabaseById

} = require('./db');


// Extract the idea id
ideasRouter.param('ideaId', (req, res, next, id) => {
    // Extract the idea from the database
    const idea = getAllFromDatabaseByIdea('ideas', id);
    
    // If idea id given is not found in the ideas array
    if (!idea) {
        res.status(404).send('Idea not found');
    } else {
        // store the idea in the request object 
        req.idea = idea;
        next();
    }
});


ideasRouter.get('/', (req, res, next) => {
    // Send back all the ideas in the database
    res.send(getAllFromDatabase('ideas'));
});

ideasRouter.post('/', (req, res, next) => {
    // create a new idea and save it to the database
    const idea = req.body;
    // Check that the idea has a name, a description, number of weeks and weekly revenue
    // Create a validateIdea() to check that all info is present and return relevent error message
    if (!idea.name || !idea.description || !idea.numWeeks || idea.weeklyRevenue) {
        res.status(400).send('Idea information missing');
    } else {
        // add new idea to the database
        const newIdea = addToDatabase('ideas', idea);
        res.status(201).send(newIdea);
    }
});

ideasRouter.get('/:ideaId', (req, res, next) => {
    // get a single idea by id
    res.send(req.idea);
});

ideasRouter.put('/ideaId', (req, res, next) => {
    // Update a single idea by id
    const updatedIdea = updateInstanceInDatabase('ideas', req.body);
    res.send(updatedIdea);
});

ideasRouter.delete('/ideas/:ideaId', (req, res, next) => {
    // delete a single idea by id
    const deletedIdea = deleteFromDatabaseByIdea('ideas', req.params.id);
    // if idea has been deleted successfully
    if (deletedIdea) {
        res.status(204).send();
    } else {
        res.status(500).send();
    }
});

module.exports = ideasRouter;