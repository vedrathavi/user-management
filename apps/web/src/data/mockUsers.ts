import { faker } from "@faker-js/faker";
import type { User, UserRoles, UserStatus } from "@repo/types";

const roles: UserRoles[] = ["admin", "editor", "viewer"];
const statuses: UserStatus[] = ["active", "inactive"];

export const mockUsers: User[] = Array.from({ length: 30 }, () => ({
    id: crypto.randomUUID(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(roles),
    status: faker.helpers.arrayElement(statuses),
    createdAt: faker.date.past().toISOString(),
    phone: `+91 ${faker.string.numeric(10)}`,
    department: faker.commerce.department()
})); 