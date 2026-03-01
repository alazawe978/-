export interface Item {
  id: number;
  title: string;
  description: string;
  starting_price: number;
  current_bid: number;
  images: string[];
  seller_whatsapp: string;
  seller_notes?: string;
  status: 'active' | 'sold';
  created_at: string;
}

export interface Bid {
  id: number;
  item_id: number;
  bidder_name: string;
  amount: number;
  created_at: string;
}

export interface ItemWithBids extends Item {
  bids: Bid[];
}
