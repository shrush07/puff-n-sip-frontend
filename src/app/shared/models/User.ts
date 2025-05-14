export class User{
    id!: string;
    email!: string;
    name!: string;
    address!: string;
    token!: string;
    isAdmin!: boolean;
    role!: 'admin' | 'user';
    postalcode!: string;
    refreshToken !: string;
}