import { useState } from "react";
import useConversation from "../zustand/useConversation";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useStarMessage = () => {
	const [loading, setLoading] = useState(false);
	const { starredMessages, setStarMessages } = useConversation();
	const { authUser } = useAuthContext();

	const starMessage = async (message, remove) => {
		setLoading(true);
		try {
			const res = await fetch(`/api/messages/star/${message._id}`, {
				method: remove ? "DELETE" : "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message: {userId: authUser._id, ...message} }),
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
			if(!remove) starredMessages[message._id] = message;
			else delete starredMessages[message._id];
			setStarMessages({...starredMessages});
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { starMessage, loading };
};
export default useStarMessage;
