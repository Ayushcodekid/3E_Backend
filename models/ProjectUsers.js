const mongoose = require('mongoose');
const UserModel = require('./User'); // Assuming User model is in the same directory
const ProjectModel = require('./Project'); // Assuming Project model is in the same directory

const projectUserSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projects',
        required: true,
    },
    user: {
        type: String,
        ref: 'users',
        required: true,
    },
    role: {
        type: String,
        required: true,
    }
});

projectUserSchema.pre('save', async function (next) {
    try {
        const user = await UserModel.findOne({ cognitoUserId: this.user });
        if (!user) {
            const error = new Error('User (Cognito ID) does not exist in the User collection.');
            error.status = 400;
            return next(error);
        }

        const project = await ProjectModel.findById(this.projectId);
        if (!project) {
            const error = new Error('Project does not exist in the Project collection.');
            error.status = 400;
            return next(error);
        }

        next();
    } catch (err) {
        next(err);
    }
});

const ProjectUserModel = mongoose.model('service_providers', projectUserSchema);

module.exports = ProjectUserModel;
