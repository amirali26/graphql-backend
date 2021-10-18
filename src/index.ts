import { ApolloServer } from 'apollo-server-express';
import AWS from 'aws-sdk';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import path from 'path';
import 'reflect-metadata';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { buildSchema } from 'type-graphql';
import customAuthChecker from './auth/customAuthChecker';
import AccountResolver from './resolvers/account';
import AccountPermissionResolver from './resolvers/account-permission';
import AreasOfPracticeResolver from './resolvers/areas-of-practice';
import RequestSubmissionResolver from './resolvers/request-submission';
import UserResolver from './resolvers/user';
import UserAccountResolver from './resolvers/user-accounts';
import UserService from './services/user';
import UserPermissionsService from './services/user-permissions';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CognitoExpress = require('cognito-express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');


AWS.config.credentials = new AWS.SharedIniFileCredentials();
// AWS.config.credentials = new AWS.ECSCredentials();
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });

const cognitoExpress = new CognitoExpress({
  region: "eu-west-1",
  cognitoUserPoolId: "eu-west-1_8xuHVtmN3",
  tokenUse: "access",
  tokenExpiration: 3600000
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
      AreasOfPracticeResolver,
    ],
    // automatically create `schema.gql` file with schema definition in current folder
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    authChecker: customAuthChecker,
  });

  app.use(cors());

  app.use((req, res, next) => {
    const accountId = req.headers.accountid;
    const accessToken = req.headers.authorization;
    // const accessToken = 'eyJraWQiOiJWREI1STJ3VExKaklcL2N6T2FmUmp4M1wvbXVYYTl1UFJZNDZySEVzOENBZ3M9IiwiYWxnIjoiUlMyNTYifQ.eyJvcmlnaW5fanRpIjoiNmVlMzBhZjUtZDBhOC00NzU5LWI2NTctY2ExMzIxN2Y5NTdlIiwic3ViIjoiOWVjZTkzMTEtMDU1OC00M2E1LWI0NGEtNjNjMTA5NzQ2OTcwIiwiZXZlbnRfaWQiOiI5MTA4ZmRkYi00YjBkLTQzZTgtYTNiMC1mNThmMTFkNzc1ODIiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjM0NDg5NjE0LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV84eHVIVnRtTjMiLCJleHAiOjE2MzQ1NzM3ODEsImlhdCI6MTYzNDU3MDE4MSwianRpIjoiMmYzN2ZmZDYtNjIyYi00NjU1LTgyN2EtMzRjODZlY2RmNDQ0IiwiY2xpZW50X2lkIjoiNW91Y200c2o5dTFqZGhiZDVpNnNsMGxtb2YiLCJ1c2VybmFtZSI6IjllY2U5MzExLTA1NTgtNDNhNS1iNDRhLTYzYzEwOTc0Njk3MCJ9.jIdq9il7XMOdEAtuo1A80_j3NX2kq6W8YVpQGv-nRruUHlHRvGPXpFVd5qrgwIAP8rfLFgZ26bJ-59BctrKSMa_UYw5mAPwpJBkoxpE1BITmeMbiZbp6RlItr8HCmhylnPleBxvMDFp5e6b30tk5I2POLJ2DjKs1Trpiv90tFTnv2jPSe1P9ZW_O6PN_LEf5FdzZWTz1BY1osWTIncTTUMb0TZYEnPTG2KctJ_woraWhd0ikHcUFIVuvRDnFvRTNQ74SU9KPnPykknosMxRu5jHVOsuoa_AJbmIg3TCgH6slhyn3Or5H2W1IaA7dEbEpWBGo9Oo-Ak8nCNSPB15qxw';
    if (!accessToken) return res.status(401).send('Access token not present');

    cognitoExpress.validate(accessToken, async function (err: unknown, response: Record<any, any>) {
      //If API is not authenticated, Return 401 with error message. 
      if (err) return res.status(401).send(err);

      //Else API has been authenticated. Proceed.
      const user = await UserService.getUser(response.sub);
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

  const apolloServer = new ApolloServer({ 
    schema: schema,
    context: ({ req, res }) => res.locals.user
   });

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