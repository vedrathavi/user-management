export type UserRoles = 'admin' | 'editor' | 'viewer';
export type UserStatus = 'active' | 'inactive';

export interface User { 
    id: string; //uuid
    firstName: string;
    lastName: string;
    email: string;
    role: UserRoles;
    status: UserStatus;
    createdAt: string; // ISO date string

    // optional fields
    phone?: string;
    department?: string;
}