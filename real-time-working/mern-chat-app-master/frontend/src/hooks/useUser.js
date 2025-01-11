import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useUser = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const updateUser = async (status) => {
		if (!status.trim()) {
			toast.error("Status is mandatory");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/users/update", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ status }),
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			localStorage.setItem("chat-user", JSON.stringify(data));
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, updateUser };
};
export default useUser;
