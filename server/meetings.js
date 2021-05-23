// meetings.js

const express = require('express');
const meetingsRouter = express.Router();
meetingsRouter.use(express.static('public'));

const morgan = require('morgan');
meetingsRouter.use(morgan('tiny'));

// import the database functions
const { getAllFromDatabase,
    addToDatabase,
    deleteAllFromDatabase,
    createMeeting

} = require('./db');


 meetingsRouter.get('/', (req, res, next) => {
    // Return all the meetings in the database
    const allMeetings = getAllFromDatabase('meetings');
    res.send(allMeetings);

});


meetingsRouter.post('/', (req, res, next) => {
    // create a new meeting and save it to the database
    const newMeeting = addToDatabase('meetings', createMeeting());
    res.status(201).send(newMeeting);
});

meetingsRouter.delete('/', (req, res, next) => {
    // delete all meetings from the database
    deleteAllFromDatabase('meetings');
    res.status(204).send();
});

module.exports = meetingsRouter;

