import api from './api/api';
import { AxiosResponse } from 'axios';
import { UserDto } from '../interfaces/user/dto/UserDto';
import { SearchDto } from '@/interfaces/search/dto/SearchDto';
import { UserUpdateDto } from '@/interfaces/user/dto/UserUpdateDto';

export default class UserService {
    /**
     * Search and filter users
     * @param {SearchUserDto} searchParams Search parameters
     * @returns {Promise<AxiosResponse<UserDto[]>>} List of users
     */
    static async searchUsers(searchParams: SearchDto): Promise<AxiosResponse<UserDto[]>> {
        return api.post<UserDto[]>('/users/search', searchParams);
    }

    /**
     * Upload user photo
     * @param {FormData} formData Form data containing the photo
     * @returns {Promise<AxiosResponse<UserDto>>} Updated user data
     */
    static async uploadPhoto(formData: FormData): Promise<AxiosResponse<UserDto>> {
        return api.post<UserDto>('/users/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }

    /**
     * Get user by ID
     * @param {string} id User ID
     * @returns {Promise<AxiosResponse<UserDto>>} User data
     */
    static async getUserById(id: string): Promise<AxiosResponse<UserDto>> {
        return api.get<UserDto>(`/users/${id}`);
    }

    /**
     * Delete user by ID
     * @param {string} id User ID
     * @returns {Promise<AxiosResponse<void>>}
     */
    static async deleteUser(id: string): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/users/${id}`);
    }

    /**
     * Update user by ID
     * @param {string} id User ID
     * @param {UpdateUserDto} userData Updated user data
     * @returns {Promise<AxiosResponse<UserDto>>} Updated user data
     */
    static async updateUser(id: string, userData: UserUpdateDto): Promise<AxiosResponse<UserDto>> {
        return api.patch<UserDto>(`/users/${id}`, userData);
    }

    /**
     * Get all users
     * @returns {Promise<AxiosResponse<UserDto[]>>} List of all users
     */
    static async getAllUsers(): Promise<AxiosResponse<UserDto[]>> {
        return api.get<UserDto[]>('/users');
    }
}