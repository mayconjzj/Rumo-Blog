# Rumo — arquitetura da revista científica multidisciplinar

## Decisão de produto

O Rumo passa de blog editorial para revista científica multidisciplinar, com leitura e submissão gratuitas e avaliação por pares. O sistema deve distinguir claramente conteúdo de divulgação/editorial de manuscritos científicos avaliados. A existência do fluxo no site, por si só, não equivale a credenciamento, indexação, DOI ou reconhecimento acadêmico.

## Estado atual do repositório

- Next.js App Router, React e TypeScript.
- Neon/PostgreSQL; acesso aos artigos encapsulado em `lib/server/blog-service.ts` e `lib/server/blog-repository.ts`.
- Artigos existentes em `/artigos/[slug]`, editor administrativo e autenticação de administrador.
- Busca e filtro por categoria na página inicial.
- Sitemap dinâmico e metadados SEO.
- Métricas de visualização via `app/components/PageViewTracker.tsx`, endpoint `app/api/metrics/pageview/route.ts` e painel `/admin/metricas`.
- AdSense configurado no layout. A política da revista deve manter leitura e submissão gratuitas; anúncios não podem interferir no processo editorial.
- A implementação deve estender o projeto, não substituir o site nem apagar os artigos publicados ou as métricas.

## Arquitetura proposta

### Camadas

1. **Apresentação pública** — Next.js Server Components para página inicial, arquivo, áreas científicas, página do artigo e políticas editoriais. A busca deve filtrar título, resumo, autores, palavras-chave e área.
2. **Submissão do autor** — área autenticada para iniciar/editar rascunhos, preencher metadados, informar coautores, declarar ética/conflitos de interesse e enviar versão do manuscrito. Submissão e leitura permanecem gratuitas.
3. **Aplicação editorial** — área privada com fila de triagem, editor responsável, designação de avaliadores, prazos, rodadas de revisão, decisões e histórico auditável. Somente editores autorizados podem ver identidade dos autores quando a avaliação for duplo-cega.
4. **Domínio/serviços** — módulos separados para submissões, revisões, decisões, publicação, taxonomia e notificações. Validar permissões no servidor em toda Server Action/API; esconder links na interface não é autorização.
5. **Persistência** — Neon/PostgreSQL para metadados e estados; armazenamento de objetos privado para PDFs e anexos. Não guardar binários grandes no PostgreSQL nem expor chaves privadas ou URLs permanentes.
6. **Observabilidade** — preservar as métricas existentes; acrescentar eventos editoriais separados das page views. Não enviar conteúdo de manuscritos, nomes de avaliadores ou dados sensíveis às métricas.

### Modelo de avaliação

Recomendação: **avaliação duplo-cega**, se a área científica permitir e as políticas forem consistentes. O manuscrito enviado ao avaliador deve ter identificadores pessoais removidos quando tecnicamente viável. O editor pode acessar a identidade para gerir conflitos e comunicação.

Fluxo: `draft → submitted → technical_check → under_review → revisions_requested ↔ under_review → accepted/rejected → published`. Também permitir `withdrawn`. A decisão editorial é sempre tomada por editor, com base nos pareceres; pareceres não publicam automaticamente um artigo.

Papéis iniciais:
- **Autor**: cria e acompanha apenas suas submissões e revisões solicitadas.
- **Avaliador**: vê somente manuscritos atribuídos, aceita/recusa convite e envia parecer privado.
- **Editor**: faz triagem, seleciona avaliadores, acompanha rodadas e registra decisão fundamentada.
- **Administrador técnico**: gere configuração e contas; acesso a conteúdo editorial deve ser limitado e auditável.

Para o primeiro lançamento, um administrador pode acumular o papel de editor, mas o sistema deve modelar papéis separadamente para permitir expansão. Nunca permitir que o autor escolha ou veja os avaliadores.

## Modelo de dados

A migração inicial proposta em `db/migrations/001_scientific_journal.sql` adiciona tabelas novas, sem alterar ou remover as tabelas atuais:

- `journal_submissions`: título, resumo, idioma, tipo de manuscrito, área, palavras-chave, declarações, status, versão/rodada e datas.
- `submission_authors`: autores e ordem de autoria; contato do autor correspondente.
- `submission_files`: chave privada de armazenamento, tipo, tamanho, hash, versão e classificação do arquivo.
- `review_assignments`: avaliador, convite, prazos, conflito declarado e estado.
- `peer_reviews`: parecer confidencial, recomendação e rodada.
- `editorial_decisions`: decisão e justificativa enviada ao autor.
- `submission_events`: trilha de auditoria de mudanças de estado sem armazenar conteúdo confidencial desnecessário.

A migração é um artefato de código e **não foi executada no banco**. Conferir o esquema existente e fazer backup antes de aplicá-la. Identidade e autorização devem ser integradas à autenticação atual após confirmar a API disponível no ambiente Neon Auth.

## Rotas propostas

Públicas:
- `/` — capa da revista, últimas publicações e áreas científicas.
- `/artigos` — arquivo pesquisável.
- `/artigos/[slug]` — artigo publicado, autores, resumo, palavras-chave, referências, licença, datas editoriais e PDF público.
- `/areas/[slug]` — publicações por área.
- `/sobre`, `/politica-editorial`, `/avaliacao-por-pares`, `/etica-publicacao`, `/privacidade`, `/submissao`.

Privadas:
- `/autor/submissoes`, `/autor/submissoes/nova`, `/autor/submissoes/[id]`.
- `/editorial`, `/editorial/submissoes/[id]`, `/editorial/avaliadores`.
- `/avaliador/convites`, `/avaliador/pareceres/[id]`.

APIs/Server Actions devem validar sessão, papel, propriedade do recurso, CSRF/origem conforme o padrão Next.js adotado, limites de tamanho e MIME real dos arquivos. Arquivos privados devem ser servidos por URLs assinadas de curta duração. PDFs publicados podem ser públicos após a decisão editorial.

## Preservação e migração gradual

1. Manter `/admin/metricas`, o endpoint de page views, o rastreador, a tabela `site_page_views`, SEO, sitemap, comentários e login atuais enquanto são testados.
2. Mapear os artigos existentes como conteúdo editorial legado; não os marcar como artigos científicos revisados por pares retroativamente.
3. Separar futuramente o modelo `blog posts` do modelo `journal submissions`. Só artigos aceitos e publicados entram no arquivo científico e sitemap; páginas institucionais também entram no sitemap.
4. Manter métricas de tráfego agregadas e adicionar indicadores editoriais separados: submissões por estado, tempo de triagem, tempo até primeira decisão, artigos publicados por área. Exibir métricas editoriais apenas a editores autorizados.
5. Fazer migrações aditivas, backup e testes de regressão antes de cada alteração. Não fazer migrações automáticas no build da Vercel.

## Plano de implementação por fases

### Fase 0 — fundação e políticas
- Confirmar o domínio oficial, nome institucional, editor responsável e conselho editorial.
- Publicar escopo, critérios de triagem, tipo de revisão, prazos, apelações, retratações/correções, conflitos de interesse, plágio, autoria, uso de IA, dados e ética em pesquisa.
- Definir licença aberta (por exemplo, Creative Commons adequada ao conteúdo) e direitos autorais com orientação jurídica/institucional.
- Definir identificadores persistentes e estratégia de armazenamento. DOI e indexação não são automáticos.

### Fase 1 — submissão e triagem
- Taxonomia multidisciplinar baseada em áreas/subáreas configuráveis, não numa lista rígida no código.
- Formulário autenticado com autores, afiliações, resumo, palavras-chave, referências, declarações e PDF.
- Rascunho, envio, recibo, validação de tipo/tamanho, estado de triagem e mensagens ao autor.
- Painel editorial com triagem técnica e registro de motivo de devolução.

### Fase 2 — avaliação por pares
- Cadastro/convite de avaliadores, conflito de interesse, atribuições privadas, lembretes, parecer estruturado e recomendação.
- Rodadas de revisão, versões imutáveis de arquivos, decisão do editor e comunicação ao autor.
- Log de auditoria e testes de autorização por papel.

### Fase 3 — publicação científica
- Página bibliográfica completa, PDF público, datas de submissão/aceite/publicação conforme política, licença, citações, referências, autores/ORCID opcional e identificador persistente quando disponível.
- Sitemap/SEO e pesquisa por autor, área, palavra-chave e título.
- Revisar comentários públicos existentes: desativar por padrão nas páginas de artigos científicos ou moderá-los separadamente dos pareceres.

### Fase 4 — operação e qualidade
- Testes de ponta a ponta para submissão, avaliação, revisão, rejeição, aceite, retirada e publicação.
- Testes de acesso: autor não acessa submissões alheias; avaliadores não veem identidade em fluxo duplo-cego; público não acessa manuscritos privados.
- Backup/restauração, política de retenção, monitoramento de erros e limites antiabuso.
- Só depois considerar DOI, ORCID integrado, Crossref, DOAJ ou outros serviços; cada um exige requisitos e/ou acordos próprios.

## Critérios de aceite do primeiro lançamento

- Visitante consegue pesquisar e ler artigos científicos publicados gratuitamente.
- Autor consegue submeter gratuitamente, salvar rascunho e acompanhar o estado.
- Editor consegue fazer triagem, atribuir pelo menos dois avaliadores, registrar decisões e solicitar revisão.
- Avaliador vê apenas os manuscritos atribuídos e envia parecer privado.
- Nenhum manuscrito não publicado fica acessível publicamente.
- As métricas existentes continuam operando e permanecem disponíveis em `/admin/metricas`.
- Testes de build, lint, fluxo editorial e permissões passam; sitemap contém apenas conteúdo público publicado.

## Riscos e limites operacionais

- Revisão por pares real exige editores e avaliadores qualificados; o software não substitui o trabalho editorial.
- Não anunciar indexação, fator de impacto, DOI ou revisão concluída sem comprovação.
- PDFs submetidos são conteúdo não confiável: verificar tipo/tamanho, restringir acesso, considerar antivírus e não renderizar HTML enviado como confiável.
- A implantação na Vercel deve ocorrer após validar o build e confirmar que a cota de deploy está disponível. Um push para GitHub não garante que o site em produção já mudou.
