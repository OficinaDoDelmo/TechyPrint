
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  material: 'PLA' | 'PETG' | 'Resina' | 'TPU';
  imageUrl: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface UserProfile {
  email: string;
  password?: string;
  name: string;
  phone: string;
  cep: string;
  address: string;
}

export interface ChatInquiry {
  id: string;
  customerEmail: string;
  customerName?: string;
  customerContact?: string;
  summary: string;
  fullHistory: ChatMessage[];
  createdAt: string;
  status: 'open' | 'resolved';
}

export interface Sale {
  id: string;
  date: string;
  customerEmail: string;
  total: number;
  itemsCount: number;
  itemsSummary: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export enum View {
  HOME = 'HOME',
  PRODUCT_DETAILS = 'PRODUCT_DETAILS'
}
