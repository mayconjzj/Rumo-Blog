# Revista Rumo

Aplicação web da Revista Rumo, construída com Next.js App Router, React, TypeScript e Neon Auth/Database.

## Requisitos

- Node.js 20.9 ou superior.
- Variáveis de ambiente de autenticação e banco configuradas para executar os fluxos protegidos.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Verificações de qualidade

```bash
npm run check
npm run build
```

## Organização

- `app/`: páginas, componentes, Server Actions e controladores de API do Next.js.
- `lib/auth/`: configuração de autenticação.
- `lib/server/`: regras de aplicação e acesso a dados exclusivo do servidor.
- `db/migrations/`: migrações SQL incrementais.
- `docs/ARCHITECTURE.md`: camadas, princípios de arquitetura e diretrizes de segurança.

Revise e aplique migrações de forma controlada no banco correto. Não execute migrações em produção sem confirmar o ambiente e o impacto.
