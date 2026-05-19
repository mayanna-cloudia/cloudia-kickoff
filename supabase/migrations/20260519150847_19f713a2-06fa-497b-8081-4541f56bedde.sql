
-- Phase 1: Cloudia Hub - Tracker de Alterações

create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  medico_contato text,
  especialidade text,
  data_inicio date,
  vendedor text,
  gerente text,
  configurador text,
  plano text,
  mensalidade numeric,
  num_usuarios int,
  vencimento_dia int,
  forma_pagamento text,
  pipedrive_lead_id text,
  status text not null default 'ativo',
  criado_em timestamptz not null default now()
);

create table public.alteracoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  configurador text not null,
  tipo text not null check (tipo in ('texto','fluxo','perguntas','tecnica')),
  tamanho text not null check (tamanho in ('pequena','media','grande')),
  fase text not null check (fase in ('pre_treino','pos_treino','pos_golive')),
  origem text not null check (origem in ('whatsapp','email','reuniao','outro')),
  descricao text,
  criado_em timestamptz not null default now()
);

create index alteracoes_cliente_id_idx on public.alteracoes(cliente_id);
create index alteracoes_criado_em_idx on public.alteracoes(criado_em desc);

create table public.settings (
  id uuid primary key default gen_random_uuid(),
  alteracoes_inclusas int,
  atualizado_em timestamptz not null default now()
);

insert into public.settings (alteracoes_inclusas) values (null);

-- RLS: authenticated team members have full access (internal tool)
alter table public.clientes enable row level security;
alter table public.alteracoes enable row level security;
alter table public.settings enable row level security;

create policy "team read clientes" on public.clientes for select to authenticated using (true);
create policy "team write clientes" on public.clientes for insert to authenticated with check (true);
create policy "team update clientes" on public.clientes for update to authenticated using (true);
create policy "team delete clientes" on public.clientes for delete to authenticated using (true);

create policy "team read alteracoes" on public.alteracoes for select to authenticated using (true);
create policy "team write alteracoes" on public.alteracoes for insert to authenticated with check (true);
create policy "team update alteracoes" on public.alteracoes for update to authenticated using (true);
create policy "team delete alteracoes" on public.alteracoes for delete to authenticated using (true);

create policy "team read settings" on public.settings for select to authenticated using (true);
create policy "team update settings" on public.settings for update to authenticated using (true);
