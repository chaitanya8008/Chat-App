import { useAuthContext } from "../../context/AuthContext";
import useGetConversations from "../../hooks/useGetConversations";
import useStarMessage from "../../hooks/useStarMessage";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { useState } from "react";

const Message = ({ message, starredMessages }) => {
	const [showStar, setShowStar] = useState();
	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const { starMessage } = useStarMessage();
	const fromMe = message.senderId === authUser._id;
	const formattedTime = extractTime(message.createdAt);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilePic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";

	const shakeClass = message.shouldShake ? "shake" : "";

	const handleStar = () => {
		starMessage(message, !!starredMessages[message._id]);
	}
	const { conversations } = useGetConversations();

	return (
		<div className={`chat ${chatClassName}`} onMouseEnter={()=>setShowStar(true)} onMouseLeave={()=>setShowStar(false)}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{fromMe && showStar && <span role="button" onClick={handleStar} style={starredMessages[message._id] && {color: 'gold'}}>★</span>}{' '+message.message+' '}{!fromMe  && showStar && <span role="button" onClick={handleStar} style={starredMessages[message._id] && {color: 'gold'}}>★</span>}</div>
			<div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{formattedTime}</div>
			<div className='opacity-50 text-xs flex gap-1 items-center'>To {conversations?.find(e=>e._id == message.receiverId)?.fullName}</div>
		</div>
	);
};
export default Message;
