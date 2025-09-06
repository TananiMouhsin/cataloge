-- Insérer des catégories
INSERT INTO `categorie` (`nom`) VALUES
('Smartphones'),
('Laptops'),
('Tablettes'),
('Accessoires'),
('Gaming');

-- Insérer des marques
INSERT INTO `marque` (`nom`) VALUES
('Apple'),
('Samsung'),
('Dell'),
('HP'),
('Sony'),
('Nintendo'),
('Logitech');

-- Insérer des produits avec images
INSERT INTO `produit` (`id_produit`, `id_categorie`, `id_marque`, `nom`, `description`, `prix`, `stock`, `qr_code_path`, `reste`) VALUES
('P001', 1, 1, 'iPhone 15 Pro', 'Dernier iPhone avec puce A17 Pro, caméra 48MP et écran Super Retina XDR', 1199.99, 25, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 25),
('P002', 1, 2, 'Samsung Galaxy S24 Ultra', 'Smartphone Android haut de gamme avec IA, S Pen et caméra 200MP', 1299.99, 30, 'https://images.unsplash.com/photo-1511707171631-9ed0a0b2b65d?w=500', 30),
('P003', 2, 1, 'MacBook Pro 16" M3 Max', 'Laptop professionnel avec puce M3 Max, 32GB RAM, 1TB SSD', 3499.99, 15, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500', 15),
('P004', 2, 3, 'Dell XPS 15', 'Laptop ultraportable avec écran 4K OLED, Intel i7, 16GB RAM', 1799.99, 20, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 20),
('P005', 3, 1, 'iPad Pro 12.9" M2', 'Tablette professionnelle avec puce M2, écran Liquid Retina XDR', 1099.99, 18, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 18),
('P006', 3, 2, 'Samsung Galaxy Tab S9 Ultra', 'Tablette Android avec écran AMOLED 14.6", S Pen inclus', 1199.99, 22, 'https://images.unsplash.com/photo-1561154464-82e9adf327c3?w=500', 22),
('P007', 4, 1, 'AirPods Pro 2', 'Écouteurs sans fil avec réduction de bruit active et audio spatial', 249.99, 50, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500', 50),
('P008', 4, 2, 'Samsung Galaxy Buds2 Pro', 'Écouteurs sans fil avec qualité audio premium et réduction de bruit', 199.99, 40, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d4f46?w=500', 40),
('P009', 4, 5, 'Sony WH-1000XM5', 'Casque sans fil avec réduction de bruit leader du marché', 399.99, 35, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500', 35),
('P010', 5, 6, 'Nintendo Switch OLED', 'Console portable avec écran OLED 7", 64GB de stockage', 349.99, 28, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500', 28),
('P011', 5, 4, 'HP Omen 15', 'Laptop gaming avec RTX 4060, Intel i7, 16GB RAM, 512GB SSD', 1299.99, 12, 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500', 12),
('P012', 4, 7, 'Logitech MX Master 3S', 'Souris sans fil professionnelle avec scroll MagSpeed', 99.99, 60, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 60),
('P013', 1, 1, 'iPhone 14', 'iPhone avec puce A15 Bionic, caméra 12MP et Face ID', 799.99, 40, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500', 40),
('P014', 2, 2, 'Samsung Galaxy Book3 Pro', 'Laptop avec écran AMOLED 16", Intel i7, 16GB RAM', 1399.99, 18, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 18),
('P015', 4, 1, 'Apple Watch Series 9', 'Montre connectée avec puce S9, GPS, et écran Always-On', 399.99, 45, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500', 45);
