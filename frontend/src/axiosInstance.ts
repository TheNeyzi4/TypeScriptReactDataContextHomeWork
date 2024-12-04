import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';

const token: string | null = localStorage.getItem('token');
console.log(token);

const axiosInstance = axios.create({
	baseURL: 'http://localhost:4000/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

axiosInstance.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem('token');
		console.log(token);

		if (token) {
			config.headers['Authorization'] = `Bearer ${token}`;
		}

		return config;
	},
	(error: AxiosError) => Promise.reject(error)
);

export default axiosInstance;
