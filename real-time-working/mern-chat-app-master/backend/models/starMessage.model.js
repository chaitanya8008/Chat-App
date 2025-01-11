import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		messageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			required: true,
		},
		// createdAt, updatedAt
	},
	{ timestamps: true }
);

const StarMessage = mongoose.model("StarMessage", messageSchema, 'starMessages');

export default StarMessage;
