import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import useLogout from "../../hooks/useLogout";
import { FaAngleLeft, FaSave } from "react-icons/fa";
import useUser from "../../hooks/useUser";
import { useState } from "react";

const Profile = () => {
	const { loading, logout } = useLogout();
	const { authUser } = useAuthContext();
	const navigate = useNavigate();
	const [status, setStatus] = useState(authUser.status);
	const { loading: statusLoading, updateUser } = useUser();
	
	return (
		<div className='flex sm:h-[450px] md:h-[550px] md:min-w-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
			<div style={{position: 'absolute', top: 10, left: 10}} role="button">
				<FaAngleLeft className="w-6 h-6" onClick={() => navigate(-1)} />
			</div>
			<div className='flex items-center justify-center w-full h-full'>
				<div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
					<div className="w-[100px] ">
						<img src={authUser.profilePic} style={{width: '100%', height: '100%'}} />
					</div>
					<h3 style={{textTransform: 'capitalize', paddingTop: 10, fontSize: 35}}>{authUser.fullName}</h3>
					<h6 style={{paddingTop: 10, fontSize: 12}}><span style={{color: '#ccc'}}>{authUser.username}</span></h6>
					<div className="flex items-center">
						<textarea id="chat" rows="2" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  placeholder="Your status" onChange={(el)=>{setStatus(el.target.value)}}>{authUser.status}</textarea>
						<button className="btn btn-sm mt-1 mb-3" loading={loading} disabled={loading && statusLoading} onClick={ () => {
							updateUser(status);
						}}><FaSave />
							<span className="sr-only">Send message</span>
						</button>
					</div>
					
					<button className="btn btn-sm mt-5" loading={loading} disabled={loading} onClick={logout}>Logout</button>
				</div>
			</div>
		</div>
	);
};
export default Profile;
