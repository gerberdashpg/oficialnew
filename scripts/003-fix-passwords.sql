-- Fix user passwords with correct bcrypt hash for 'password123'
-- Hash generated: $2a$10$N9qo8uLOickgx2ZMRZoMy.MQDj6Lf1G2SysFV9Yz7V5N6E.WK.C2y

UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQDj6Lf1G2SysFV9Yz7V5N6E.WK.C2y'
WHERE email IN (
  'admin@saas.com',
  'admin@techcorp.com',
  'joao@techcorp.com',
  'admin@startupxyz.com',
  'admin@megastore.com',
  'admin@innovate.com'
);
