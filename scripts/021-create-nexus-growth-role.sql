-- Create Nexus Growth role with specific permissions
-- Color: Orange (#F97316)
INSERT INTO roles (name, description, color, is_system) VALUES
  ('Nexus Growth', 'Acesso para equipe Nexus Growth - Dashboard, Clientes, Usuarios, Mapa, Relatorios e Avisos', '#F97316', TRUE)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  is_system = TRUE;

-- Remove existing permissions for Nexus Growth to reset them
DELETE FROM role_permissions 
WHERE role_id = (SELECT id FROM roles WHERE name = 'Nexus Growth');

-- Give Nexus Growth role specific permissions:
-- Dashboard: Ver Dashboard Admin
-- Clientes: Ver, Ver Detalhes (read-only)
-- Usuarios: Ver (read-only)
-- Mapa da Operacao: Ver, Editar
-- Relatorios Semanais: TODAS (criar, editar, enviar, excluir, ver)
-- Avisos: TODAS (enviar, editar, excluir, ver)
-- Configuracoes: Ver
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Nexus Growth' 
  AND p.code IN (
    -- Dashboard - Ver dashboard admin
    'dashboard.view',
    'dashboard.analytics',
    
    -- Clientes - apenas visualizar
    'clients.view',
    'clients.view_details',
    
    -- Usuarios - apenas visualizar
    'users.view',
    
    -- Mapa da Operacao - ver e editar
    'operation_map.view',
    'operation_map.edit',
    
    -- Relatorios Semanais - TODAS as permissoes
    'weekly_reports.view',
    'weekly_reports.create',
    'weekly_reports.edit',
    'weekly_reports.delete',
    
    -- Avisos - TODAS as permissoes
    'notices.view',
    'notices.create',
    'notices.edit',
    'notices.delete',
    
    -- Configuracoes - apenas visualizar
    'settings.view'
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;
