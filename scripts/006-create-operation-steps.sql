-- Tabela de etapas da operação (Mapa da Operação)
CREATE TABLE IF NOT EXISTS operation_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  order_index INTEGER DEFAULT 0,
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_operation_steps_client ON operation_steps(client_id);
CREATE INDEX IF NOT EXISTS idx_operation_steps_status ON operation_steps(status);

-- Inserir etapas padrão para clientes existentes
INSERT INTO operation_steps (client_id, title, description, status, order_index)
SELECT 
  c.id,
  'Onboarding',
  'Reunião inicial e coleta de informações',
  'completed',
  1
FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM operation_steps WHERE client_id = c.id);

INSERT INTO operation_steps (client_id, title, description, status, order_index)
SELECT 
  c.id,
  'Planejamento Estratégico',
  'Definição de metas e estratégias',
  'completed',
  2
FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM operation_steps WHERE client_id = c.id AND title = 'Planejamento Estratégico');

INSERT INTO operation_steps (client_id, title, description, status, order_index)
SELECT 
  c.id,
  'Configuração de Ferramentas',
  'Setup de plataformas e integrações',
  'in_progress',
  3
FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM operation_steps WHERE client_id = c.id AND title = 'Configuração de Ferramentas');

INSERT INTO operation_steps (client_id, title, description, status, order_index)
SELECT 
  c.id,
  'Criação de Conteúdo',
  'Desenvolvimento de materiais e criativos',
  'pending',
  4
FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM operation_steps WHERE client_id = c.id AND title = 'Criação de Conteúdo');

INSERT INTO operation_steps (client_id, title, description, status, order_index)
SELECT 
  c.id,
  'Lançamento',
  'Início das campanhas e ações',
  'pending',
  5
FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM operation_steps WHERE client_id = c.id AND title = 'Lançamento');

INSERT INTO operation_steps (client_id, title, description, status, order_index)
SELECT 
  c.id,
  'Otimização Contínua',
  'Análise de resultados e melhorias',
  'pending',
  6
FROM clients c
WHERE NOT EXISTS (SELECT 1 FROM operation_steps WHERE client_id = c.id AND title = 'Otimização Contínua');
