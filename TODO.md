# TODO - Progresso Urbano

## Correção de Erros
- [x] 1. Analisar código e identificar erros
- [x] 2. Criar rota `/api/auth/recuperar/validar` (endpoint ausente)
- [x] 3. Persistir usuário no login (localStorage) e usar no `/perfil`
- [x] 4. Corrigir JSX do `/master` + adicionar handler de delete
- [x] 5. Adicionar state + handlers no `/novo-requerimento`
- [x] 6. Rodar build para validar

## Painel do Político (dados do banco)
- [x] 7. Criar API `GET/POST /api/issues` (listar e criar requerimentos)
- [x] 8. Criar API `PATCH/GET /api/issues/[id]` (atualizar status e detalhes)
- [x] 9. Criar API `POST /api/issues/[id]/photos` (enviar fotos ao cliente)
- [x] 10. Persistir requerimentos no banco via `/novo-requerimento`
- [x] 11. Redesenhar `/politico` (listar do banco, mudar status, enviar foto)
- [x] 12. Atualizar `/dashboard` (cliente vê status e fotos da gestão)
- [x] 13. Ajustar `database.sql` (status Aguardando/Visto/Concluido)
- [x] 14. Rodar build para validar
