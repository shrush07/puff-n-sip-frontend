export class User{
    id!: string;
    email!: string;
    name!: string;
    phone?: string;
    address?: string;
    token!: string;
    isAdmin!: boolean;
    role!: 'admin' | 'user';
    postalcode!: string;
    refreshToken !: string;
}