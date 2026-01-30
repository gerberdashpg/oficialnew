-- Table for admin-configurable links for upgrade buttons
CREATE TABLE IF NOT EXISTS plan_upgrade_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_key VARCHAR(100) UNIQUE NOT NULL,
  link_url TEXT NOT NULL DEFAULT '',
  label VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default links
INSERT INTO plan_upgrade_links (link_key, link_url, label, description) VALUES
-- START to PRO upgrade
('start_to_pro_upgrade', '', 'Upgrade START para PRO', 'Link do botão de upgrade do plano START para PRO'),
('start_to_scale_upgrade', '', 'Upgrade START para SCALE', 'Link do botão de upgrade do plano START para SCALE'),

-- PRO locked features
('pro_unlock_tema_growth', '', 'Desbloquear Tema Growth', 'Link para desbloquear Tema Growth 2026'),
('pro_unlock_teaser', '', 'Desbloquear Teaser', 'Link para desbloquear Teaser personalizado'),
('pro_unlock_instagram_facebook', '', 'Desbloquear Instagram/Facebook', 'Link para desbloquear estruturação de redes'),
('pro_unlock_pixel_meta', '', 'Desbloquear Pixel Meta', 'Link para desbloquear Pixel Meta ADS'),
('pro_unlock_criativos', '', 'Desbloquear Criativos', 'Link para desbloquear criativos profissionais'),
('pro_unlock_gestao_trafego', '', 'Desbloquear Gestão Tráfego', 'Link para desbloquear gestão de tráfego'),
('pro_upgrade_to_scale', '', 'Upgrade PRO para SCALE', 'Link do botão de upgrade do plano PRO para SCALE'),

-- SCALE extra services
('scale_mentoria', '', 'Solicitar Mentoria', 'Link para solicitar Mentoria Estratégica 1:1'),
('scale_google_ads', '', 'Solicitar Google Ads', 'Link para solicitar Google Ads'),
('scale_tiktok_ads', '', 'Solicitar TikTok Ads', 'Link para solicitar TikTok Ads'),
('scale_criativos_ugc', '', 'Solicitar Criativos UGC', 'Link para solicitar Criativos UGC & Branding Ads')

ON CONFLICT (link_key) DO NOTHING;

-- Table for tracking step status per client (editable by admin)
CREATE TABLE IF NOT EXISTS client_step_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  step_key VARCHAR(100) NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(client_id, step_key)
);

CREATE INDEX IF NOT EXISTS idx_client_step_status_client ON client_step_status(client_id);
