import { PriceType } from "@prisma/client";

export type IEventFilterRequest = {
    searchTerm?: string | undefined;
    date?: string | undefined;
    priceType?: PriceType | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
};

// export type IDoctorUpdate = {
//     name?: string;
//     profilePhoto?: string;
//     contactNumber?: string;
//     address?: string;
//     registrationNumber?: string;
//     experience?: number;
//     gender?: "MALE" | "FEMALE";
//     appointmentFee?: number;
//     qualification?: string;
//     currentWorkingPlace?: string;
//     designation?: string;
//     // NEW: Simplified specialty management
//     specialties?: string[]; // Array of specialty IDs to add
//     removeSpecialties?: string[]; // Array of specialty IDs to remove
// };

// export type ISpecialties = {
//     specialtiesId: string;
//     isDeleted?: null;
// };
