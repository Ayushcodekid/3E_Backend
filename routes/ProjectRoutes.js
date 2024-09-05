const express = require('express');
const router = express.Router();
const { getProjectsByOwner,createProject, addUserToProject, getUserProjects, getProjectUsers } = require('../controller/ProjectController');
// Route for creating a new user
router.post('/createProject', createProject);

router.get('/getProjectsByOwner/:ownerId', getProjectsByOwner);

router.post('/addUserToProject', addUserToProject);

router.get('/userProjects/:userId', getUserProjects);

router.get('/projectUsers/:projectId', getProjectUsers);

// router.get('/accept-invite', acceptInvite);

module.exports = router;