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
  <img alt="Railway" height="70" width="70" src="https://railway.app/brand/logo-light.png" />
</div>

- Techs: NodeJS, Express, JavaScript, MongoDB, Mongoose, JsonWebToken, Nodemon, Eslint, Railway;
- Desenvolvido nos dias 19, 20 e 21 de Maio de 2023;
- [Ver Portifólio Filipe Bacof](https://portifolio-filipe-bacof.vercel.app/);

## Arquitetura Escolhida:
- A arquitetura deste projeto segue o paradigma de Programação Orientada a Objetos (POO) e utiliza um design pattern chamado `Singleton`.
- Nessa abordagem, as classes são projetadas para serem instanciadas apenas uma vez.
- No contexto deste projeto, os `controllers` são responsáveis por lidar com todas as regras de negócio, incluindo o tratamento de dados e a implementação das regras específicas.
- Por outro lado, os `repositories` são responsáveis por realizar as operações de banco de dados, focando exclusivamente na manipulação dos dados.
- É importante destacar que um repository **nunca** deve realizar tratamento de erros ou outras ações além da interação com o banco de dados.

## Explicando estrutura do Banco de Dados:
- A estrutura de dados que foi implementada proporciona uma maior flexibilidade ao sistema.
- Em vez de ter tipos de usuários predefinidos, é possível criar `perfis` personalizados e atribuí-los aos `usuários`.
- Da mesma forma, as `categorias` podem listar quais `perfis` têm acesso às `aulas` relacionadas.
- Essa abordagem torna o sistema mais versátil e profissional, permitindo que o `Product Owner` adapte a estrutura de acordo com suas necessidades e compreensão.
- **Isso oferece maior autonomia, controle e segurança ao Product Owner.**

## Tabelas do Banco (Collections):
<table>
  <tr>
    <th>USERS</th>
    <th>PROFILES</th>
    <th>CLASSES</th>
    <th>CATEGORIES</th>
  </tr>
  <tr>
    <td>_id: Gerado pelo mongoDB;</td>
    <td>_id: Gerado pelo mongoDB;</td>
    <td>_id: Gerado pelo mongoDB;</td>
    <td>_id: Gerado pelo mongoDB;</td>
  </tr>
  <tr>
    <td>name: Nome do usuário;</td>
    <td>title: Identificador do perfil;</td>
    <td>title: Titulo da aula;</td>
    <td>title: Identificador da categoria;</td>
  </tr>
  <tr>
    <td>email: Email para login;</td>
    <td>permissions (enum): Array com as permissões pré-definidas com os CRUDS;</td>
    <td>class_url: URL do vídeo do youtube de uma aula;</td>
    <td>available_profiles: Para quais perfís essa categoria é visível;</td>
  </tr>
  <tr>
    <td>password: Senha para login;</td>
    <td></td>
    <td>available: Se a aula está disponível;</td>
    <td></td>
  </tr>
  <tr>
    <td>picture_url: URL de uma imagem para exibir no front;</td>
    <td></td>
    <td>description: Descrição da aula;</td>
    <td></td>
  </tr>
  <tr>
    <td>profile: Referencia a tabela de perfil, só pode ter 1 perfil no usuário;</td>
    <td></td>
    <td>creator_user_id: Usuário que disponibilizou essa aula no sistema;</td>
    <td></td>
  </tr>
  <tr>
    <td>favorites: todas as aulas favoritadas pelo usuário;</td>
    <td></td>
    <td>category: Categoria da aula (pode ser 1 ou mais);</td>
    <td></td>
  </tr>
</table>

## Banco de Dados MongoDB
- No MongoDB, as tabelas são chamadas de coleções, já que se trata de um banco de dados não relacional.
- Essa estrutura de documento fornecida pelo MongoDB é perfeita para trabalhar com JavaScript, pois os dados retornados são naturalmente convertidos em objetos JavaScript.
- Ao executar uma consulta, o MongoDB retorna um JSON contendo os dados, facilitando a manipulação e utilização dessas informações em aplicações JavaScript.
- Diferentemente dos bancos de dados relacionais, como o SQL, onde precisamos fazer joins entre tabelas para obter informações relacionadas, no MongoDB utilizamos o conceito de "populate" para buscar dados relacionados.
- O "populate" permite buscar informações adicionais em outras coleções com base em referências entre documentos. Essa abordagem simplifica o acesso a dados relacionados e evita a necessidade de fazer joins complexos.
- Essas características tornam o MongoDB uma escolha popular para desenvolvedores que trabalham com JavaScript e desejam um banco de dados flexível e escalável.

## ENUM PERMISSIONS
- Contém todos os CRUDS, para que apenas usuários autorizados possam efetuar as operações que lhe forem atribuidas, isso garante uma forma dinâmica para arquitetar o front-end;
- Se você quer adicionar mais permissões, altere no arquivo enum/Permissions.js e utilize estas permissões para efetuar as validações na sua aplicação front-end;

## Criação de Usuário
- Mantive a rota de criação de usuário "desprotegida", para qualquer pessoa conseguir criar uma conta, como é no facebook por exemplo;
- Dependendo da regra de negócio, são poucas as alterações necessárias para adaptar, por exemplo, se for uma pessoa de determinado cargo que possa criar os usuários apenas;

## Testando a API no Postman
- Na pasta raiz do projeto você encontrará um JSON chamado `"IMM Desafio Técnico Backend.postman_collection"`, você pode utilizar ele da seguinte forma no `Postman`:
  - Abra o Postman;
  - No canto superior esquerdo da interface do Postman, clique em "Importar";
  - Na janela de importação, selecione a opção "Arquivo" e escolha o JSON disponibilizado;
  - Clique em "Importar" para importar a coleção no Postman;
  - Após a importação, você verá a coleção "IMM Desafio Técnico Backend" na barra lateral do Postman;
  - Agora você poderá efetuar as requisições que eu configurei para a API;

## Todos os EndPoints:
- `URL/`
  - Rota GET apenas para testar, no navegador ela exibe "Essa é uma rota de teste! A API está funcionando";
- `URL/auth/register`
  - POST para cadastrar um novo usuário;
- `URL/auth/login`
  - POST para fazer login com um usuário cadastrado;
- `URL/users`
  - Endpoint padrão para o CRUD de usuários;
- `URL/profile`
  - Endpoint padrão para o CRUD de perfís;
- `URL/category`
  - Endpoint padrão para o CRUD de categorias;
- `URL/class`
  - Endpoint padrão para o CRUD de aulas;
- `URL/class/favorites`
  - Endpoint padrão para o listagem de aulas favoritas e para favoritar;

## Favoritos
- Todos os usuários possuem um array de favoritos;
- O endpoint `URL/class/favorite/<IDAULA>?user=<IDUSUARIO>` adiciona a aula dentro desse array;

## Hospedagem:
- [Ver site do Railway](https://railway.app/)
- Eu escolhi implantar a API usando o Railway, que oferece um plano gratuito bastante generoso, disponibilizando 500 horas gratuitas de uso por mês;
- Nesta situação, onde o objetivo principal é testar e avaliar a API, optar pelo plano gratuito oferecido pelo Railway parece ser a melhor escolha. Isso nos permite explorar e avaliar a funcionalidade e o desempenho da API sem incorrer em custos significativos;
- URL da Hospedagem: [Abrir App](https://imm-teste-tecnico-backend.up.railway.app/);
- O Railway oferece integração contínua e implantação contínua (CI/CD), o que significa que qualquer atualização feita neste repositório será refletida automaticamente na aplicação que está online. Isso facilita o processo de implantação e garante que a versão mais recente do código seja sempre executada na aplicação em produção;
- Com a integração contínua, é possível automatizar o processo de construção, testes e empacotamento do aplicativo. Isso garante que cada alteração de código seja testada e validada antes de ser implantada. Em seguida, a implantação contínua permite que as atualizações sejam distribuídas de forma rápida e eficiente, sem a necessidade de intervenção manual;
- Essa funcionalidade do Railway torna o processo de atualização da aplicação mais ágil e confiável. Com cada alteração de código, você pode ter a tranquilidade de que a aplicação online será atualizada automaticamente, mantendo-a sempre alinhada com as últimas alterações feitas no repositório. Isso facilita o desenvolvimento iterativo e permite que você implemente rapidamente novos recursos e correções de bugs;

## Informações Importantes:
- A fim de garantir o funcionamento correto do projeto, é necessário configurar as variáveis de ambiente. Essas configurações permitirão que a aplicação estabeleça conexão com o banco de dados e realize a autenticação de usuários usando JWT (JSON Web Tokens), entre outras funcionalidades.
- Se você deseja testar a aplicação que hospedei, fique tranquilo, as variáveis já estão configuradas para você. No entanto, se preferir executar a aplicação localmente, posso fornecer as variáveis necessárias. Sinta-se à vontade para entrar em contato comigo para receber essas informações.

## Por que URLs de vídeos do YouTube:
- Geralmente, é recomendado utilizar um serviço externo para o armazenamento de vídeos ou fotos, em vez de guardar as mídias dentro do próprio servidor. Existem algumas razões para isso. Primeiro, o armazenamento de mídias dentro do servidor pode ocupar muito espaço em disco, o que pode resultar em custos adicionais de armazenamento e afetar o desempenho do servidor. Além disso, o armazenamento de mídias em um serviço externo oferece maior escalabilidade, flexibilidade e redundância de dados;
- No caso deste projeto, optei por armazenar apenas os dados no MongoDB, que é um banco de dados não relacional eficiente e adequado para esse propósito. O armazenamento das mídias em um serviço de armazenamento em nuvem, como o Amazon S3 ou o Google Cloud Storage, é uma abordagem comum. Dessa forma, as mídias são armazenadas de forma segura e podem ser acessadas facilmente por meio de URLs;
- Ao utilizar URLs do YouTube, o front-end pode disponibilizar os vídeos de forma eficiente, sem a necessidade de armazenar os arquivos de vídeo localmente. Isso reduz a carga no servidor e permite que o YouTube lide com a entrega do conteúdo de maneira otimizada;
- Mesmo assim, se você preferir fazer o armazenamento das mídias no próprio servidor, uma abordagem comum é criar uma pasta chamada "uploads" (ou outro nome apropriado) onde as mídias seriam armazenadas. Dentro dessa pasta, as mídias podem ser organizadas em subpastas de acordo com as categorias. Por exemplo, cada categoria pode ter sua própria subpasta para armazenar as mídias relacionadas. Para fazer o upload das mídias para o servidor, é comum utilizar o formato multipart/form-data para enviar os arquivos por meio de formulários;
- No entanto, é importante considerar os prós e contras de armazenar mídias no servidor versus utilizar um serviço externo, como mencionado anteriormente. A escolha depende das necessidades específicas do projeto, considerando fatores como escalabilidade, custos, desempenho e segurança;
- É importante ressaltar que o armazenamento de mídias em um serviço externo é uma prática recomendada, especialmente para projetos de médio a grande porte, onde a gestão eficiente de mídias é essencial;
