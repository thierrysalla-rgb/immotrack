import { supabase } from '../lib/supabase';
import type { PropertyListing } from '../types';

export const storageService = {
    async getListings(): Promise<PropertyListing[]> {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching listings:', error);
            return [];
        }

        return data.map(item => ({
            id: item.id,
            url: item.url,
            priceInitial: item.price_initial,
            priceCurrent: item.price_current,
            location: item.location,
            surface: item.surface,
            dateCreated: item.date_created,
            priceDrops: item.price_drops,
            history: item.history || [],
            status: item.status,
            imageUrl: item.image_url
        }));
    },

    async saveListing(listing: Omit<PropertyListing, 'id' | 'priceDrops' | 'history' | 'status'>): Promise<PropertyListing | null> {
        const newListing = {
            url: listing.url,
            price_initial: listing.priceInitial,
            price_current: listing.priceInitial,
            location: listing.location,
            surface: listing.surface,
            date_created: listing.dateCreated,
            price_drops: 0,
            status: 'active',
            image_url: listing.imageUrl,
            history: [{ date: listing.dateCreated, price: listing.priceInitial }]
        };

        const { data, error } = await supabase
            .from('listings')
            .insert(newListing)
            .select()
            .single();

        if (error) {
            console.error('Error saving listing:', error);
            return null;
        }

        return {
            id: data.id,
            url: data.url,
            priceInitial: data.price_initial,
            priceCurrent: data.price_current,
            location: data.location,
            surface: data.surface,
            dateCreated: data.date_created,
            priceDrops: data.price_drops,
            history: data.history,
            status: data.status,
            imageUrl: data.image_url
        };
    },

    async updatePrice(id: string, newPrice: number): Promise<PropertyListing | null> {
        // Fetch current listing first to update history
        const { data: current, error: fetchError } = await supabase
            .from('listings')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !current) return null;

        const history = [...(current.history || [])];
        let priceDrops = current.price_drops;

        if (current.price_current !== newPrice) {
            const isDrop = newPrice < current.price_current;
            history.push({ date: new Date().toISOString(), price: newPrice });
            if (isDrop) priceDrops += 1;
        }

        const { data, error } = await supabase
            .from('listings')
            .update({
                price_current: newPrice,
                history,
                price_drops: priceDrops
            })
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        return {
            id: data.id,
            url: data.url,
            priceInitial: data.price_initial,
            priceCurrent: data.price_current,
            location: data.location,
            surface: data.surface,
            dateCreated: data.date_created,
            priceDrops: data.price_drops,
            history: data.history,
            status: data.status,
            imageUrl: data.image_url
        };
    },

    async deleteListing(id: string): Promise<boolean> {
        const { error } = await supabase
            .from('listings')
            .delete()
            .eq('id', id);

        return !error;
    },

    async toggleStatus(id: string): Promise<PropertyListing | null> {
        const { data: current, error: fetchError } = await supabase
            .from('listings')
            .select('status')
            .eq('id', id)
            .single();

        if (fetchError || !current) return null;

        const newStatus = current.status === 'active' ? 'sold' : 'active';

        const { data, error } = await supabase
            .from('listings')
            .update({ status: newStatus })
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        return {
            id: data.id,
            url: data.url,
            priceInitial: data.price_initial,
            priceCurrent: data.price_current,
            location: data.location,
            surface: data.surface,
            dateCreated: data.date_created,
            priceDrops: data.price_drops,
            history: data.history,
            status: data.status,
            imageUrl: data.image_url
        };
    },

    async updateDate(id: string, newDate: string): Promise<PropertyListing | null> {
        const { data, error } = await supabase
            .from('listings')
            .update({ date_created: newDate })
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        return {
            id: data.id,
            url: data.url,
            priceInitial: data.price_initial,
            priceCurrent: data.price_current,
            location: data.location,
            surface: data.surface,
            dateCreated: data.date_created,
            priceDrops: data.price_drops,
            history: data.history,
            status: data.status,
            imageUrl: data.image_url
        };
    },

    async updateInitialPrice(id: string, newPrice: number): Promise<PropertyListing | null> {
        const { data: current, error: fetchError } = await supabase
            .from('listings')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !current) return null;

        const history = [...(current.history || [])];
        if (history.length > 0 && history[0].price === current.price_initial) {
            history[0].price = newPrice;
        }

        const { data, error } = await supabase
            .from('listings')
            .update({
                price_initial: newPrice,
                history
            })
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        return {
            id: data.id,
            url: data.url,
            priceInitial: data.price_initial,
            priceCurrent: data.price_current,
            location: data.location,
            surface: data.surface,
            dateCreated: data.date_created,
            priceDrops: data.price_drops,
            history: data.history,
            status: data.status,
            imageUrl: data.image_url
        };
    },

    async updateImageUrl(id: string, imageUrl: string): Promise<PropertyListing | null> {
        const { data, error } = await supabase
            .from('listings')
            .update({ image_url: imageUrl || null })
            .eq('id', id)
            .select()
            .single();

        if (error) return null;

        return {
            id: data.id,
            url: data.url,
            priceInitial: data.price_initial,
            priceCurrent: data.price_current,
            location: data.location,
            surface: data.surface,
            dateCreated: data.date_created,
            priceDrops: data.price_drops,
            history: data.history,
            status: data.status,
            imageUrl: data.image_url
        };
    }
};

