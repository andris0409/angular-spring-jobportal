export interface CompanyProfile {
    id: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    description: string;
    logo?: string | null;
    comments: string[];
}