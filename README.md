## Descrição

Benchmark do Prisma

## Instalação e configuração

```bash
$ npm install
```

Para configurar um banco de dados é possível utilizar o _docker-compose_ e subir o arquivo encontrado em
`./docker/postgres.yaml`.

```bash
$ docker-compose -f docker/postgres.yaml up -d
```

Caso optar por usar outro banco ou mudar a configuração do arquivo `./docker/postgres.yaml` será necessário alterar
também a URL de conexão com o banco de dados localizada no arquivo `.env` na raiz do projeto.

Quando o banco estiver rodando, execute o comando abaixo para gerar as tabelas

```bash
$ npx prisma migrate dev --name init
```

## Rodando a aplicação

```bash
$ npm start
```
