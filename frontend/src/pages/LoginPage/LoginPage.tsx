import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
	const { login } = useAuth();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [error, setError] = useState<string>('');
	const navigate = useNavigate();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		try {
			await login(email, password);
			navigate('/users');
		} catch (err: any) {
			setError('Невірний логін або пароль');
		}
	};

	return (
		<div>
			<h2>Вхід</h2>
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
					placeholder="Пароль"
				/>
				<button type="submit">Вхід</button>
			</form>
			{error && <p>{error}</p>}
		</div>
	);
};

export default LoginPage;
