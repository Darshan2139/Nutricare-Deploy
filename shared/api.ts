/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

import { User, PersonalInfo, MedicalHistory, PregnancyInfo, FoodPreferences, LifestyleInfo } from "./types";

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// API Base URL - Use environment variable for production, fallback to relative URL
const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://your-render-backend-url.onrender.com/api' : '/api');

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// API Functions for Profile Management
export const profileAPI = {
  // Get current user profile
  getProfile: async (): Promise<User & {
    personalInfo?: PersonalInfo;
    medicalHistory?: MedicalHistory;
    pregnancyInfo?: PregnancyInfo;
    foodPreferences?: FoodPreferences;
    lifestyleInfo?: LifestyleInfo;
    isProfileComplete?: boolean;
  }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No auth token found');

    const response = await fetch(`${API_BASE}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (profileData: {
    name?: string;
    personalInfo?: Partial<PersonalInfo>;
    medicalHistory?: Partial<MedicalHistory>;
    pregnancyInfo?: Partial<PregnancyInfo>;
    foodPreferences?: Partial<FoodPreferences>;
    lifestyleInfo?: Partial<LifestyleInfo>;
    isProfileComplete?: boolean;
  }): Promise<User> => {
    const token = getAuthToken();
    if (!token) throw new Error('No auth token found');

    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    return handleResponse(response);
  },

  // Upload profile photo
  uploadPhoto: async (photoData: string): Promise<{ profilePhoto: string; message: string }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No auth token found');

    const response = await fetch(`${API_BASE}/users/upload-photo`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photoData }),
    });

    return handleResponse(response);
  },

  // Delete profile photo
  deletePhoto: async (): Promise<{ profilePhoto: null; message: string }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No auth token found');

    const response = await fetch(`${API_BASE}/users/photo`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return handleResponse(response);
  },

  // Delete user account
  deleteAccount: async (): Promise<{ message: string }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No auth token found');

    const response = await fetch(`${API_BASE}/users/me`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return handleResponse(response);
  },
};

// API Functions for Authentication
export const authAPI = {
  // Login user
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
  },

  // Register user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'pregnant' | 'lactating';
  }): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return handleResponse(response);
  },

  // Logout user
  logout: async (): Promise<void> => {
    const token = getAuthToken();
    if (!token) return;

    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    localStorage.removeItem('auth_token');
  },
};

// Utility functions
export const utils = {
  // Validate image file
  validateImageFile: (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Please select an image file' };
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { isValid: false, error: 'Image size should be less than 5MB' };
    }

    // Check file format
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      return { isValid: false, error: 'Unsupported image format. Please use JPEG, PNG, GIF, or WebP.' };
    }

    return { isValid: true };
  },

  // Convert file to base64
  fileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Format phone number
  formatPhoneNumber: (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Format as Indian phone number
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
    }
    
    return phone; // Return original if can't format
  },

  // Calculate BMI
  calculateBMI: (height: number, weight: number): number => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  },

  // Get BMI category
  getBMICategory: (bmi: number): string => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  },
};

// Re-export all types from types.ts for convenience
export * from "./types";
