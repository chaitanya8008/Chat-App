import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetStarMessages = () => {
	const [loading, setLoading] = useState(false);
	const { starredMessages, setStarMessages, starredMessagesLoadTime } = useConversation();

	useEffect(() => {
		const getMessages = async () => {
			setLoading(true);
			setStarMessages([]);
			try {
				const res = await fetch(`/api/messages/starred/`);
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				const messages = {};
				data.map(e=>messages[e._id]=e);
				setStarMessages(messages);
			} catch (error) {
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};
		console.log(starredMessagesLoadTime);
		if(!starredMessagesLoadTime) getMessages();
	}, [starredMessagesLoadTime, setStarMessages]);

	return { starredMessages, loading, starredMessagesLoadTime };
};
export default useGetStarMessages;
