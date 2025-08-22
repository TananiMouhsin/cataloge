import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'Électronique', icon: '📱', count: 8 },
  { id: 2, name: 'Mode', icon: '👕', count: 6 },
  { id: 3, name: 'Maison', icon: '🏠', count: 4 },
  { id: 4, name: 'Sports', icon: '⚽', count: 2 },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'Électronique',
    price: 1199,
    originalPrice: 1299,
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/1275929/pexels-photo-1275929.jpeg',
      'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg'
    ],
    description: 'Le iPhone 15 Pro avec puce A17 Pro révolutionnaire et caméra avancée.',
    specifications: {
      'Écran': '6.1 pouces Super Retina XDR',
      'Puce': 'A17 Pro',
      'Stockage': '128 Go',
      'Caméra': 'Système à triple caméra 48 Mpx'
    },
    stock: 15,
    isNew: true,
    rating: 4.8,
    reviews: [
      { id: 1, author: 'Marie L.', rating: 5, comment: 'Excellent produit, très satisfaite !', date: '2024-01-15' },
      { id: 2, author: 'Pierre D.', rating: 4, comment: 'Bon téléphone, un peu cher mais de qualité.', date: '2024-01-10' }
    ]
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    brand: 'Apple',
    category: 'Électronique',
    price: 1499,
    images: [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
      'https://images.pexels.com/photos/18105/pexels-photo.jpg'
    ],
    description: 'MacBook Air avec la puce M3, ultraléger et performant.',
    specifications: {
      'Processeur': 'Apple M3',
      'RAM': '8 Go',
      'Stockage': '256 Go SSD',
      'Écran': '13.6 pouces Liquid Retina'
    },
    stock: 8,
    isNew: true,
    rating: 4.9,
    reviews: []
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24',
    brand: 'Samsung',
    category: 'Électronique',
    price: 899,
    images: [
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg',
      'https://images.pexels.com/photos/3178744/pexels-photo-3178744.jpeg'
    ],
    description: 'Smartphone Samsung Galaxy S24 avec IA avancée et caméra professionnelle.',
    specifications: {
      'Écran': '6.2 pouces Dynamic AMOLED',
      'Processeur': 'Exynos 2400',
      'RAM': '8 Go',
      'Stockage': '128 Go'
    },
    stock: 12,
    isNew: false,
    rating: 4.6,
    reviews: []
  },
  {
    id: 4,
    name: 'Nike Air Max 270',
    brand: 'Nike',
    category: 'Sports',
    price: 149,
    originalPrice: 179,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
      'https://images.pexels.com/photos/1456736/pexels-photo-1456736.jpeg'
    ],
    description: 'Baskets Nike Air Max 270 avec amorti Air Max visible.',
    specifications: {
      'Matière': 'Mesh et cuir synthétique',
      'Semelle': 'Air Max',
      'Couleur': 'Noir/Blanc',
      'Tailles': '36-46'
    },
    stock: 25,
    isNew: false,
    rating: 4.4,
    reviews: []
  },
  {
    id: 5,
    name: 'Adidas Ultraboost 22',
    brand: 'Adidas',
    category: 'Sports',
    price: 189,
    images: [
      'https://images.pexels.com/photos/1456736/pexels-photo-1456736.jpeg'
    ],
    description: 'Chaussures de running Adidas Ultraboost 22 avec technologie Boost.',
    specifications: {
      'Technologie': 'Boost',
      'Matière': 'Primeknit',
      'Usage': 'Running',
      'Poids': '320g'
    },
    stock: 18,
    isNew: true,
    rating: 4.7,
    reviews: []
  },
  {
    id: 6,
    name: 'T-shirt Premium Coton',
    brand: 'Uniqlo',
    category: 'Mode',
    price: 29,
    images: [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
    ],
    description: 'T-shirt en coton premium, confortable et durable.',
    specifications: {
      'Matière': '100% Coton',
      'Coupe': 'Regular',
      'Tailles': 'XS-XXL',
      'Entretien': 'Lavable en machine'
    },
    stock: 50,
    isNew: false,
    rating: 4.2,
    reviews: []
  },
  {
    id: 7,
    name: 'Jeans Slim Fit',
    brand: 'Levi\'s',
    category: 'Mode',
    price: 89,
    images: [
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'
    ],
    description: 'Jean slim fit Levi\'s, coupe moderne et confortable.',
    specifications: {
      'Coupe': 'Slim Fit',
      'Matière': '98% Coton, 2% Elasthanne',
      'Couleur': 'Bleu délavé',
      'Tailles': '28-38'
    },
    stock: 30,
    isNew: false,
    rating: 4.5,
    reviews: []
  },
  {
    id: 8,
    name: 'Veste en Cuir',
    brand: 'Zara',
    category: 'Mode',
    price: 199,
    originalPrice: 249,
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    description: 'Veste en cuir véritable, style moderne et intemporel.',
    specifications: {
      'Matière': 'Cuir véritable',
      'Doublure': 'Polyester',
      'Fermeture': 'Fermeture éclair',
      'Poches': '4 poches extérieures'
    },
    stock: 5,
    isNew: false,
    rating: 4.6,
    reviews: []
  },
  {
    id: 9,
    name: 'Canapé Scandinave 3 places',
    brand: 'IKEA',
    category: 'Maison',
    price: 599,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'
    ],
    description: 'Canapé 3 places style scandinave, confortable et élégant.',
    specifications: {
      'Dimensions': '210 x 88 x 83 cm',
      'Matière': 'Tissu polyester',
      'Couleur': 'Gris clair',
      'Montage': 'Requis'
    },
    stock: 3,
    isNew: true,
    rating: 4.3,
    reviews: []
  },
  {
    id: 10,
    name: 'Table Basse Design',
    brand: 'Maisons du Monde',
    category: 'Maison',
    price: 299,
    images: [
      'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg'
    ],
    description: 'Table basse design en bois massif et métal.',
    specifications: {
      'Dimensions': '120 x 60 x 45 cm',
      'Matière': 'Bois de chêne et métal',
      'Style': 'Industriel',
      'Poids': '25 kg'
    },
    stock: 7,
    isNew: false,
    rating: 4.4,
    reviews: []
  },
  {
    id: 11,
    name: 'Lampe de Bureau LED',
    brand: 'Philips',
    category: 'Maison',
    price: 79,
    images: [
      'https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg'
    ],
    description: 'Lampe de bureau LED avec variateur d\'intensité.',
    specifications: {
      'Puissance': '12W LED',
      'Luminosité': '1000 lumens',
      'Température': '3000K-6500K',
      'Contrôle': 'Tactile'
    },
    stock: 20,
    isNew: false,
    rating: 4.1,
    reviews: []
  },
  {
    id: 12,
    name: 'Coussin Décoratif',
    brand: 'H&M Home',
    category: 'Maison',
    price: 19,
    images: [
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'
    ],
    description: 'Coussin décoratif en velours, parfait pour le salon.',
    specifications: {
      'Dimensions': '50 x 50 cm',
      'Matière': 'Velours polyester',
      'Couleur': 'Bleu nuit',
      'Entretien': 'Lavable à 30°C'
    },
    stock: 40,
    isNew: false,
    rating: 3.9,
    reviews: []
  },
  {
    id: 13,
    name: 'Montre Connectée',
    brand: 'Garmin',
    category: 'Électronique',
    price: 349,
    images: [
      'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg'
    ],
    description: 'Montre connectée Garmin avec GPS et suivi d\'activité.',
    specifications: {
      'Écran': '1.3 pouces couleur',
      'Autonomie': '14 jours',
      'GPS': 'Oui',
      'Étanchéité': '5 ATM'
    },
    stock: 11,
    isNew: true,
    rating: 4.5,
    reviews: []
  },
  {
    id: 14,
    name: 'Casque Audio Bluetooth',
    brand: 'Sony',
    category: 'Électronique',
    price: 249,
    originalPrice: 299,
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
    ],
    description: 'Casque audio sans fil avec réduction de bruit active.',
    specifications: {
      'Autonomie': '30 heures',
      'Réduction de bruit': 'Active',
      'Connectivité': 'Bluetooth 5.2',
      'Poids': '254g'
    },
    stock: 16,
    isNew: false,
    rating: 4.7,
    reviews: []
  },
  {
    id: 15,
    name: 'Tablette iPad Air',
    brand: 'Apple',
    category: 'Électronique',
    price: 699,
    images: [
      'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg'
    ],
    description: 'iPad Air avec puce M2, écran Liquid Retina 10.9 pouces.',
    specifications: {
      'Écran': '10.9 pouces Liquid Retina',
      'Puce': 'Apple M2',
      'Stockage': '64 Go',
      'Caméra': '12 Mpx'
    },
    stock: 9,
    isNew: true,
    rating: 4.8,
    reviews: []
  },
  {
    id: 16,
    name: 'Écouteurs AirPods Pro',
    brand: 'Apple',
    category: 'Électronique',
    price: 279,
    images: [
      'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg'
    ],
    description: 'AirPods Pro avec réduction de bruit adaptative.',
    specifications: {
      'Autonomie': '6h + 24h avec boîtier',
      'Réduction de bruit': 'Adaptative',
      'Résistance': 'IPX4',
      'Connectivité': 'Bluetooth 5.3'
    },
    stock: 22,
    isNew: false,
    rating: 4.6,
    reviews: []
  },
  {
    id: 17,
    name: 'Robe d\'Été Fleurie',
    brand: 'Mango',
    category: 'Mode',
    price: 59,
    images: [
      'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg'
    ],
    description: 'Robe d\'été légère avec motifs floraux, parfaite pour les beaux jours.',
    specifications: {
      'Matière': '100% Viscose',
      'Longueur': 'Mi-longue',
      'Manches': 'Courtes',
      'Tailles': 'XS-XL'
    },
    stock: 35,
    isNew: true,
    rating: 4.3,
    reviews: []
  },
  {
    id: 18,
    name: 'Chemise Business',
    brand: 'Hugo Boss',
    category: 'Mode',
    price: 129,
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    description: 'Chemise business en coton, coupe slim et élégante.',
    specifications: {
      'Matière': '100% Coton',
      'Coupe': 'Slim',
      'Col': 'Italien',
      'Couleur': 'Blanc'
    },
    stock: 24,
    isNew: false,
    rating: 4.4,
    reviews: []
  },
  {
    id: 19,
    name: 'Blazer Femme',
    brand: 'Zara',
    category: 'Mode',
    price: 99,
    originalPrice: 119,
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'
    ],
    description: 'Blazer femme moderne, parfait pour le bureau ou les sorties.',
    specifications: {
      'Matière': 'Polyester et Élasthanne',
      'Coupe': 'Cintrée',
      'Fermeture': 'Un bouton',
      'Doublure': 'Oui'
    },
    stock: 14,
    isNew: false,
    rating: 4.2,
    reviews: []
  },
  {
    id: 20,
    name: 'Chaussures de Ville',
    brand: 'Clarks',
    category: 'Mode',
    price: 159,
    images: [
      'https://images.pexels.com/photos/1456736/pexels-photo-1456736.jpeg'
    ],
    description: 'Chaussures de ville en cuir, confortables et élégantes.',
    specifications: {
      'Matière': 'Cuir véritable',
      'Semelle': 'Caoutchouc',
      'Style': 'Oxford',
      'Couleur': 'Noir'
    },
    stock: 19,
    isNew: false,
    rating: 4.5,
    reviews: []
  }
];