# Rumo — implementação funcional inicial

## Entregas nesta etapa
- Página inicial reposicionada como revista científica multidisciplinar, com links para arquivo e submissões.
- Formulário público coleta título, resumo, área, tipo, palavras-chave, referências, autores, declarações editoriais e PDF de até 4 MB.
- API valida campos e assinatura inicial do PDF e grava submissão e autores no Neon.
- Recibo de submissão com identificador UUID.
- Painel privado `/admin/submissoes` para triagem, mudança de estado, convite de avaliadores, leitura dos pareceres e abertura protegida do PDF.
- Portal `/avaliador` lista convites vinculados ao e-mail autenticado; o avaliador envia parecer privado em `/avaliador/pareceres/[id]`.
- Arquivo público `/pesquisas` e página individual; PDFs só se tornam públicos quando o editor registra estado `published` após `accepted`.
- Sitemap inclui páginas públicas e publicações científicas. O rastreamento de page views e painel de métricas foram preservados.

## Configuração de banco obrigatória
Aplicar, em ordem, `db/migrations/001_scientific_journal.sql` e `db/migrations/002_manuscript_upload.sql` ao banco Neon configurado em `DATABASE_URL`. A primeira cria tabelas editoriais e a segunda adiciona armazenamento privado de PDFs. As migrações são aditivas e não substituem as tabelas do blog nem as métricas.

## Limites desta entrega
- A autenticação reutiliza Neon Auth. O administrador é identificado por `ADMIN_EMAIL`; avaliadores precisam ter sessão autenticada com o mesmo e-mail atribuído pelo editor.
- O sistema não envia e-mails automaticamente. Após atribuir avaliador, a equipe editorial deve enviar o link `/avaliador` manualmente.
- PDFs são armazenados em `BYTEA` no Neon para evitar dependência externa nesta entrega. Para volume maior, migrar para armazenamento privado de objetos.
- A avaliação duplo-cega depende de os autores removerem identificadores do PDF; a interface instrui, mas não anonimiza automaticamente.
- Antes de abrir submissões ao público, aplicar as migrações e testar com submissão fictícia, avaliador e conta administrativa.
- DOI, indexação e reconhecimento acadêmico não são alegados nem atribuídos automaticamente.
