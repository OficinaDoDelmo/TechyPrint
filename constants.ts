import { Product } from './types';

export const FIXED_ADMIN_USER = {
  email: 'delmoneto2@gmail.com',
  password: 'admin'
};

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dragão Articulado Crystal',
    description: 'Dragão totalmente flexível impresso em uma única peça. Acabamento brilhante e design intrincado.',
    price: 45.90,
    category: 'Brinquedos',
    material: 'PLA',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    isNew: true
  },
  {
    id: '2',
    name: 'Suporte Headphone Voronoi',
    description: 'Suporte para fones de ouvido com padrão celular orgânico. Leve, resistente e esteticamente moderno.',
    price: 89.00,
    category: 'Acessórios Tech',
    material: 'PETG',
    imageUrl: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: '3',
    name: 'Vaso Geométrico Low Poly',
    description: 'Vaso decorativo ideal para suculentas. Design minimalista facetado.',
    price: 35.50,
    category: 'Decoração',
    material: 'PLA',
    imageUrl: 'https://picsum.photos/400/400?random=3'
  },
  {
    id: '4',
    name: 'Organizador de Cabos Hex',
    description: 'Sistema modular hexagonal para organização de cabos em mesas de escritório.',
    price: 22.00,
    category: 'Organização',
    material: 'PLA',
    imageUrl: 'https://picsum.photos/400/400?random=4'
  },
  {
    id: '5',
    name: 'Lâmpada Litofania Personalizável',
    description: 'Lâmpada que revela uma imagem detalhada quando acesa. Impressão de altíssima resolução.',
    price: 120.00,
    category: 'Decoração',
    material: 'Resina',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    isNew: true
  },
  {
    id: '6',
    name: 'Keycap Mecânica Artisan',
    description: 'Tecla personalizada para teclados mecânicos (Switch MX). Pintada à mão.',
    price: 55.00,
    category: 'Acessórios Tech',
    material: 'Resina',
    imageUrl: 'https://picsum.photos/400/400?random=6'
  },
  {
    id: '7',
    name: 'Suporte Celular Polvo',
    description: 'Suporte divertido em formato de tentáculos para smartphones e pequenos tablets.',
    price: 29.90,
    category: 'Acessórios Tech',
    material: 'TPU',
    imageUrl: 'https://picsum.photos/400/400?random=7'
  },
  {
    id: '8',
    name: 'Engrenagens Pedagógicas',
    description: 'Kit de engrenagens funcionais para ensino de física e mecânica básica.',
    price: 65.00,
    category: 'Educacional',
    material: 'PETG',
    imageUrl: 'https://picsum.photos/400/400?random=8'
  }
];

export const SYSTEM_INSTRUCTION = `
Você é o TechyBot, o assistente virtual da loja 'TechyPrint 3D'.
Somos especializados em impressão 3D de alta qualidade, decoração e acessórios.
Seu objetivo é ser educado, profissional e útil. Ajude os clientes a encontrar produtos, explique os materiais (PLA, PETG, Resina) de forma simples e ajude com dúvidas sobre personalização.

Aqui está o banco de dados atual de produtos (JSON):
${JSON.stringify(PRODUCTS)}

Diretrizes:
1. Responda sempre em Português do Brasil com tom profissional e amigável.
2. Evite gírias técnicas excessivas ou temática "cyberpunk" exagerada, seja prático.
3. Se o cliente quiser algo personalizado, encoraje-o a usar a ferramenta "Laboratório 3D" no menu.
4. Identifique-se como TechyBot se perguntarem seu nome.
5. Explicação simples de materiais:
   - PLA: Plástico padrão, ótimo para decoração.
   - PETG: Mais resistente, aguenta calor.
   - Resina: Altíssimo detalhe, para miniaturas.
   - TPU: Flexível, como borracha.
`;