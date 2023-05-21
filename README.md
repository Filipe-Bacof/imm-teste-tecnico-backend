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

## Arquitetura Escolhida:
- A arquitetura deste projeto segue o paradigma de Programação Orientada a Objetos (POO) e utiliza um design pattern chamado `Singleton`.
- Nessa abordagem, as classes são projetadas para serem instanciadas apenas uma vez.
- No contexto deste projeto, os `controllers` são responsáveis por lidar com todas as regras de negócio, incluindo o tratamento de dados e a implementação das regras específicas.
- Por outro lado, os `repositories` são responsáveis por realizar as operações de banco de dados, focando exclusivamente na manipulação dos dados.
- É importante destacar que um repository **nunca** deve realizar tratamento de erros ou outras ações além da interação com o banco de dados.

## Explicando as Tabelas:
- A estrutura de dados que foi implementada proporciona uma maior flexibilidade ao sistema.
- Em vez de ter tipos de usuários predefinidos, é possível criar `perfis` personalizados e atribuí-los aos `usuários`.
- Da mesma forma, as `categorias` podem listar quais `perfis` têm acesso às `aulas` relacionadas.
- Essa abordagem torna o sistema mais versátil e profissional, permitindo que o `Product Owner` adapte a estrutura de acordo com suas necessidades e compreensão.
- **Isso oferece maior autonomia, controle e segurança ao Product Owner.**

## Tabelas do Banco:
```
USERS
  - _id: Gerado pelo mongoDB;
  - name: Nome do usuário;
  - email: Email para login;
  - password: Senha para login;
  - picture_url: URL de uma imagem para exibir no front;
  - profile: Referencia a tabela de perfil, só pode ter 1 perfil no usuário;
  - favorites: todas as aulas favoritadas pelo usuário;
```
```
PROFILES
  - _id: Gerado pelo mongoDB;
  - title: Identificador do perfil;
  - permissions (enum): Array com as permissões pré-definidas com os CRUDS;
```
```
CLASSES
  - _id: Gerado pelo mongoDB;
  - title: Titulo da aula;
  - class_url: URL do vídeo do youtube de uma aula;
  - available: Se a aula está disponível;
  - description: Descrição da aula;
  - creator_user_id: Usuário que disponibilizou essa aula no sistema;
  - category: Categoria da aula (pode ser 1 ou mais)
```
```
CATEGORIES
  - _id: Gerado pelo mongoDB;
  - title: Identificador da categoria;
  - available_profiles: Para quais perfís essa categoria é visível;
```
## ENUM PERMISSIONS
- Contém todos os CRUDS, para que apenas usuários autorizados possam efetuar as operações que lhe forem atribuidas, isso garante uma forma dinâmica para arquitetar o front-end;

## Criação de Usuário
- Mantive a rota de criação de usuário "desprotegida", para qualquer um poder criar um, como é no facebook por exemplo, dependendo da regra de negócio, são poucas alterações necessárias para adaptar, por exemplo, se for uma pessoa de determinado cargo que possa criar os usuários apenas;

## Testando a API no postman
- Basta Substituir a URL do tópico abaixo pelo seu localhost caso esteja rodando no seu dispositivo, ou substituir a variável {{URL}} dentro do postman pelo link da API publicada no Railway, mais abaixo fornecerei mais informações.
- Na pasta raiz do projeto você encontrará um JSON chamado `"IMM Desafio Técnico Backend.postman_collection"`, este arquivo você pode importar no `Postman` para efetuar as requisições.

## Todos os EndPoints:
- `URL/` = rota GET apenas para testar, no navegador ela exibe "Essa é uma rota de teste! A API está funcionando"
- `URL/auth/register`
  - POST para cadastrar um novo usuário
- `URL/auth/login`
  - POST para fazer login com um usuário cadastrado
- `URL/users`
  - endpoint padrão para o CRUD de usuários
- `URL/profile`
  - endpoint padrão para o CRUD de perfís
- `URL/category`
  - endpoint padrão para o CRUD de categorias
- `URL/class`
  - endpoint padrão para o CRUD de aulas
- `URL/class/favorites`
  - endpoint padrão para o listagem de aulas favoritas e para favoritar

## Favoritos
- Todos os usuários possuem um array de favoritos
- O endpoint `URL/class/favorite/<IDAULA>?user=<IDUSUARIO>` adiciona a aula dentro desse array

## Por que URLs de vídeos do YouTube:
- Geralmente, é recomendado utilizar um serviço externo para o armazenamento de vídeos ou fotos, em vez de guardar as mídias dentro do próprio servidor. Existem algumas razões para isso. Primeiro, o armazenamento de mídias dentro do servidor pode ocupar muito espaço em disco, o que pode resultar em custos adicionais de armazenamento e afetar o desempenho do servidor. Além disso, o armazenamento de mídias em um serviço externo oferece maior escalabilidade, flexibilidade e redundância de dados.
- No caso deste projeto, optei por armazenar apenas os dados no MongoDB, que é um banco de dados não relacional eficiente e adequado para esse propósito. O armazenamento das mídias em um serviço de armazenamento em nuvem, como o Amazon S3 ou o Google Cloud Storage, é uma abordagem comum. Dessa forma, as mídias são armazenadas de forma segura e podem ser acessadas facilmente por meio de URLs.
- Ao utilizar URLs do YouTube, o front-end pode disponibilizar os vídeos de forma eficiente, sem a necessidade de armazenar os arquivos de vídeo localmente. Isso reduz a carga no servidor e permite que o YouTube lide com a entrega do conteúdo de maneira otimizada.
- Mesmo assim, se você preferir fazer o armazenamento das mídias no próprio servidor, uma abordagem comum é criar uma pasta chamada "uploads" (ou outro nome apropriado) onde as mídias seriam armazenadas. Dentro dessa pasta, as mídias podem ser organizadas em subpastas de acordo com as categorias. Por exemplo, cada categoria pode ter sua própria subpasta para armazenar as mídias relacionadas. Para fazer o upload das mídias para o servidor, é comum utilizar o formato multipart/form-data para enviar os arquivos por meio de formulários.
- No entanto, é importante considerar os prós e contras de armazenar mídias no servidor versus utilizar um serviço externo, como mencionado anteriormente. A escolha depende das necessidades específicas do projeto, considerando fatores como escalabilidade, custos, desempenho e segurança.
- É importante ressaltar que o armazenamento de mídias em um serviço externo é uma prática recomendada, especialmente para projetos de médio a grande porte, onde a gestão eficiente de mídias é essencial.

## Hospedagem:
- [Ver site do Railway](https://railway.app/)
- Eu escolhi implantar a API usando o Railway, que oferece um plano gratuito bastante generoso, disponibilizando 500 horas gratuitas de uso por mês.
- Nesta situação, onde o objetivo principal é testar e avaliar a API, optar pelo plano gratuito oferecido pelo Railway parece ser a melhor escolha. Isso nos permite explorar e avaliar a funcionalidade e o desempenho da API sem incorrer em custos significativos.
- URL da Hospedagem: [Abrir App](https://imm-teste-tecnico-backend.up.railway.app/)
- Como 