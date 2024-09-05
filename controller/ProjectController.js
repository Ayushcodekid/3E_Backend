const ProjectModel = require("../models/Project");
const ProjectUserModel = require("../models/ProjectUsers");
const UserModel = require("../models/User");
const mongoose = require("mongoose");


const createProject = async (req, res) => {
    const { project_name, owner } = req.body;

    // console.log(req.body);

    const newProject = new ProjectModel({ ...req.body });
    try {
        const project = await newProject.save();
        res.status(201).json(project);
    } catch (err) {
        console.log('Error :',err);
        res.status(400).send('Bad Request');
    }
};

const getProjectsByOwner = async (req, res) => {
    const { ownerId } = req.params;

    try {
        const projects = await ProjectModel.find({ owner: ownerId }, 'project_name');
        res.status(200).json(projects);
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};

const addUserToProject = async (req, res) => {
    const { userEmail, projectId, role } = req.body;

    console.log('Received parameters:', { userEmail, projectId, role });

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).send('Invalid Project ID');
    }

    try {
        const user = await UserModel.findOne({ username: userEmail });

        if (!user) {
            return res.status(404).send('User not found');
        }

        console.log('User cognitoUserId:', user.cognitoUserId);

        const existingEntry = await ProjectUserModel.findOne({ projectId, user: user.cognitoUserId });
        if (existingEntry) {
            return res.status(400).send('User already in the project');
        }

        const newProjectUser = new ProjectUserModel({
            projectId: projectId,
            user: user.cognitoUserId,
            role: role
        });

        await newProjectUser.save();
        return  res.status(201).json(newProjectUser);
    } catch (err) {
        console.log(err);
        if (!res.headersSent) {
           return  res.status(400).send('Bad Request');
        }
    }
};


const getUserProjects = async (req, res) => {
    const { userId } = req.params;

    try {
        const projectUsers = await ProjectUserModel.find({ user: userId }, 'projectId role');
        // console.log(projectUsers);

        // const projectIds = projectUsers.map(pu => pu.projectId);
        // const projectRoles = projectUsers.map(pu => pu.role);

        const ownedProjects = await ProjectModel.find({ owner: userId }, 'project_name');

            const associatedProjectNames = await ProjectModel.find({ _id: { $in: projectUsers.map(pu => pu.projectId) } }, 'project_name');
            const associatedProjectsWithRole = associatedProjectNames.map(project => ({
                project_name: project.project_name,
                role: projectUsers.find(pu => pu.projectId.toString() === project._id.toString()).role
            }));

        console.log(associatedProjectsWithRole)

        // console.log('Owned projects:', ownedProjects);
        // console.log('Associated projects:', associatedProjects);

        res.status(200).json({
            ownedProjects,
            associatedProjects: associatedProjectsWithRole
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};

const getProjectUsers = async (req, res) => {
    const { projectId } = req.params;

    try{
        const projectUsers = await ProjectUserModel.find({ projectId: projectId });
        // console.log("Project user objects: ",projectUsers);

        const projectUserNames = await UserModel.find({ cognitoUserId: { $in: projectUsers.map(pu => pu.user) } });
        // console.log("Project user email :",projectUserNames);

        const projectUsersWithRoles = projectUserNames.map(project => ({
            username: project.username,
            role: projectUsers.find(pu => pu.user === project.cognitoUserId).role
        }));

        console.log("Final object to be sent :",projectUsersWithRoles)

        res.status(200).json({
            data: projectUsersWithRoles
        });
    }catch(err){
        console.log(err);
    }
}




// const acceptInvite = async (req, res) => {
//     const { userEmail, projectId, role } = req.body;

//     try {
//         // Add the user to the project
//         const user = await UserModel.findOne({ email: userEmail });
//         if (!user) return res.status(404).send('User not found');

//         const existingEntry = await ProjectUserModel.findOne({ projectId, user: user.cognitoUserId });
//         if (existingEntry) return res.status(400).send('User already added to the project');

//         const newProjectUser = new ProjectUserModel({ projectId, user: user.cognitoUserId, role });
//         await newProjectUser.save();

//         res.status(200).json({ message: 'User added to project successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding user to project', error: error.toString() });
//     }
// }


module.exports = {
    createProject,
    getProjectsByOwner,
    addUserToProject,
    getUserProjects,
    getProjectUsers,
    // acceptInvite
};
