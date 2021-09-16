// eslint-disable-next-line @typescript-eslint/no-var-requires
const CognitoExpress = require('cognito-express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');

import { ApolloServer } from 'apollo-server-express';
import AWS from 'aws-sdk';
import express from 'express';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { execute, subscribe } from 'graphql';
import customAuthChecker from './auth/customAuthChecker';
import AccountResolver from './resolvers/account';
import AccountPermissionResolver from './resolvers/account-permission';
import RequestSubmissionResolver from './resolvers/request-submission';
import UserResolver from './resolvers/user';
import UserAccountResolver from './resolvers/user-accounts';
import UserService from './services/user';
import UserPermissionsService from './services/user-permissions';
import http from 'http';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'worldwideandweb' });
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

const cognitoExpress = new CognitoExpress({
  region: "eu-west-1",
  cognitoUserPoolId: "eu-west-1_8xuHVtmN3",
  tokenUse: "access", //Possible Values: access | id
  tokenExpiration: 3600000 //Up to default expiration of 1 hour (3600000 ms)
});

async function bootstrap() {
  const app = express();
  
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      UserAccountResolver,
      AccountResolver,
      AccountPermissionResolver,
      RequestSubmissionResolver,
    ],
    // automatically create `schema.gql` file with schema definition in current folder
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    authChecker: customAuthChecker,
  });

  app.use(cors());

  app.use((req, res, next) => {
    const accountId = req.headers.accountid;
    const accessToken = '';
    if (!accessToken) return res.status(401).send('Access token not present');

    cognitoExpress.validate(accessToken, async function (err: unknown, response: Record<any, any>) {
      //If API is not authenticated, Return 401 with error message. 
      if (err) return res.status(401).send(err);

      //Else API has been authenticated. Proceed.
      const user = await UserService.getUser(response.sub);
      if (!user) return res.status(404).send('Unable to find profile of logged in user');
      const permissions: string[] = [];
      for(let i = 0; i <= user.permissions.length - 1; i++) {
        const permission = await UserPermissionsService.getPermissionById(user.permissions[i]);
        if (!permission) return res.status(404).send('Unable to find associated permission of logged in user');
        permissions.push(permission.name);

      }
      res.locals.user = {
        subId: user.id,
        name: user.name,
        permissions: permissions,
        username: response.username,
        accountId,
      };

      next();
    });
  });

  const apolloServer = new ApolloServer({ schema: schema });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });
  const server = createServer(app);

  server.listen(8080, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema: schema,
    }, {
      server: server,
      path: '/graphql',
    });
  });

}

bootstrap();

export default docClient;