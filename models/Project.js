const mongoose = require('mongoose');
const UserModel = require('./User')

const ProjectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.String, 
    ref: 'users', 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

ProjectSchema.pre('save', async function (next) {
    try {
        const user = await UserModel.findOne({ cognitoUserId: this.owner });
        if (!user) {
            const error = new Error('Owner (Cognito ID) does not exist in the User collection.');
            error.status = 400;
            return next(error);
        }
        next();
    } catch (err) {
        next(err);
    }
});

const ProjectModel = mongoose.model('projects', ProjectSchema);

module.exports = ProjectModel;


