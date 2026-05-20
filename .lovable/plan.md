# Editor de Fluxo Visual — Cloudia Kickoff

Vou implementar na ordem que você pediu, com checkpoint antes de cada etapa.

## Etapa 1 — Banco de dados

Criar tabela `public.fluxos_robo` exatamente como especificado:
- colunas: `id`, `cliente_id` (FK clientes ON DELETE CASCADE), `variacao` (check: `chatgpt` | `integracao` | `chatgpt_integracao`), `nodes` jsonb, `edges` jsonb, `atualizado_em`
- unique `(cliente_id, variacao)` pra suportar upsert
- RLS habilitado + 4 policies pra `authenticated` (read/insert/update/delete, todas `true`) — consistente com o padrão das outras tabelas do projeto

**Checkpoint: confirmo com você antes de seguir.**

## Etapa 2 — Fluxos padrão

Instalar `@xyflow/react` e criar `src/lib/fluxos-padrao.ts`:
- exporta `FLUXOS_PADRAO: Record<'chatgpt' | 'integracao' | 'chatgpt_integracao', { nodes, edges }>`
- 5–7 nós por variação seguindo a estrutura que você descreveu, com posições já calculadas (layout vertical) e `type` customizado
- também exporta `TIPOS_NO` com os 7 tipos + cor/label para a sidebar

**Checkpoint.**

## Etapa 3 — Tela de edição `/clientes/$id/fluxos`

Arquivo `src/routes/clientes.$id.fluxos.tsx` dentro do `AuthGate` + `AppShell`:
- header com nome do cliente, botão voltar, indicador "Salvo" (reusa padrão de `useAutoSave`)
- `Tabs` (shadcn) com as 3 variações; ao trocar de aba, carrega o registro do banco ou usa o padrão
- canvas `ReactFlow` ocupando o restante da tela:
  - sidebar esquerda (drawer no mobile) com 7 nós arrastáveis coloridos
  - drag-from-sidebar → `onDrop` cria nó na posição
  - nó customizado (`FluxoNode`): cor por tipo, título em negrito editável por duplo clique, descrição editável, botão X no canto ao selecionar
  - `Background`, `Controls`, `MiniMap`
  - botão "Restaurar padrão" no topo da aba (com confirmação)
- auto-save 800ms via `useAutoSave` → `upsert` em `fluxos_robo` por `(cliente_id, variacao)`
- pontos de entrada: nova coluna "Fluxos" na lista `/clientes` (ícone Workflow) + botão "Editar fluxos" no header do `/kickoffs/$id`

**Checkpoint.**

## Etapa 4 — Integração read-only no Passo 7

Em `src/components/kickoff/steps.tsx`, dentro de `Passo7DemoAoVivo`, **abaixo** das colunas existentes (sem mexer em `DEMOS_INICIAIS`):
- nova seção "Fluxo do robô" (título oculto em `modoApresentacao`)
- carrega fluxo da `variacao_demo` atual do cliente (fallback pro padrão)
- `ReactFlow` com `nodesDraggable={false}`, `nodesConnectable={false}`, `elementsSelectable={false}`, `panOnDrag`, `zoomOnScroll`
- altura `h-[400px] md:h-[700px]`
- recarrega quando `data.variacao_demo` muda

## Design

- Nós: rounded-xl, borda 1px, shadow-sm, w-[200px], paleta clara conforme spec, usando tokens existentes onde possível
- Cores específicas por tipo adicionadas como classes utilitárias inline (são acentos funcionais, não tokens semânticos do tema)

## Notas técnicas

- `@xyflow/react` é compatível com Vite/SSR (já usado em projetos TanStack)
- Importar CSS via `import '@xyflow/react/dist/style.css'` no arquivo da rota e no Passo 7
- Upsert: `supabase.from('fluxos_robo').upsert({...}, { onConflict: 'cliente_id,variacao' })`

Confirma que posso começar pela **Etapa 1 (migration)**?