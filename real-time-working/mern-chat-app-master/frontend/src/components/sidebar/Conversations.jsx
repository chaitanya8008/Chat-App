import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();
	return (
		<div className='py-2 flex flex-col overflow-auto'>
			<Conversation
				key={'starred'}
				conversation={{_id: 'starred', profilePic: 'https://avatar.iran.liara.run/public/boy?username=starred', fullName: 'Starred'}}
				emoji={getRandomEmoji()}
				lastIdx={false}
			/>

			<div className='divider px-3'></div>
			
			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};
export default Conversations;

