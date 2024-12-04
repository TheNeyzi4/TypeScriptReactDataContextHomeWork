import { useState, useEffect } from 'react';
import { useAuth } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface User {
	userId: string;
	email: string;
}

const Navbar: React.FC = () => {
	const { logout } = useAuth();
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const giveUser = async () => {
			try {
				const token = await localStorage.getItem('token');
				if (token) {
					const decoded = jwtDecode<User>(token);
					setUser(decoded);
				} else {
					console.log('Ви не зареєструвалися будь ласка зареєструйтесь');
				}
			} catch (error: any) {
				setError(error.message);
				console.log(error.message);
			}
		};

		giveUser();
	}, []);

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<nav>
			<h1>My App</h1>
			{user &&
				<>
					<span>Welcome, {user.email}!</span>
					<button onClick={logout}>Logout</button>
					<Link to={`/users/${user.userId}`}>Profile</Link>
				</>}
		</nav>
	);
};

export default Navbar;
