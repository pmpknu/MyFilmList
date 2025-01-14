import api from './api/api';
import { AxiosResponse } from 'axios';
import { UserRoleChangeDto } from '@/interfaces/role/dto/UserRoleChangeDto';
import { UserDto } from '@/interfaces/user/dto/UserDto';

export default class UserRoleService {
    /**
     * Add a role to a user
     * @param {number} userId User ID
     * @param {UserRoleChangeDto} roleData Role data to add
     * @returns {Promise<AxiosResponse<UserDto>>} Updated user data
     */
    static async addRoleToUser(userId: number, roleData: UserRoleChangeDto): Promise<AxiosResponse<UserDto>> {
        return api.post<UserDto>(`/users/${userId}/roles`, roleData);
    }

    /**
     * Remove a role from a user
     * @param {number} userId User ID
     * @param {UserRoleChangeDto} roleData Role data to remove
     * @returns {Promise<AxiosResponse<UserDto>>} Updated user data
     */
    static async removeRoleFromUser(userId: number, roleData: UserRoleChangeDto): Promise<AxiosResponse<UserDto>> {
        return api.delete<UserDto>(`/users/${userId}/roles`, { data: roleData });
    }
}
