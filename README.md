# Rumo Blog

Página inicial do Rumo Blog construída com Next.js App Router, React e TypeScript.

## Executar localmente

Requisitos: Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Estrutura

- `app/page.tsx`: composição da página inicial e componentes de apresentação.
- `app/layout.tsx`: layout raiz e metadados.
- `app/globals.css`: identidade visual responsiva e estilos globais.

## Organização

A página separa a apresentação de artigos em componentes pequenos e usa um tipo `Article` para manter a estrutura dos dados consistente. Os artigos atuais são exemplos estáticos; o próximo passo é conectá-los a uma fonte persistente e ao painel administrativo.

## Nota sobre a identidade visual

O visual usa uma linguagem institucional do setor financeiro — azul-marinho, branco, detalhes dourados e tipografia sóbria — sem reproduzir logotipos ou elementos proprietários do BTG Pactual.
