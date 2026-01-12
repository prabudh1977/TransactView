-- database_setup.sql


-- 1. Create Database
CREATE DATABASE IF NOT EXISTS payment_db;
USE payment_db;

-- 2. Drop Table if exists (to reset clean)
DROP TABLE IF EXISTS transactions;

-- 3. Create Table (Matches Spring Boot Entity)
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    merchant VARCHAR(255),
    customer_email VARCHAR(255),
    amount DOUBLE,
    status VARCHAR(50),
    payment_method VARCHAR(50),
    refund_status VARCHAR(50) DEFAULT 'NONE',
    failure_reason VARCHAR(255),
    timestamp DATETIME
);

-- 4. Insert Data (Dynamic Dates for Dashboard)

INSERT INTO transactions (transaction_id, merchant, customer_email, amount, status, payment_method, refund_status, failure_reason, timestamp) VALUES 

-- === 🟢 RECENT: LAST 24 HOURS (Shows in All Charts) ===
('TXN_2075', 'Uber Eats', 'hungry@food.com', 25.50, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 1 HOUR),
('TXN_2074', 'Starbucks', 'coffee@morning.com', 8.75, 'SUCCESS', 'Apple Pay', 'NONE', NULL, NOW() - INTERVAL 3 HOUR),
('TXN_2073', 'Steam', 'gamer123@steam.com', 60.00, 'FAILED', 'PayPal', 'NONE', 'Insufficient Funds', NOW() - INTERVAL 5 HOUR),
('TXN_2072', 'Amazon', 'tech.gadget@gmail.com', 120.50, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 8 HOUR),
('TXN_2071', 'Walmart', 'groceries@fam.com', 215.00, 'PENDING', 'Debit Card', 'NONE', NULL, NOW() - INTERVAL 12 HOUR),

-- === 🟡 THIS WEEK: LAST 7 DAYS (Shows in 7D & 30D Charts) ===
('TXN_2070', 'Target', 'toys.kids@test.com', 45.00, 'SUCCESS', 'Credit Card', 'REFUNDED', NULL, NOW() - INTERVAL 1 DAY),
('TXN_2069', 'Netflix', 'charlie.watch@gmail.com', 15.99, 'SUCCESS', 'Debit Card', 'NONE', NULL, NOW() - INTERVAL 2 DAY),
('TXN_2068', 'Spotify', 'music.lover@yahoo.com', 9.99, 'FAILED', 'Credit Card', 'NONE', 'Gateway Timeout', NOW() - INTERVAL 2 DAY),
('TXN_2067', 'Apple', 'iphone.buy@icloud.com', 1200.00, 'PENDING', 'Bank Transfer', 'NONE', NULL, NOW() - INTERVAL 3 DAY),
('TXN_2066', 'Airbnb', 'traveler@trip.com', 350.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 4 DAY),
('TXN_2065', 'Best Buy', 'laptop@school.edu', 1450.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 5 DAY),
('TXN_2064', 'Nike', 'runner@sport.com', 120.00, 'SUCCESS', 'Debit Card', 'NONE', NULL, NOW() - INTERVAL 6 DAY),

-- === 🔵 THIS MONTH: LAST 30 DAYS (Shows only in 30D Chart) ===
('TXN_2063', 'Adidas', 'shoes@gym.com', 85.00, 'FAILED', 'Credit Card', 'NONE', 'Gateway Timeout', NOW() - INTERVAL 8 DAY),
('TXN_2062', 'PlayStation', 'sony@game.com', 70.00, 'SUCCESS', 'PayPal', 'REQUESTED', NULL, NOW() - INTERVAL 10 DAY),
('TXN_2061', 'Amazon', 'books@read.com', 45.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 12 DAY),
('TXN_2060', 'Uber', 'late.ride@test.com', 12.50, 'SUCCESS', 'PayPal', 'NONE', NULL, NOW() - INTERVAL 15 DAY),
('TXN_2059', 'Netflix', 'shared.acct@fam.com', 19.99, 'FAILED', 'Debit Card', 'NONE', 'Gateway Timeout', NOW() - INTERVAL 18 DAY),
('TXN_2058', 'Hulu', 'shows@tv.com', 12.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 20 DAY),
('TXN_2057', 'Delta', 'flyer@sky.com', 450.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 22 DAY),
('TXN_2056', 'Airbnb', 'host@rent.com', 890.00, 'PENDING', 'Bank Transfer', 'NONE', NULL, NOW() - INTERVAL 25 DAY),
('TXN_2055', 'Lyft', 'city.ride@test.com', 18.00, 'SUCCESS', 'PayPal', 'NONE', NULL, NOW() - INTERVAL 28 DAY),

('TXN_2054', 'Gap', 'jeans@blue.com', 40.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 30 DAY),
('TXN_2053', 'Uniqlo', 'winter@coat.com', 110.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 31 DAY),
('TXN_2052', 'H&M', 'basics@wear.com', 25.00, 'SUCCESS', 'Cash', 'NONE', NULL, NOW() - INTERVAL 32 DAY),
('TXN_2051', 'Zara', 'fashion@trend.com', 60.00, 'FAILED', 'Debit Card', 'NONE', 'Insufficient Funds', NOW() - INTERVAL 33 DAY),
('TXN_2050', 'Nordstrom', 'suit@work.com', 350.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 35 DAY),
('TXN_2049', 'Macy\'s', 'gift@mom.com', 85.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 36 DAY),
('TXN_2048', 'Ulta', 'hair@style.com', 45.00, 'SUCCESS', 'Debit Card', 'NONE', NULL, NOW() - INTERVAL 38 DAY),
('TXN_2047', 'Sephora', 'makeup@beauty.com', 120.00, 'SUCCESS', 'PayPal', 'NONE', NULL, NOW() - INTERVAL 40 DAY),
('TXN_2046', 'GameStop', 'console@play.com', 499.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 42 DAY),

-- === ⚫ HISTORICAL DATA (Older than 2 Months - For Search Testing) ===
('TXN_2045', 'Best Buy', 'tv@livingroom.com', 800.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 60 DAY),
('TXN_2044', 'Lowes', 'tools@garden.com', 89.00, 'SUCCESS', 'Debit Card', 'NONE', NULL, NOW() - INTERVAL 65 DAY),
('TXN_2043', 'Home Depot', 'paint@reno.com', 65.00, 'SUCCESS', 'Credit Card', 'NONE', NULL, NOW() - INTERVAL 70 DAY),
('TXN_2042', 'IKEA', 'desk@office.com', 120.00, 'FAILED', 'Bank Transfer', 'NONE', 'Gateway Timeout', NOW() - INTERVAL 75 DAY);