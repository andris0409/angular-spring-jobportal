export interface PersonProfile {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    birthDate?: string;
    cv?: string | null;
}
