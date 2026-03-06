CREATE DATABASE IF NOT EXISTS `DB_invit_get_money` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `DB_invit_get_money`;

DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS relations;
DROP TABLE IF EXISTS clients;

CREATE TABLE clients (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  city VARCHAR(80) NOT NULL,
  joined_at DATE NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

CREATE TABLE relations (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  parrain_id INT UNSIGNED NOT NULL,
  filleul_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_parrain_filleul (parrain_id, filleul_id),
  CONSTRAINT fk_relations_parrain FOREIGN KEY (parrain_id)
    REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_relations_filleul FOREIGN KEY (filleul_id)
    REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE purchases (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  client_id INT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (id),
  KEY idx_purchases_client (client_id),
  CONSTRAINT fk_purchases_client FOREIGN KEY (client_id)
    REFERENCES clients(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO clients (id, name, email, city, joined_at) VALUES
  (1, 'Alice Martin', 'alice@entreprise.fr', 'Lyon', '2024-02-18'),
  (2, 'Bob Diallo', 'bob@entreprise.fr', 'Lille', '2024-03-02'),
  (3, 'Charlie Morel', 'charlie@entreprise.fr', 'Paris', '2024-03-15'),
  (4, 'David Kouam', 'david@entreprise.fr', 'Marseille', '2024-04-01'),
  (5, 'Eva Renaud', 'eva@entreprise.fr', 'Toulouse', '2024-04-12'),
  (6, 'Farid Ben', 'farid@entreprise.fr', 'Nice', '2024-05-01'),
  (7, 'Gaby Lemoine', 'gaby@entreprise.fr', 'Nantes', '2024-05-05'),
  (8, 'Hugo Durant', 'hugo@entreprise.fr', 'Rennes', '2024-05-09'),
  (9, 'Ines Valette', 'ines@entreprise.fr', 'Bordeaux', '2024-05-20'),
  (10, 'Jules Mahé', 'jules@entreprise.fr', 'Grenoble', '2024-06-03'),
  (11, 'Karim Roche', 'karim@entreprise.fr', 'Montpellier', '2024-06-15');

INSERT INTO relations (id, parrain_id, filleul_id) VALUES
  (1, 1, 2),
  (2, 1, 3),
  (3, 1, 5),
  (4, 2, 4),
  (5, 2, 6),
  (6, 3, 7),
  (7, 3, 8),
  (8, 5, 9),
  (9, 6, 10),
  (10, 8, 11);

INSERT INTO purchases (id, client_id, amount, date) VALUES
  (1, 2, 200, '2025-01-12'),
  (2, 2, 130, '2025-02-04'),
  (3, 3, 150, '2025-01-18'),
  (4, 3, 90, '2025-02-25'),
  (5, 4, 350, '2025-01-21'),
  (6, 4, 80, '2025-03-03'),
  (7, 5, 220, '2025-01-30'),
  (8, 5, 140, '2025-02-12'),
  (9, 6, 310, '2025-02-08'),
  (10, 6, 90, '2025-03-02'),
  (11, 7, 180, '2025-02-14'),
  (12, 7, 210, '2025-03-09'),
  (13, 8, 260, '2025-02-27'),
  (14, 9, 175, '2025-02-22'),
  (15, 10, 240, '2025-02-18'),
  (16, 11, 160, '2025-02-19');
