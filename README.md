# TESTE TÉCNICO: Programador(a) Back-End
<div style="justify-content: space-around;">
  <img alt="NODE.JS" height="70" width="70" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" />
  <img alt="Express" height="70" width="70" src="https://www.svgrepo.com/show/330398/express.svg" />
  <img alt="JS" height="70" width="70" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" />
  <img alt="MongoDB" height="70" width="70" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" />
  <img alt="Mongoose" height="70" width="70" src="https://cdn.worldvectorlogo.com/logos/mongoose-1.svg" />
  <img alt="JWT" height="70" width="70" src="https://seeklogo.com/images/J/json-web-tokens-jwt-io-logo-C003DEC47A-seeklogo.com.png" />
  <img alt="Nodemon" height="70" width="70" src="https://seeklogo.com/images/N/nodemon-logo-9F66F45AB1-seeklogo.com.png" />
  <img alt="EsLint" height="70" width="70" src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/ESLint_logo.svg/1200px-ESLint_logo.svg.png" />
</div>

- Techs: NodeJS, Express, JavaScript, MongoDB, Mongoose, JsonWebToken, Nodemon, Eslint
- [Ver Portifólio Filipe Bacof](https://portifolio-filipe-bacof.vercel.app/)


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
