import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


export const updateUser = async (req, res) => {
	console.log(req.user)
	try {

		const body = {...req.body};
		const filteredBody = Object.keys(body).reduce((acc, key) => {
			if (key.match('status|fullName|gender')) {
				acc[key] = body[key];
			}
			return acc;
		}, {});
		const loggedInUserId = req.user._id;


		const filteredUsers = await User.updateOne({ _id: loggedInUserId }, { $set: { ...filteredBody } });
		const updatedUser = await User.findOne({ _id: loggedInUserId });

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};