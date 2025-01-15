import api from './api/api';
import { AxiosResponse } from 'axios';
import { UserDto } from '../interfaces/user/dto/UserDto';
import { SearchDto } from '@/interfaces/search/dto/SearchDto';
import { UserUpdateDto } from '@/interfaces/user/dto/UserUpdateDto';
import Paged from '@/interfaces/paged/models/Paged';
import { createCrudUri } from '@/utils/uri';

export default class UserService {
    /**
     * Search and filter users
     * @param {SearchUserDto} searchParams Search parameters
     * @returns {Promise<AxiosResponse<Paged<UserDto>>} List of users
     */
    static async searchUsers(searchParams: SearchDto, page: number = 0, size: number = 1, sort: string[] = []): Promise<AxiosResponse<Paged<UserDto>>> {
        return api.post<Paged<UserDto>>(`/users/search${createCrudUri(page, size, sort)}`, searchParams);
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
     * @param {number} id User ID
     * @returns {Promise<AxiosResponse<UserDto>>} User data
     */
    static async getUserById(id: number): Promise<AxiosResponse<UserDto>> {
        return api.get<UserDto>(`/users/${id}`);
    }

    /**
     * Delete user by ID
     * @param {number} id User ID
     * @returns {Promise<AxiosResponse<void>>}
     */
    static async deleteUser(id: number): Promise<AxiosResponse<void>> {
        return api.delete<void>(`/users/${id}`);
    }

    /**
     * Update user by ID
     * @param {number} id User ID
     * @param {UpdateUserDto} userData Updated user data
     * @returns {Promise<AxiosResponse<UserDto>>} Updated user data
     */
    static async updateUser(id: number, userData: UserUpdateDto): Promise<AxiosResponse<UserDto>> {
        return api.patch<UserDto>(`/users/${id}`, userData);
    }

    /**
     * Get all users with pagination
     * @param {number} page Page number
     * @param {number} size Page size
     * @returns {Promise<AxiosResponse<Paged<UserDto>>>} Page of all users with total count
     */
    static async getAllUsers(page: number = 0, size: number = 20, sort: string[] = []): Promise<AxiosResponse<Paged<UserDto>>> {
        return api.get<Paged<UserDto>>(`/users${createCrudUri(page, size, sort)}`);
    }
}