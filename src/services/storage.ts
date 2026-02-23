import type { PropertyListing } from '../types';

const STORAGE_KEY = 'real-estate-listings';

export const storageService = {
    getListings(): PropertyListing[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    saveListing(listing: Omit<PropertyListing, 'id' | 'priceDrops' | 'history' | 'status'>): PropertyListing {
        const listings = this.getListings();

        const newListing: PropertyListing = {
            ...listing,
            id: crypto.randomUUID(),
            priceDrops: 0,
            status: 'active',
            history: [{ date: listing.dateCreated, price: listing.priceInitial }]
        };

        listings.push(newListing);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        return newListing;
    },

    updatePrice(id: string, newPrice: number): PropertyListing | null {
        const listings = this.getListings();
        const index = listings.findIndex(l => l.id === id);

        if (index === -1) return null;

        const listing = listings[index];

        // If price changed, update history and count drops
        if (listing.priceCurrent !== newPrice) {
            const isDrop = newPrice < listing.priceCurrent;

            listing.priceCurrent = newPrice;
            listing.history.push({ date: new Date().toISOString(), price: newPrice });

            if (isDrop) {
                listing.priceDrops += 1;
            }
        }

        listings[index] = listing;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        return listing;
    },

    deleteListing(id: string): void {
        const listings = this.getListings();
        const filtered = listings.filter(l => l.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    toggleStatus(id: string): PropertyListing | null {
        const listings = this.getListings();
        const index = listings.findIndex(l => l.id === id);
        if (index === -1) return null;

        listings[index].status = listings[index].status === 'active' ? 'sold' : 'active';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        return listings[index];
    },

    updateDate(id: string, newDate: string): PropertyListing | null {
        const listings = this.getListings();
        const index = listings.findIndex(l => l.id === id);
        if (index === -1) return null;

        listings[index].dateCreated = newDate;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        return listings[index];
    },

    updateInitialPrice(id: string, newPrice: number): PropertyListing | null {
        const listings = this.getListings();
        const index = listings.findIndex(l => l.id === id);
        if (index === -1) return null;

        const listing = listings[index];
        const oldInitial = listing.priceInitial;
        listing.priceInitial = newPrice;

        // Optionally update first history entry if it was the initial price
        if (listing.history.length > 0 && listing.history[0].price === oldInitial) {
            listing.history[0].price = newPrice;
        }

        listings[index] = listing;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        return listing;
    },

    updateImageUrl(id: string, imageUrl: string): PropertyListing | null {
        const listings = this.getListings();
        const index = listings.findIndex(l => l.id === id);
        if (index === -1) return null;

        listings[index].imageUrl = imageUrl || undefined;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
        return listings[index];
    }
};
