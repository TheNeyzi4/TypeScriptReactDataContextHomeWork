import React, { useState } from 'react';
import { useAuth } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
	const { register } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate()

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			await register(email, password);
			navigate('/users')
		} catch (err) {
			setError('Некоректні дані' + err);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
			/>
			<button type="submit">Реєстрація</button>
			{error && <p>{error}</p>}
		</form>
	);
};

export default RegisterPage;