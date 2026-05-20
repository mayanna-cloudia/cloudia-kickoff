create table public.fluxos_robo (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  variacao text not null check (variacao in ('chatgpt','integracao','chatgpt_integracao')),
  nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  atualizado_em timestamptz not null default now(),
  unique (cliente_id, variacao)
);

alter table public.fluxos_robo enable row level security;

create policy "team read fluxos" on public.fluxos_robo for select to authenticated using (true);
create policy "team write fluxos" on public.fluxos_robo for insert to authenticated with check (true);
create policy "team update fluxos" on public.fluxos_robo for update to authenticated using (true);
create policy "team delete fluxos" on public.fluxos_robo for delete to authenticated using (true);