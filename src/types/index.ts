export interface PropertyListing {
  id: string;
  url: string;
  priceInitial: number;
  priceCurrent: number;
  location: string;
  surface: number;
  dateCreated: string; // ISO string
  priceDrops: number;
  history: PriceHistoryEntry[];
  status: 'active' | 'sold';
  imageUrl?: string;
}

export interface PriceHistoryEntry {
  date: string;
  price: number;
}
