import { useEffect, useState } from 'react';
import { useAuth } from '../../context/DataContext';

interface User {
	email: string;
};

const UserListPage: React.FC = () => {
	const { users, giveAll } = useAuth();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				await giveAll();
			} catch (err: any) {
				setError('Щось пішло не так: ' + err.message);
			}
		};

		fetchUsers();
	}, [giveAll]);

	if (error) {
		return <h1>{error}</h1>;
	}

	return (
		<div>
			<h1>Welcome</h1>
			<h2>User List:</h2>
			<ul>
				{users && users.length > 0 ? (
					users.map((user: User, id: number) => (
						<li key={id}>{user.email}</li>
					))
				) : (
					<p>No users found.</p>
				)}
			</ul>
		</div>
	);
};

export default UserListPage;
