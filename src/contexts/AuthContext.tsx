// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Types
interface LoginCredentials {
	username: string;
	password: string;
}

interface AuthUser {
	id: number;
	name: string;
	accNo: number;
	role: string;
	userRole: number;
	departmentId?: number;
	subdeptid?: number;
	token: string;
	lineUserId?: string;
	lineDisplayName?: string;
	linePictureUrl?: string;
	subdepartHeadName?: string | null;
	departmentHeadName?: string | null;
	directorName?: string | null;
}

interface AuthContextType {
	user: AuthUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/attendance-manage';

// JWT decode helper (UTF-8 safe)
function parseJwt(token: string): any | null {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
		const decoded = decodeURIComponent(
			atob(padded)
				.split('')
				.map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
				.join('')
		);
		return JSON.parse(decoded);
	} catch (err) {
		console.error('Error decoding JWT:', err);
		return null;
	}
}

// Token Manager
export const tokenManager = {
	getToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem('auth_token');
	},

	setToken(token: string): void {
		if (typeof window === 'undefined') return;
		localStorage.setItem('auth_token', token);
	},

	removeToken(): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem('auth_token');
		localStorage.removeItem('auth_user');
	},

	getUser(): AuthUser | null {
		if (typeof window === 'undefined') return null;
		const userStr = localStorage.getItem('auth_user');
		if (!userStr) return null;
		try {
			return JSON.parse(userStr);
		} catch {
			return null;
		}
	},

	setUser(user: AuthUser): void {
		if (typeof window === 'undefined') return;
		localStorage.setItem('auth_user', JSON.stringify(user));
	},

	isTokenValid(token: string): boolean {
		const payload = parseJwt(token);
		if (!payload || !payload.exp) return false;
		const currentTime = Math.floor(Date.now() / 1000);
		return payload.exp > currentTime;
	},

	// เพิ่มฟังก์ชันสำหรับเช็คว่า token จะหมดอายุในเวลาที่กำหนด
	isTokenExpiringSoon(token: string, beforeMinutes: number = 5): boolean {
		const payload = parseJwt(token);
		if (!payload || !payload.exp) return false;
		const currentTime = Math.floor(Date.now() / 1000);
		const bufferTime = beforeMinutes * 60; // แปลงนาทีเป็นวินาที
		return payload.exp <= (currentTime + bufferTime);
	},

	// เพิ่มฟังก์ชันสำหรับดู remaining time
	getTokenRemainingTime(token: string): number {
		const payload = parseJwt(token);
		if (!payload || !payload.exp) return 0;
		const currentTime = Math.floor(Date.now() / 1000);
		return Math.max(0, payload.exp - currentTime);
	}
};

// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	// Logout function with callback for reuse
	const logout = useCallback(async (): Promise<void> => {
		tokenManager.removeToken();
		setUser(null);
		// ใช้ replace แทน push เพื่อป้องกัน back navigation
		router.replace('/auth/login/');
	}, [router]);

	// ฟังก์ชันสำหรับตรวจสอบ token validity
	const checkTokenValidity = useCallback(async () => {
		const token = tokenManager.getToken();
		const storedUser = tokenManager.getUser();

		if (token && storedUser) {
			if (!tokenManager.isTokenValid(token)) {
				console.log('Token expired, logging out...');
				await logout();
				return false;
			}
			
			// Optional: แจ้งเตือนเมื่อ token จะหมดอายุเร็วๆ นี้
			if (tokenManager.isTokenExpiringSoon(token, 5)) {
				const remainingTime = tokenManager.getTokenRemainingTime(token);
				console.warn(`Token will expire in ${Math.floor(remainingTime / 60)} minutes`);
			}
			
			return true;
		}
		
		return false;
	}, [logout]);

	// Check auth on mount
	useEffect(() => {
		const initializeAuth = async () => {
			const token = tokenManager.getToken();
			const storedUser = tokenManager.getUser();

			if (token && storedUser && tokenManager.isTokenValid(token)) {
				setUser(storedUser);
			} else {
				tokenManager.removeToken();
				setUser(null);
			}
			setIsLoading(false);
		};

		initializeAuth();
	}, []);

	// Set up token validity checker interval
	useEffect(() => {
		let intervalId: NodeJS.Timeout | null = null;

		if (user) {
			// ตรวจสอบ token validity ทุกๆ 30 วินาที
			intervalId = setInterval(async () => {
				await checkTokenValidity();
			}, 30000); // 30 seconds
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [user, checkTokenValidity]);

	// Set up visibility change listener to check token when tab becomes visible
	useEffect(() => {
		const handleVisibilityChange = async () => {
			if (!document.hidden && user) {
				await checkTokenValidity();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [user, checkTokenValidity]);

	// Login
	const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message?: string }> => {
		try {
			setIsLoading(true);
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (!result.ok) {
				throw new Error(result.message || 'Login failed');
			}

			if (result.token) {
				tokenManager.setToken(result.token);

				const payload = parseJwt(result.token);
				if (payload) {
					const user: AuthUser = {
						id: parseInt(payload.id),
						name: payload.name,
						accNo: 0, // Not used in new system
						role: payload.role,
						userRole: payload.role === 'admin' ? 3 : payload.role === 'manager' ? 2 : 1,
						departmentId: payload.departmentId ? parseInt(payload.departmentId) : undefined,
						subdeptid: payload.subdeptid ? parseInt(payload.subdeptid) : undefined,
						token: result.token,
						lineUserId: payload.lineUserId,
						lineDisplayName: payload.lineDisplayName,
						linePictureUrl: payload.linePictureUrl,
						subdepartHeadName: null,
						departmentHeadName: null,
						directorName: null,
					};
					tokenManager.setUser(user);
					setUser(user);
				} else {
					throw new Error('Invalid JWT payload');
				}
			}

			return { success: true };
		} catch (error) {
			console.error('Login error:', error);
			return {
				success: false,
				message: error instanceof Error ? error.message : 'Login failed',
			};
		} finally {
			setIsLoading(false);
		}
	};

	const value: AuthContextType = {
		user,
		isLoading,
		isAuthenticated: !!user,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// useAuth hook
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within an AuthProvider');

	return context;
}

// ProtectedRoute Component
// export function ProtectedRoute({ children }: { children: ReactNode }) {
// 	const { isAuthenticated, isLoading } = useAuth();
// 	const router = useRouter();

// 	useEffect(() => {
// 		// เพิ่ม flag เพื่อป้องกัน multiple redirects
// 		let isMounted = true;

// 		if (!isLoading && !isAuthenticated && isMounted) {
// 			// ใช้ replace แทน push เพื่อป้องกัน history stack ซ้อน
// 			router.replace('/login/');
// 		}

// 		return () => {
// 			isMounted = false;
// 		};
// 	}, [isAuthenticated, isLoading]); // ลบ router ออกจาก dependencies

// 	// Loading state
// 	if (isLoading) {
// 		return (
// 			<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
// 				<div className="flex flex-col items-center space-y-4">
// 					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// 					<p className="text-gray-600 dark:text-gray-300 font-prompt">
// 						กำลังตรวจสอบการเข้าสู่ระบบ...
// 					</p>
// 				</div>
// 			</div>
// 		);
// 	}

// 	// Not authenticated - return null while redirecting
// 	if (!isAuthenticated) {
// 		return null;
// 	}

// 	// Authenticated - render children
// 	return <>{children}</>;
// }