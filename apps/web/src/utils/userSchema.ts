import { z } from "zod";

const UserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Email must be of a format eg: user@example.com"),
    phone: z.string().nullable().optional().refine((val) => {
        if (!val) return true;
        return /^[\+]?[0-9]{10,15}$/.test(val);
    }, "Phone number must be 10-15 digits, optionally starting with +"), 
    status: z.enum(["active", "inactive"], "Status must be either 'active' or 'inactive'"),
    role: z.enum(["admin", "editor", "viewer"], "Role must be either 'admin', 'editor', or 'viewer'"),
    department: z.string().nullable().optional(),
});

export type UserFormData = z.infer<typeof UserSchema>;
export default UserSchema;