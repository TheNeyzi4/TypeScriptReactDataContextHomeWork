import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/DataContext';

interface User {
	userId: string;
	email: string;
}

const EditProfilePage: React.FC = () => {
	const navigate = useNavigate();
	const { put } = useAuth();

	const [email, setEmail] = useState<string>('');
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const giveUser = () => {
			try {
				const token = localStorage.getItem('token');
				if (token) {
					const decoded = jwtDecode<any>(token);
					setUser(decoded);
				}
			} catch (error: any) {
				setError('giveAll failed: ' + error.message);
			}
		};

		giveUser();
	}, []);

	const fetchPut = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (user) {
				await put(email, user.userId);
				navigate('/users');
			}
		} catch (err) {
			setError('Щось пішло не так: ' + (err instanceof Error ? err.message : 'unknown error'));
		}
	};

	if (error) {
		return <div>Error: {error}</div>;
	}

	return (
		<form onSubmit={fetchPut}>
			<h1>Редагувати профіль</h1>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<button type="submit">Зберегти</button>
			<div>Після зберігання перелогіньтесь</div>
		</form>
	);
};

export default EditProfilePage;
