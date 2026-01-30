-- Adicionar constraint unique na coluna link_key se nao existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'plan_upgrade_links_link_key_key'
    ) THEN
        ALTER TABLE plan_upgrade_links ADD CONSTRAINT plan_upgrade_links_link_key_key UNIQUE (link_key);
    END IF;
END $$;

-- Inserir link padrao do especialista se nao existir
INSERT INTO plan_upgrade_links (id, link_key, link_url, label, description, created_at, updated_at)
VALUES (
    gen_random_uuid(), 
    'specialist_whatsapp', 
    'https://wa.me/5511999999999', 
    'Falar com Especialista',
    'Link do WhatsApp para contato com especialista PRO GROWTH GLOBAL',
    NOW(), 
    NOW()
)
ON CONFLICT (link_key) DO NOTHING;
