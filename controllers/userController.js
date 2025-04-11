const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require('../utils/sendEmail');

// Get user profile
exports.getUserProfile = async (req, res) => {
   
    try {
        // Assuming req.userId contains the ID of the authenticated user
        const user = await User.findById(req.params.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// get all user profileImg, firstName, id, emailAddress 
exports.getAllUsersProfile = async (req, res) => {
  try {
    const users = await User.find().select("profileImg firstName lastName _id emailAddress dob bio phoneNumber country city isSubscriber subscriptionPlan, uploadedPhotos, facebook, instagram, tiktok, snapchat");

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Loop through request body and update only modified fields
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined && req.body[key] !== user[key]) {
        user[key] = req.body[key];
      }
    });

    await user.save();

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error(error); // Log the full error
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Handle account deletion request
exports.requestAccountDeletion = async (req, res) => {
  try {
    const { username, email, reason } = req.body;

    // Check if user exists
    const user = await User.findOne({ username, email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // You could optionally log this request into a database or notify the admin via email
    const deletionRequest = {
      subject: 'Account Deletion Request',
      html: `<p>User <strong>${username}</strong> with email <strong>${email}</strong> has requested account deletion.</p><p>Reason: ${reason || 'No reason provided'}</p>`
    };

    // Send an email to the admin notifying about the deletion request (optional)
    await sendEmail('splinxplanent@gmail.com', deletionRequest.subject, deletionRequest.html);

    res.status(200).json({ success: true, message: 'Your account deletion request has been submitted. We will process it shortly.' });

    // Optionally mark the user for deletion (e.g., a flag to delete later)
    // user.isDeletionRequested = true;
    // await user.save();

    // Or, if you want to delete the user immediately:
    // await User.deleteOne({ _id: user._id });
  } catch (error) {
    console.error('Error processing account deletion request:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// change password
exports.changePassword = async (req, res) => {
  const { userId } = req.params;
  const { emailAddress, newPassword } = req.body;

  if (!emailAddress || !newPassword) {
    return res.status(400).json({ message: "Old email address and new password are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // check if email matches user email
    if (emailAddress !== user.emailAddress) {
      return res.status(400).json({ message: "Email address doesn't exist" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  const { emailAddress, newPassword } = req.body;

  if (!emailAddress || !newPassword) {
    return res.status(400).json({ message: "Old email address and new password are required." });
  }

  try {
    const user = await User.findOne({ emailAddress });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // check if email matches user email
    if (emailAddress !== user.emailAddress) {
      return res.status(400).json({ message: "Email address doesn't exist" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verify user email
exports.verifyEmail = async (req, res) => {
  const { emailAddress } = req.params;

  if (!emailAddress) {
    return res.status(400).json({ message: "Email address is required." });
  }

  try {
    const user = await User.findOne({ emailAddress });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    } else {
      return res.status(200).json({ message: "User found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// add new notifications
exports.postNotification = async (req, res) => {
  const { userId } = req.params;
  const { title, message } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const newNotification = {
      title,
      message,
    };

    user.notifications.push(newNotification);
    await user.save();

    res.status(200).send(user.notifications);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).send(user.notifications);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Delete user profile
exports.deleteUserProfile = async (req, res) => {
    await User.findByIdAndDelete(req.params.userId);

    res.json({ message: "User profile deleted successfully" });
}

//endpoint to send a request to a user
exports.sendFriendRequest =  async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recipient's friendRequestsArray!
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

//endpoint to show all the friend-requests of a particular user
exports.showAllFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate("friendRequests", "firstName emailAddress profileImg")
      .lean();

    const friendRequests = user.friendRequests;

    res.json(friendRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// endpoint to get all sent friends request
exports.getSentFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("sentFriendRequests");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sentFriendRequests = user.sentFriendRequests;

    res.status(200).json(sentFriendRequests);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//endpoint to accept a friend-request of a particular person
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    sender.friends.push(recipientId);
    recipient.friends.push(senderId);

    recipient.friendRequests = recipient.friendRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recipientId.toString
    );

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//endpoint to access all the friends of the logged in user!
exports.loginFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "firstName emailAddress profileImg"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
    
// get user friends
exports.getUserFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendIds = user.friends.map((friend) => friend._id);

    res.status(200).json(friendIds);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//endpoint to access all the users except the user who's is currently logged in!
exports.getAllUsers = async (req, res) => {
  const loggedInUserId = req.params.userId;

  if (!loggedInUserId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    const users = await User.find({ _id: { $ne: loggedInUserId } });
    
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error("Error retrieving users", err);
    res.status(500).json({ message: "Error retrieving users" });
  }
};

// restricted account operation endpoint
// add user to restricted account
exports.addToRestrictedAccount = async (req, res) => {
  const { userId, restrictedUserId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.restrictedAccount.includes(restrictedUserId)) {
      user.restrictedAccount.push(restrictedUserId);
      await user.save();
    }

    res.status(200).send("User added to restricted account list");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// remove user from restricted account
exports.removeFromRestrictedAccount = async (req, res) => {
  const { userId, restrictedUserId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    user.restrictedAccount = user.restrictedAccount.filter(
      (id) => id.toString() !== restrictedUserId
    );
    await user.save();

    res.status(200).send("User removed from restricted account list");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// fetch all restricted accounts info data
exports.fetchRestrictedAccounts = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("restrictedAccount", "firstName lastName emailAddress profileImg");
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user.restrictedAccount);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// accept an array of user id and fetch info data
exports.fetchUsersById = async (req, res) => {
  try {
    const { userIds } = req.body; // assuming userIds is sent in the request body

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: 'Invalid input, expected an array of user IDs' });
    }

    const users = await User.find(
      { _id: { $in: userIds } },
      'firstName profileImg emailAddress'
    );

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};