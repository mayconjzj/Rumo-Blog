# Rumo Blog — arquitetura

## Camadas

- **Interface (app/, components/)**: páginas e componentes React. Não acessam o Neon nem executam SQL.
- **Controladores (app/admin/actions.ts)**: Server Actions do Next.js. Verificam a identidade do administrador, traduzem formulários em comandos de aplicação e cuidam de redirects/revalidação de cache.
- **Aplicação/domínio (lib/server/blog-service.ts)**: regras de negócio, normalização de slug, validação do conteúdo e operações de criação, edição, publicação e exclusão.
- **Persistência (lib/server/blog-repository.ts)**: contrato BlogRepository e implementação NeonBlogRepository. Todo SQL e acesso ao Neon ficam nesta camada.
- **Tipos de domínio (lib/blog-types.ts)**: tipos compartilhados, sem dependências de infraestrutura.
- **Fachada de leitura (lib/blogs.ts)**: API de leitura para páginas server-side; delega ao serviço de aplicação.

## Princípios SOLID aplicados

- **S — Responsabilidade única**: páginas cuidam da apresentação, ações cuidam do fluxo, serviço cuida das regras e repositório cuida do banco.
- **O — Aberto/fechado**: uma nova implementação de persistência pode ser adicionada sem reescrever as regras do serviço.
- **L — Substituição de Liskov**: qualquer implementação de BlogRepository deve respeitar o mesmo contrato e semântica.
- **I — Segregação de interfaces**: o contrato do repositório é tipado por operações explícitas do blog, sem expor o cliente SQL à interface.
- **D — Inversão de dependência**: BlogService recebe a abstração BlogRepository; a implementação Neon é injetada no ponto de composição.

## Segurança e limites

- Os módulos de backend usam server-only, impedindo importação acidental para componentes client-side.
- Cada Server Action verifica novamente a sessão e o e-mail permitido pelo ADMIN_EMAIL; ocultar botões na interface não é controle de acesso.
- O conteúdo continua compatível com artigos antigos em texto puro e com o formato estruturado de seções.
- O limite de conteúdo permanece em 50.000 caracteres.
- O projeto ainda não possui uma suíte de testes automatizados; build/lint e os fluxos de CRUD precisam ser verificados após a refatoração.
