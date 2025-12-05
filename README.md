# Mercadim

O Mercadim é uma aplicação web desenvolvida para permitir que microempresas e pequenos negócios realizem a gestão de vendas e estoque de forma simples, eficiente e segura.

## Visão Geral

O sistema disponibiliza uma interface web para login, gerenciamento de produtos, controle de estoque, realização de vendas, visualização de relatórios e administração de perfil e configurações. Foi projetado para pequenos negócios que necessitam de uma solução prática para controle interno, sem depender de sistemas complexos.

## Funcionalidades Principais

- Autenticação de usuário via e-mail e senha (login/logout)
- Dashboard com dados sobre vendas recentes e acesso às demais páginas
- Módulo de vendas com carrinho, registro de vendas e atualização automática de estoque
- Módulo de estoque com funcionalidades de CRUD (criar, ler, atualizar e excluir produtos)
- Tela de suporte com contato, envio de feedback e acesso aos termos de serviço
- Configurações do usuário (tema e notificações push)
- Página de perfil com alteração de nome, e-mail, senha e foto

## Tecnologias Utilizadas

- Node.js
- Next.js (Frontend e API Routes)
- Firebase (Firestore e Authentication)
- Demais ferramentas e dependências utilizadas no desenvolvimento

## Estrutura do Projeto

- /src — código-fonte da aplicação
- /public — arquivos públicos
- .env.example — exemplo de variáveis de ambiente
- next.config.ts, tsconfig.json — arquivos de configuração do projeto

## Como Rodar Localmente

1. Clone o repositório:
   git clone https://github.com/MeuComercio2025-2/Mercadim

2. Copie o arquivo .env.example para .env.local e configure as credenciais do Firebase.

3. Instale as dependências:
   npm install

4. Inicie o servidor de desenvolvimento:
   npm run dev

5. Acesse http://localhost:3000 no navegador.

## Deploy / Produção

O projeto está disponível em https://mercadim.pedrooaj.cloud, deploy feito utilizando Vercel.

## Como Contribuir

1. Faça um fork deste repositório
2. Crie uma branch para sua funcionalidade ou correção
3. Commit suas alterações com uma mensagem clara
4. Abra um Pull Request

## Equipe / Autores

- Arthur Wagner de Carvalho Gondim Lemos (arthur-niar)
- Pedro Antônio Mendes Lemos (Pedrooaj
- Pedro Cauã Graciano Girão Nobre (pcauanobre)
- Gustavo Cardoso de Melo (GustavoCardosoDevv)

- Supervisora: Profª. Cynthia Moreira, ME

## Licença

Este projeto está licenciado sob a Licença MIT. 
