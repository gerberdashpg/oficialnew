-- Create test admin user with plain text password (FOR TESTING ONLY!)
-- Email: test@admin.com
-- Password: admin123

-- Delete existing test admin if exists
DELETE FROM users WHERE email = 'test@admin.com';

-- Insert test admin with plain text password
INSERT INTO users (id, name, email, password_hash, role, client_id) VALUES
('99999999-9999-9999-9999-999999999999', 'Test Admin', 'test@admin.com', 'admin123', 'ADMIN', NULL);
