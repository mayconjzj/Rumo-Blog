# Revista Rumo — arquitetura do projeto

## Camadas

- **Interface (app/ e componentes React):** páginas, componentes visuais, formulários e estados de interface.
- **Controladores (rotas de API e Server Actions):** recebem requisições, verificam identidade e permissão, chamam serviços e traduzem resultados em respostas HTTP ou redirecionamentos.
- **Serviços de aplicação (lib/server/):** regras de negócio, validação de comandos e coordenação de fluxos de submissão, avaliação e publicação.
- **Persistência (módulos *repository*):** consultas SQL e acesso ao Neon. Páginas não devem executar SQL diretamente.
- **Autenticação (lib/auth/):** configuração compartilhada do Neon Auth para cliente e servidor.
- **Tipos de domínio:** contratos explícitos entre camadas, sem dependência de infraestrutura quando possível.

## Diretrizes SOLID

- **Responsabilidade única:** cada módulo tem um motivo principal para mudar. A interface não deve executar consultas SQL nem decidir regras editoriais.
- **Aberto/fechado:** novas implementações de persistência devem ser possíveis sem reescrever regras de aplicação.
- **Substituição de Liskov:** implementações alternativas devem manter a semântica dos contratos.
- **Segregação de interfaces:** consumidores dependem apenas das operações que utilizam.
- **Inversão de dependência:** regras de aplicação não devem depender de detalhes de conexão ou de componentes visuais.

## Segurança

- Módulos exclusivos do servidor usam `server-only`.
- Operações administrativas verificam a sessão e comparam o e-mail normalizado com `ADMIN_EMAIL` no servidor.
- PDFs não publicados só podem ser obtidos por administradores ou avaliadores autorizados.
- Validação no cliente melhora a experiência, mas nunca substitui a validação no servidor.
- Mudanças de estado editorial e seus eventos de auditoria devem ser persistidos na mesma instrução SQL para evitar divergência entre estado e histórico.

## Verificação

Execute `npm run check` para ESLint e verificação de tipos. Execute `npm run format:check` para verificar a formatação e `npm run format` para aplicar o padrão configurado. Execute `npm run build` separadamente com as variáveis de ambiente configuradas. A formatação do repositório inteiro ainda é uma etapa pendente desta refatoração; não considere o resultado de `format:check` garantido antes dessa etapa.

A refatoração é incremental. Não marque uma etapa como concluída até que os comandos de qualidade e os fluxos funcionais relevantes tenham sido executados com sucesso.
