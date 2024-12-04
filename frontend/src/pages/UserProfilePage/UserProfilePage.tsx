import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Тип для данных пользователя
interface User {
	userId: string;
	email: string;
}

const UserProfilePage: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);  // Типизация user как User или null
	const [error, setError] = useState<string | null>(null);  // Типизация error как строка или null

	useEffect(() => {
		const giveUser = () => {
			try {
				const token = localStorage.getItem('token');
				if (token) {
					const decoded: any = jwtDecode(token);  // Типизация декодированного токена как any
					console.log(decoded);
					setUser(decoded);  // Присваиваем decoded объект как user
				}
			} catch (error: any) {
				setError('giveAll failed: ' + error.message);
			}
		};

		giveUser();
	}, []);

	if (error) {
		return <h1>{error}</h1>;  // Если ошибка, показываем сообщение об ошибке
	}

	return (
		<div>
			<h1>Профіль користувача</h1>
			{user ? (
				<div>
					<p><strong>Id:</strong> {user.userId}</p>
					<p><strong>Email:</strong> {user.email}</p>
					<Link to={`/users/${user.userId}/edit`}>Редагувати профіль</Link>
					<br />
					<Link to={`/users`}>Список Користувачів</Link>
				</div>
			) : (
				<p>Завантаження...</p>  // Показать текст, если данные пользователя еще загружаются
			)}
		</div>
	);
};

export default UserProfilePage;
