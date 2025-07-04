const User = require("../models/user.js");
const passport = require("passport");

module.exports.signup = async (req, res) => {
 
  try {
    const {
      name,
      email,
      password,
      birthdate,
      number,
      hometown,
      city,
      documentType,
      documentNumber,
    } = req.body;

    // Validate documentType BEFORE saving
    if (
      !documentType ||
      !["Aadhar Card", "PAN Card", "Voter ID"].includes(documentType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid document type",
      });
    }
    console.log("New User Hometown:", hometown);
    console.log("New User City:", city);
     const normalizedCity = city.trim().toLowerCase();
  const normalizedHometown = hometown.trim().toLowerCase();


    const newUser = new User({
      username: email,
      email,
      fullName: name,
      birthDate: birthdate,
      currentResidence: normalizedCity,
      localAddress: normalizedHometown,
      mobileNumber: number,
      documents: [
        {
          type: documentType,
          documentNumber: documentNumber,
        },
      ],
    });

    const registeredUser = await User.register(newUser, password);

    const matchingUsers = await User.find({
      localAddress: normalizedHometown, // their hometown == newUser's city
      currentResidence: normalizedCity, // their city == newUser's hometown
      _id: { $ne: registeredUser._id }, // exclude self
    });
   console.log("Finding matching users with:");
console.log({ localAddress: normalizedHometown, currentResidence: normalizedCity });

    const existing = await User.find({});
    existing.forEach((u) => {
      console.log(
        `${u.fullName} lives in ${u.currentResidence}, hometown: ${u.localAddress}`
      );
    });

    for (const match of matchingUsers) {
      match.notifications.push({
        fromUser: registeredUser._id,
        message: `${registeredUser.fullName} (${normalizedCity}) is from your hometown (${normalizedHometown})`,
        createdAt: new Date(),
        status: "pending",
      });
     console.log("💬 Saving notification to:", match.fullName);
  await match.save()
  .then(() => console.log("✅ Notification saved to", match.email))
  .catch((err) => console.error("❌ Save failed for", match.email, err));
   
    }
    const token = registeredUser.generateAuthToken();

    return res.status(201).json({
      success: true,
      token: token,
      user: {
        id: registeredUser._id,
        email: registeredUser.email,
        name: registeredUser.fullName,
      },
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || "Login failed",
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();
    console.log("you are loged in......");
    return res.json({
      success: true,
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
      },
    });
    console.log(token);
  })(req, res, next);
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
};

module.exports.respondToNotification = async (req, res) => {
  try {
    const userId = req.user._id; // the receiver
    const { fromUserId, action } = req.body; // action: 'accept' or 'reject'
    console.log("userId", userId);
    console.log("fromUserId", fromUserId);
    console.log("action", action);
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const notification = user.notifications.find(
      (n) => n.fromUser.toString() === fromUserId
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    if (notification.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Notification already responded to" });
    }
    notification.status = action;

    if (action === "accept") {
      // Add each other as friends
      if (!user.connections.includes(fromUserId)) {
        user.connections.push(fromUserId);
      }

      const fromUser = await User.findById(fromUserId);
      if (fromUser && !fromUser.connections.includes(userId)) {
        fromUser.connections.push(userId);
        await fromUser.save();
      }
    }

    await user.save();
    res.json({ message: `Notification ${action}ed successfully` });
  } catch (err) {
    console.error("Server error on responding to notification:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate(
      "notifications.fromUser",
      "fullName currentResidence localAddress"
    );
    console.log(user);
    console.log("Fetching notifications for", req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ notifications: user.notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
