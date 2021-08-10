# Skills API

* [Prerequisites](#prerequisites)
* [Configuration](#configuration)
* [Local deployment](#local-deployment)
* [Migrations](#migrations)
* [Local Deployment with Docker](#local-deployment-with-docker)
* [NPM Commands](#npm-commands)
* [JWT Authentication](#jwt-authentication)
* [Documentation](#documentation)

## Prerequisites

- node 12.x+
- npm 6.x+
- docker
- elasticsearch 7.7+
- PostgreSQL

## Configuration

Configuration for the application is at `config/default.js` and `config/production.js`. The following parameters can be set in config files or in env variables:

- `LOG_LEVEL`: the log level
- `PORT`: the server port
- `AUTH_SECRET`: TC Authentication secret
- `VALID_ISSUERS`: valid issuers for TC authentication
- `PAGE_SIZE`: the default pagination limit
- `MAX_PAGE_SIZE`: the maximum pagination size
- `API_VERSION`: the API version
- `DB_NAME`: the database name
- `DB_USERNAME`: the database username
- `DB_PASSWORD`: the database password
- `DB_HOST`: the database host
- `DB_PORT`: the database port
- `ES_HOST`: Elasticsearch host
- `ES_REFRESH`: Should elastic search refresh. Default is 'true'. Values can be 'true', 'wait_for', 'false'
- `ELASTICCLOUD_ID`: The elastic cloud id, if your elasticsearch instance is hosted on elastic cloud. DO NOT provide a value for ES_HOST if you are using this
- `ELASTICCLOUD_USERNAME`: The elastic cloud username for basic authentication. Provide this only if your elasticsearch instance is hosted on elastic cloud
- `ELASTICCLOUD_PASSWORD`: The elastic cloud password for basic authentication. Provide this only if your elasticsearch instance is hosted on elastic cloud
- `ES`.DOCUMENTS: Elasticsearch index, type and id mapping for resources.
- `SKILL_INDEX`: The Elastic search index for skill. Default is `skill`
- `TAXONOMY_INDEX`: The Elastic search index for taxonomy. Default is `taxonomy`
- `MAX_BATCH_SIZE`: Restrict number of records in memory during bulk insert (Used by the db to es migration script)
- `MAX_BULK_SIZE`: The Bulk Indexing Maximum Limits. Default is `100` (Used by the db to es migration script)

- `AUTH0_URL`: Auth0 URL, used to get TC M2M token
- `AUTH0_AUDIENCE`: Auth0 audience, used to get TC M2M token
- `TOKEN_CACHE_TIME`: Auth0 token cache time, used to get TC M2M token
- `AUTH0_CLIENT_ID`: Auth0 client id, used to get TC M2M token
- `AUTH0_CLIENT_SECRET`: Auth0 client secret, used to get TC M2M token
- `AUTH0_PROXY_SERVER_URL`: Proxy Auth0 URL, used to get TC M2M token

- `BUSAPI_URL`: Topcoder Bus API URL
- `KAFKA_ERROR_TOPIC`: The error topic at which bus api will publish any errors
- `KAFKA_MESSAGE_ORIGINATOR`: The originator value for the kafka messages
- `SKILLS_ERROR_TOPIC`: Kafka topic for report operation error

**NOTE** AUTH0 related configuration normally is shared on challenge forum.

## DB and Elasticsearch In Docker
- Navigate to the directory `docker-pgsql-es` folder. Rename `sample.env` to `.env` and change any values if required.
- Run `docker-compose up -d` to have docker instances of pgsql and elasticsearch to use with the api

**NOTE** To completely restart the services, run `docker-compose down --volumes` and then `docker-compose up`.
Notice the `--volumes` argument is passed to the `docker-compose down` command to remove the volume that stores DB data. Without the `--volumes` argument the DB data will be persistent after the services are put down.

## Local deployment

Setup your Postgresql DB and Elasticsearch instance and ensure that they are up and running.

- Follow *Configuration* section to update config values, like database, ES host etc ..
- Goto *skills-api*, run `npm i`
- Create database using `npm run create-db`.
- Run the migrations - `npm run migrations up`. This will create the tables.
- Then run `npm run insert-data` and insert mock data into the database.
- Run `npm run migrate-db-to-es` to sync data with ES.
- Startup server `npm run start:dev`

## Migrations

Migrations are located under the `./scripts/db/` folder. Run `npm run migrations up` and `npm run migrations down` to execute the migrations or remove the earlier ones

## Local Deployment with Docker
Setup your Postgresql DB and Elasticsearch instance and ensure that they are up and running.

- Configure AUTH0 related parameters via ENV variables. Note that normally you don't need to change other configuration.
- Create database using `npm run create-db`.
- Run the migrations - `npm run migrations up`. This will create the tables.
- Then run `npm run insert-data` and insert mock data into the database.
- Run `npm run migrate-db-to-es` to sync data with ES.

- Navigate to the directory `docker`

- Rename the file `sample.env` to `.env`

- Set the required DB configurations and ElasticSearch host in the file `.env`

- Once that is done, run the following command

    ```bash
    docker-compose up
    ```

- When you are running the application for the first time, It will take some time initially to download the image and install the dependencies

## NPM Commands

| Command&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|--------------------|--|
| `npm run start`  | Start app |
| `npm run start:dev`  | Start app on any changes (useful during development). |
| `npm run lint`     | Check for for lint errors. |
| `npm run lint:fix` | Check for for lint errors and fix error automatically when possible. |
| `npm run create-db`    | Create the database |
| `npm run insert-data`    | Insert data into the database |
| `npm run migrate-db-to-es`    | Migrate data into elastic search from database |
| `npm run delete-data`  | Delete the data from the database |
| `npm run migrations up`  | Run up migration |
| `npm run migrations down`  | Run down migration |
| `npm run generate:doc:permissions` | Generate [permissions.html](docs/permissions.html) |
| `npm run generate:doc:permissions:dev` | Generate [permissions.html](docs/permissions.html) on any changes (useful during development). |

## JWT Authentication
Authentication is handled via Authorization (Bearer) token header field. Token is a JWT token.

Here is a sample user token that is valid for a very long time for a user with administrator role.

```
<provide_in_forums>

# here is the payload data decoded from the token
{
  "roles": [
    "Topcoder User",
    "administrator"
  ],
  "iss": "https://api.topcoder.com",
  "handle": "tc-Admin",
  "exp": 1685571460,
  "userId": "23166768",
  "iat": 1585570860,
  "email": "tc-Admin@gmail.com",
  "jti": "0f1ef1d3-2b33-4900-bb43-48f2285f9630"
}
```

and this is a sample M2M token with scopes `all:connect_project`, `all:projects` and `write:projects`.

```
<provided_in_forums>

# here is the payload data decoded from the token
{
  "iss": "https://topcoder-dev.auth0.com/",
  "sub": "enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients",
  "aud": "https://m2m.topcoder-dev.com/",
  "iat": 1550906388,
  "exp": 2147483648,
  "azp": "enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B",
  "scope": "all:connect_project all:projects write:projects",
  "gty": "client-credentials"
}
```

These tokens have been signed with the secret `CLIENT_SECRET`. This secret should match the `AUTH_SECRET` entry in `config/default.js`. You can modify the payload of these tokens to generate tokens with different roles or different scopes using https://jwt.io

**Note** Please check with `src/constants.js` for all available user roles and M2M scopes.

## Documentation

- [permissions.html](docs/permissions.html) - the list of all permissions in Skills API.
- [swagger.yaml](docs/swagger.yaml) - the Swagger API Definition.
