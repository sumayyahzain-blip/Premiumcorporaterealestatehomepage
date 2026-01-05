export interface ParsedSearchFilters {
    query: string;
    minBedrooms?: number;
    minBathrooms?: number;
    maxPrice?: number;
    propertyType?: string;
    amenities?: string[];
}

export function parseSmartQuery(text: string): ParsedSearchFilters {
    const filters: ParsedSearchFilters = {
        query: text,
        amenities: []
    };

    const lowerText = text.toLowerCase();

    // 1. Bedroom extraction (e.g., "3 beds", "3bd", "3 bedrooms")
    const bedMatch = lowerText.match(/(\d+)\s*(?:bed|bd|bedroom)/);
    if (bedMatch) {
        filters.minBedrooms = parseInt(bedMatch[1], 10);
    }

    // 2. Bathroom extraction (e.g., "2 baths", "2ba", "2 bathrooms")
    const bathMatch = lowerText.match(/(\d+)\s*(?:bath|ba|bathroom)/);
    if (bathMatch) {
        filters.minBathrooms = parseInt(bathMatch[1], 10);
    }

    // 3. Price extraction (e.g., "$500k", "500k", "$1m")
    // Simple mock logic: look for 'k' or 'm' associated with numbers
    const priceMatch = lowerText.match(/\$?(\d+(?:\.\d+)?)\s*(k|m)/);
    if (priceMatch) {
        const value = parseFloat(priceMatch[1]);
        const multiplier = priceMatch[2] === 'k' ? 1000 : 1000000;
        filters.maxPrice = value * multiplier;
    }

    // 4. Property Type
    if (lowerText.includes('condo') || lowerText.includes('apartment')) filters.propertyType = 'condo';
    else if (lowerText.includes('house') || lowerText.includes('home')) filters.propertyType = 'house';
    else if (lowerText.includes('townhouse')) filters.propertyType = 'townhouse';

    // 5. Amenities (Simple keyword mapping)
    const amenityMap: Record<string, string> = {
        'pool': 'Pool',
        'garage': 'Garage',
        'parking': 'Parking',
        'gym': 'Gym',
        'garden': 'Garden',
        'backyard': 'Backyard',
        'view': 'Scenic View',
        'waterfront': 'Waterfront',
        'fireplace': 'Fireplace',
        'ac': 'Air Conditioning',
        'air con': 'Air Conditioning'
    };

    Object.keys(amenityMap).forEach(key => {
        if (lowerText.includes(key)) {
            filters.amenities?.push(amenityMap[key]);
        }
    });

    return filters;
}
