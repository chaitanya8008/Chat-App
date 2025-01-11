import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import StarMessage from "../models/starMessage.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

/**
 * Removes a message from the list of starred messages of the logged in user.
 * @function
 * @async
 * @param {Object} req - The express request object.
 * @param {Object} res - The express response object.
 * @param {string} req.params.message - The id of the message to be unstarred.
 * @returns {Promise<void>}
 */
export const unStarMessage = async (req, res) => {
	try {
		const {message: messageId } = req.params;
		const userId = req.user._id;

		let starMessage = await StarMessage.findOne({
			userId,
			messageId
		});

		if (!starMessage) {
			return res.status(404).json('Starred message not found');
		}

		await StarMessage.deleteOne({
			userId,
			messageId
		});
		return res.status(200).json('Starred message removed from star list');
	} catch (error) {
		console.log("Error in starMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Handles starring a message.
 * @function
 * @async
 * @param {Object} req - The express request object.
 * @param {Object} res - The express response object.
 * @param {string} req.params.id - The id of the user the message being starred is from.
 * @param {string} req.params.message - The id of the message to be starred.
 * @returns {Promise<void>}
 */
export const starMessage = async (req, res) => {
	try {
		const {message: messageId } = req.params;
		const userId = req.user._id;

		let starMessage = await StarMessage.findOne({
			participants: { $all: [userId, messageId] },
		});

		if (!starMessage) {
			starMessage = new StarMessage({
				userId,
				messageId,
			});
		}
		await starMessage.save();

		res.status(201).json(starMessage);
	} catch (error) {
		console.log("Error in starMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
/**
 * Handles sending a message to a user.
 * @function
 * @async
 * @param {Object} req - The express request object.
 * @param {Object} res - The express response object.
 * @param {string} req.body.message - The message to be sent.
 * @param {string} req.params.id - The id of the user the message is being sent to.
 * @returns {Promise<void>}
 */

export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get all the starred messages of the logged in user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
export const getStarredMessage = async (req, res) => {
	try {
		const userId = req.user._id;

		const starredMessages = await StarMessage.find({
			userId,
		}).sort({ createdAt: -1 }).populate("messageId");

		if (!starredMessages) return res.status(200).json([]);

		res.status(200).json(starredMessages.map(e=>e.messageId));
	} catch (error) {
		console.log("Error in getStarMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get all the messages of the logged in user with the given user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
