# TESTE TÉCNICO: Programador(a) Back-End

- [Ver Portifólio Filipe Bacof](https://portifolio-filipe-bacof.vercel.app/)

- Banco de dados utilizado: MongoDB
<img alt="MongoDB" height="50" width="50" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" />

## Tabelas do Banco:
- `USERS`
  - _id: Gerado pelo mongoDB;
  - name: Nome do usuário;
  - email: Email para login;
  - password: Senha para login;
  - picture_url: URL de uma imagem para exibir no front;
  - profile: Referencia a tabela de perfil, só pode ter 1 perfil no usuário;
  - favorites: todas as aulas favoritadas pelo usuário;

- `PROFILES`
  - _id: Gerado pelo mongoDB;
  - title: Identificador do perfil;
  - permissions (enum): Array com as permissões pré-definidas com os CRUDS;

- `CLASSES`
  - _id: Gerado pelo mongoDB;
  - title: Titulo da aula;
  - class_url: URL do vídeo do youtube de uma aula;
  - available: Se a aula está disponível;
  - description: Descrição da aula;
  - creator_user_id: Usuário que disponibilizou essa aula no sistema;
  - category: Categoria da aula (pode ser 1 ou mais)
  
- `CATEGORIES`
  - _id: Gerado pelo mongoDB;
  - title: Identificador da categoria;
  - available_profiles: Para quais perfís essa categoria é visível;

### ENUM PERMISSIONS
- Contém todos os CRUDS, para que apenas usuários autorizados possam efetuar as operações que lhe forem atribuidas, isso garante uma forma dinâmica para arquitetar o front-end;

## Criação de Usuário
- Mantive a rota de criação de usuário "desprotegida", para qualquer um poder criar um, como é no facebook por exemplo, dependendo da regra de negócio, são poucas alterações necessárias para adaptar, por exemplo, se for uma pessoa de determinado cargo que possa criar os usuários apenas;