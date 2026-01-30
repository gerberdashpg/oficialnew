-- Add buttons for each plan level
INSERT INTO plan_upgrade_links (id, link_key, link_url, label, description, created_at, updated_at)
VALUES 
  (gen_random_uuid(), 'atendente_start', 'https://wa.me/5511999999999', 'Falar com um especialista da PRO GROWTH GLOBAL', 'Botão de atendimento para clientes START', NOW(), NOW()),
  (gen_random_uuid(), 'atendente_pro', 'https://wa.me/5511999999999', 'Falar com um especialista da PRO GROWTH GLOBAL', 'Botão de atendimento para clientes PRO', NOW(), NOW()),
  (gen_random_uuid(), 'atendente_scale', 'https://wa.me/5511999999999', 'Falar com um especialista da PRO GROWTH GLOBAL', 'Botão de atendimento para clientes SCALE', NOW(), NOW())
ON CONFLICT (link_key) DO NOTHING;
