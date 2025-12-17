import { Product, Sale, ChatInquiry, UserProfile } from '../types';
import { PRODUCTS, FIXED_ADMIN_USER } from '../constants';

const PRODUCTS_KEY = 'techyprint_db_products';
const HERO_KEY = 'techyprint_db_hero';
const SALES_KEY = 'techyprint_db_sales';
const INQUIRIES_KEY = 'techyprint_db_inquiries';
const USERS_DB_KEY = 'techyprint_users_db';

export const api = {
  // Produtos
  async getProducts(): Promise<Product[]> {
    try {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      if (!stored) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(PRODUCTS));
        return PRODUCTS;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Erro ao ler LocalStorage", error);
      return PRODUCTS;
    }
  },

  async addProduct(product: Product): Promise<void> {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    const currentProducts = stored ? JSON.parse(stored) : PRODUCTS;
    const newList = [product, ...currentProducts];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newList));
  },

  async updateProduct(product: Product): Promise<void> {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    const currentProducts: Product[] = stored ? JSON.parse(stored) : PRODUCTS;
    
    const newList = currentProducts.map(p => 
      p.id === product.id ? product : p
    );
    
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(newList));
  },

  // Configurações (Capa)
  async getHeroImage(): Promise<string> {
    const stored = localStorage.getItem(HERO_KEY);
    return stored || 'https://picsum.photos/1000/800?grayscale';
  },

  async updateHeroImage(url: string): Promise<void> {
    localStorage.setItem(HERO_KEY, url);
  },

  // Financeiro (Vendas)
  async recordSale(sale: Sale): Promise<void> {
    const stored = localStorage.getItem(SALES_KEY);
    const currentSales: Sale[] = stored ? JSON.parse(stored) : [];
    const newSales = [sale, ...currentSales];
    localStorage.setItem(SALES_KEY, JSON.stringify(newSales));
  },

  async getSales(): Promise<Sale[]> {
    const stored = localStorage.getItem(SALES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async updateSaleStatus(id: string, status: 'pending' | 'completed' | 'cancelled'): Promise<void> {
    const stored = localStorage.getItem(SALES_KEY);
    if (!stored) return;
    
    let currentSales: Sale[] = JSON.parse(stored);
    currentSales = currentSales.map(sale => 
        sale.id === id ? { ...sale, status } : sale
    );
    
    localStorage.setItem(SALES_KEY, JSON.stringify(currentSales));
  },

  // Chat / Atendimento
  async saveInquiry(inquiry: ChatInquiry): Promise<void> {
    const stored = localStorage.getItem(INQUIRIES_KEY);
    const currentInquiries: ChatInquiry[] = stored ? JSON.parse(stored) : [];
    const newInquiries = [inquiry, ...currentInquiries];
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(newInquiries));
  },

  async getInquiries(): Promise<ChatInquiry[]> {
    const stored = localStorage.getItem(INQUIRIES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  async resolveInquiry(id: string): Promise<void> {
    const stored = localStorage.getItem(INQUIRIES_KEY);
    if (!stored) return;
    
    let currentInquiries: ChatInquiry[] = JSON.parse(stored);
    currentInquiries = currentInquiries.map(inq => 
        inq.id === id ? { ...inq, status: 'resolved' } : inq
    );
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(currentInquiries));
  },

  // --- AUTENTICAÇÃO E USUÁRIOS ---

  async getUserProfile(email: string): Promise<UserProfile | null> {
    if (email === FIXED_ADMIN_USER.email) {
        return {
            email: FIXED_ADMIN_USER.email,
            name: 'Administrador',
            phone: 'Suporte Interno',
            cep: '00000-000',
            address: 'HQ TechyPrint'
        };
    }
    const usersDbStr = localStorage.getItem(USERS_DB_KEY);
    const usersDb = usersDbStr ? JSON.parse(usersDbStr) : {};
    return usersDb[email] || null;
  },

  async registerUser(profile: UserProfile): Promise<void> {
    const usersDbStr = localStorage.getItem(USERS_DB_KEY);
    const usersDb = usersDbStr ? JSON.parse(usersDbStr) : {};

    if (usersDb[profile.email]) {
        throw new Error('E-mail já cadastrado.');
    }

    usersDb[profile.email] = profile;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
  },

  async loginUser(email: string, password: string): Promise<UserProfile> {
    if (email === FIXED_ADMIN_USER.email && password === FIXED_ADMIN_USER.password) {
        return {
            email: FIXED_ADMIN_USER.email,
            name: 'Administrador',
            phone: 'N/A',
            cep: '00000-000',
            address: 'HQ'
        };
    }

    const usersDbStr = localStorage.getItem(USERS_DB_KEY);
    const usersDb = usersDbStr ? JSON.parse(usersDbStr) : {};
    const user = usersDb[email];

    if (!user) {
        throw new Error('Usuário não encontrado.');
    }

    if (user.password !== password) {
        throw new Error('Senha incorreta.');
    }

    return user;
  },

  async updateUserProfile(profile: UserProfile): Promise<void> {
    const usersDbStr = localStorage.getItem(USERS_DB_KEY);
    const usersDb = usersDbStr ? JSON.parse(usersDbStr) : {};

    if (!usersDb[profile.email]) {
        throw new Error('Usuário não encontrado.');
    }

    // Mantém a senha antiga se não for enviada uma nova (embora a interface UserProfile tenha password opcional, aqui garantimos integridade)
    const oldProfile = usersDb[profile.email];
    usersDb[profile.email] = {
        ...oldProfile,
        ...profile,
        password: profile.password || oldProfile.password // Preserva senha se vier vazia/undefined
    };

    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
  }
};