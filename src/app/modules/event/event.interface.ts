import { EventLifecycleStatus, PriceType } from "@prisma/client";

export type IEventFilterRequest = {
    searchTerm?: string | undefined;
    date?: string | undefined;
    priceType?: PriceType | undefined;
    lifecycleStatus?: EventLifecycleStatus | undefined;
    priceRange?: string | undefined;
};
