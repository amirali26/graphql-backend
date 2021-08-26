// eslint-disable-next-line @typescript-eslint/no-var-requires
const CognitoExpress = require('cognito-express');

import AWS from 'aws-sdk';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import customAuthChecker from './auth/customAuthChecker';
import { IContext } from './models/Context';
import AccountResolver from './resolvers/account';
import AccountPermissionResolver from './resolvers/account-permission';
import UserResolver from './resolvers/user';
import UserAccountResolver from './resolvers/user-accounts';
import UserService from './services/user';
import UserPermissionsService from './services/user-permissions';

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'worldwideandweb' });
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

const cognitoExpress = new CognitoExpress({
  region: "eu-west-1",
  cognitoUserPoolId: "eu-west-1_Bo5l53wSG",
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
    ],
    // automatically create `schema.gql` file with schema definition in current folder
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    authChecker: customAuthChecker,
  });

  app.use((req, res, next) => {
    const accessToken = req.headers.authorization;
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
      };

      next();
    });
  });

  app.use('/graphql', graphqlHTTP((req, res: any) => ({
      schema,
      context: res.locals.user,
      graphiql: true,
  })));

  app.listen(8080);
}

bootstrap();

export default docClient;