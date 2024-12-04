import { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

interface User {
	userId: string;
	email: string;
}

interface AuthContextType {
	user: User | null;
	users: User[];
	error?: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
	logout: () => void;
	giveAll: () => Promise<void>;
	put: (email: string, id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

interface DecodedToken {
	userId: string;
	email: string;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
	const [user, setUser] = useState<User | null>(null);
	const [users, setUsers] = useState<User[]>([]);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const put = useCallback(async (email: string, id: string) => {
		try {
			if (email && id) {
				const response = await axiosInstance.put(`http://localhost:4000/api/user/${id}`, { email });
				console.log(`Response Put: ${response}`);
				setUser(response.data);
			}
		} catch (error: any) {
			setError("Put failed: " + error.message);
		}
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		try {
			const response = await axiosInstance.post('http://localhost:4000/api/auth/login', { email, password });
			const { token } = response.data;
			localStorage.setItem('token', token);
			const decoded: DecodedToken = jwtDecode(token);
			setUser(decoded);
		} catch (error: any) {
			setError("Login failed: " + error.message);
		}
	}, []);

	const register = useCallback(async (email: string, password: string) => {
		try {
			const response = await axiosInstance.post('http://localhost:4000/api/auth/register', { email, password });
			const { token } = response.data;

			localStorage.setItem('token', token);
			const decoded: DecodedToken = jwtDecode(token);
			setUser(decoded);
		} catch (error: any) {
			setError("Registration failed: " + error.message);
		}
	}, []);

	const giveAll = useCallback(async () => {
		try {
			const response = await axiosInstance.get('http://localhost:4000/api/user/getAll');
			console.log(`Response users: ${response}`);
			setUsers(response.data);
		} catch (error: any) {
			console.log(error.message);
		}
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem('token');
		setUser(null);
		navigate('/login');
	}, [navigate]);

	return (
		<AuthContext.Provider value={{ user, login, register, logout, users, giveAll, put }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
