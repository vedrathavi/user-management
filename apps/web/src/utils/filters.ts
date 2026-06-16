import type { UserRoles, UserStatus } from "@repo/types";
import type { User } from "@repo/types";


export type operator = "equals" | "contains" | "startsWith" | "endsWith";

export interface UserFilters {
    firstName?: { operator: operator; value: string };
    lastName?: { operator: operator; value: string };
    email?: { operator: operator; value: string };
    role?: UserRoles[] | "all";
    status?: UserStatus[] | "all";
    department?: { operator: operator; value: string };
    phone?: { operator: operator; value: string };

    createdFrom?: string; // ISO date string
    createdTo?: string;   // ISO date string
}

const matchText = (fieldValue: string, filterValue: string, operator: operator) => {
    switch (operator) {
        case "equals":
            return fieldValue.toLowerCase() === filterValue.toLowerCase();
        case "contains":
            return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
        case "startsWith":
            return fieldValue.toLowerCase().startsWith(filterValue.toLowerCase());
        case "endsWith":
            return fieldValue.toLowerCase().endsWith(filterValue.toLowerCase());
        default:
            return true;
    }
};

export const applyFilters = (users: User[], filters: UserFilters) => {
    return users.filter(
        (user) => {
            // First Name Filter
            const matchesFirstName = !filters.firstName ?
                true :
                matchText(user.firstName, filters.firstName.value, filters.firstName.operator);
            
            // Last Name Filter

            const matchesLastName = !filters.lastName ?
                true :
                matchText(user.lastName, filters.lastName.value, filters.lastName.operator);
            
            // Email Filter
            const matchesEmail = !filters.email ?
                true :
                matchText(user.email, filters.email.value, filters.email.operator);
            
            // Role Filter
            const matchesRole = !filters.role || filters.role === "all" || filters.role.length === 0 ?
                true :
                filters.role.includes(user.role);
            
            // Status Filter
            const matchesStatus = !filters.status || filters.status === "all" || filters.status.length === 0 ?
                true :
                filters.status.includes(user.status);
            
            // Department Filter
            const matchesDepartment = !filters.department ?
                true :
                matchText(user.department || "", filters.department.value, filters.department.operator);
            
            // Phone Filter
            const matchesPhone = !filters.phone ?
                true :
                matchText(user.phone || "", filters.phone.value, filters.phone.operator);
            
            // Created Date Filter
            const createdDate = new Date(user.createdAt);
            const matchesCreatedFrom = !filters.createdFrom ?
                true :
                createdDate >= new Date(filters.createdFrom);
            const matchesCreatedTo = !filters.createdTo ?
                true :
                createdDate <= new Date(filters.createdTo);
            
            return (matchesFirstName &&
                matchesLastName &&
                matchesEmail &&
                matchesRole &&
                matchesStatus &&
                matchesDepartment &&
                matchesPhone &&
                matchesCreatedFrom &&
                matchesCreatedTo);
            
            
        }

    );
}

// backend filters

export interface FilterValuesDto {
    field: string;
    values: string[]; // for role and status, this will be an array of strings
}

export interface SearchUsersRequest{
    page: number;
    pageSize: number;

    sort?: {
        field: string;
        order: "ASC" | "DESC";
    };

    filters?: FilterValuesDto[];
}

export interface SearchUsersResponse{
    rows: User[];
    total: number;
    page: number;
    pageSize: number;
    filterOptions: Record<string, string[]>;
}   