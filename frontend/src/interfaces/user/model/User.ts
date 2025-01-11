import { Url } from 'url';
import { Role } from '../../role/model/UserRole';

type User = {
    id: number;
    username: string;
    console: string;
    password: string;
    bio: string;
    photo: Url;
    roles: Role[];
}

export default User;