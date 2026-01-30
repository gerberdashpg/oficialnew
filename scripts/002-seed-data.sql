-- Seed data for SaaS Dashboard

-- Insert sample clients
INSERT INTO clients (id, name, slug, plan, status, drive_link, notes) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'TechCorp Solutions', 'techcorp', 'SCALE', 'ACTIVE', 'https://drive.google.com/techcorp', 'Cliente premium com suporte prioritário'),
('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'StartupXYZ', 'startupxyz', 'PRO', 'ACTIVE', 'https://drive.google.com/startupxyz', 'Startup em crescimento'),
('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'MegaStore Brasil', 'megastore', 'START', 'ACTIVE', NULL, 'Plano básico'),
('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'Innovate Labs', 'innovate', 'PRO', 'PAUSED', 'https://drive.google.com/innovate', 'Conta pausada - aguardando pagamento');

-- Insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (id, name, email, password_hash, role, client_id) VALUES
-- Super Admin (no client)
('11111111-1111-1111-1111-111111111111', 'Super Admin', 'admin@saas.com', '$2b$10$rQZ8K.HQk5HqNxqVvQvZxOqE8vYK7VqVZ6qZqZqZqZqZqZqZqZqZq', 'ADMIN', NULL),
-- TechCorp users
('22222222-2222-2222-2222-222222222222', 'Admin TechCorp', 'admin@techcorp.com', '$2b$10$rQZ8K.HQk5HqNxqVvQvZxOqE8vYK7VqVZ6qZqZqZqZqZqZqZqZqZq', 'CLIENTE', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'),
('33333333-3333-3333-3333-333333333333', 'Joao Silva', 'joao@techcorp.com', '$2b$10$rQZ8K.HQk5HqNxqVvQvZxOqE8vYK7VqVZ6qZqZqZqZqZqZqZqZqZq', 'CLIENTE', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d'),
-- StartupXYZ users
('44444444-4444-4444-4444-444444444444', 'Admin Startup', 'admin@startupxyz.com', '$2b$10$rQZ8K.HQk5HqNxqVvQvZxOqE8vYK7VqVZ6qZqZqZqZqZqZqZqZqZq', 'CLIENTE', 'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e'),
-- MegaStore users
('55555555-5555-5555-5555-555555555555', 'Admin MegaStore', 'admin@megastore.com', '$2b$10$rQZ8K.HQk5HqNxqVvQvZxOqE8vYK7VqVZ6qZqZqZqZqZqZqZqZqZq', 'CLIENTE', 'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f'),
-- Innovate Labs users
('66666666-6666-6666-6666-666666666666', 'Admin Innovate', 'admin@innovate.com', '$2b$10$rQZ8K.HQk5HqNxqVvQvZxOqE8vYK7VqVZ6qZqZqZqZqZqZqZqZqZq', 'CLIENTE', 'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a');

-- Insert sample accesses (credentials for services)
INSERT INTO accesses (client_id, service_name, service_url, login, password) VALUES
-- TechCorp accesses
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Google Analytics', 'https://analytics.google.com', 'techcorp@gmail.com', 'ga_password_123'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'AWS Console', 'https://aws.amazon.com/console', 'techcorp-admin', 'aws_secret_key'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Cloudflare', 'https://dash.cloudflare.com', 'admin@techcorp.com', 'cf_pass_456'),
-- StartupXYZ accesses
('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Vercel', 'https://vercel.com', 'startup@vercel.com', 'vercel_token'),
('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'GitHub', 'https://github.com', 'startupxyz', 'gh_token_789'),
-- MegaStore accesses
('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Shopify', 'https://admin.shopify.com', 'megastore-admin', 'shopify_api_key');

-- Insert sample notices
INSERT INTO notices (client_id, title, message) VALUES
-- TechCorp notices
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Bem-vindo ao Plano Scale!', 'Sua conta foi atualizada para o plano Scale. Aproveite recursos ilimitados e suporte prioritario.'),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Manutencao Programada', 'O sistema estara em manutencao no dia 25/01 das 02:00 as 04:00.'),
-- StartupXYZ notices
('b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e', 'Nova Funcionalidade', 'Agora voce pode exportar relatorios em PDF diretamente do dashboard.'),
-- MegaStore notices
('c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f', 'Upgrade Recomendado', 'Considere fazer upgrade para o plano Pro para mais recursos e integrações.'),
-- Innovate notices
('d4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a', 'Conta Pausada', 'Sua conta foi pausada por falta de pagamento. Entre em contato para reativar.');
