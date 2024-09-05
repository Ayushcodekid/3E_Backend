const UserModel = require('../models/User');




// Function to handle saving the user
 async function saveUser (req, res) {
  console.log('Received request body:', req.body);

  const { username, cognitoUserId, Plan, projectId, role } = req.body;

  try {

    const newUser = new UserModel({
      username,
      cognitoUserId,
      Plan: null
    });

    await newUser.save();
    if (projectId && role) {
      await addUserToProject(cognitoUserId, projectId, role);
    }

    res.status(200).send({ message: "User saved successfully and added to project if applicable!" });
    
    res.status(200).send({ message: "User saved successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Error saving user", error });
  }
}


  // Function to confirm user
async function confirmUser(req, res) {
  const { cognitoUserId } = req.body;

  try {
    
    await User.updateOne({ cognitoUserId}, { isConfirmed: true });
    res.status(200).send({ message: "User confirmed successfully!" });
  } catch (error) {
    console.error("Error confirming user:", error);
    res.status(500).send({ message: "Error confirming user", error: error.message });
  }
}





const checkUserPlan = async (req, res) => {
  try {
    const userId = req.params.id;  // Assuming the user ID is passed as a URL parameter
    console.log(`Received userId: ${userId}`);

    // Find the user by cognitoUserId
    const user = await UserModel.findOne({ cognitoUserId: userId });

    if (!user) {
      console.log(`No user found with cognitoUserId: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const plan = user.Plan;
    console.log(`User plan: ${plan}`);

    // Determine if the button should be enabled based on the user's plan
    const buttonEnabled = plan && ['basic', 'premium', 'standard'].includes(plan.toLowerCase());
    console.log(`Button enabled status: ${buttonEnabled}`);

    res.json({
      plan,
      buttonEnabled,
    });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



module.exports = { saveUser, confirmUser, checkUserPlan };
