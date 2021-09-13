// eslint-disable-next-line @typescript-eslint/no-var-requires
const CognitoExpress = require('cognito-express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');

import { execute, subscribe } from 'graphql';
import AWS from 'aws-sdk';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { createServer } from 'http';
import path from 'path';
import 'reflect-metadata';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { buildSchema } from 'type-graphql';
import customAuthChecker from './auth/customAuthChecker';
import AccountResolver from './resolvers/account';
import AccountPermissionResolver from './resolvers/account-permission';
import UserResolver from './resolvers/user';
import UserAccountResolver from './resolvers/user-accounts';
import UserService from './services/user';
import UserPermissionsService from './services/user-permissions';
import RequestSubmissionResolver from './resolvers/request-submission';
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
    // const accessToken = req.headers.authorization;
    const accessToken = 'eyJraWQiOiJWREI1STJ3VExKaklcL2N6T2FmUmp4M1wvbXVYYTl1UFJZNDZySEVzOENBZ3M9IiwiYWxnIjoiUlMyNTYifQ.eyJvcmlnaW5fanRpIjoiNDkzMzJmN2YtZmM4Ni00ODk5LThlZjktM2QxMDRmY2EyZTA5Iiwic3ViIjoiOWVjZTkzMTEtMDU1OC00M2E1LWI0NGEtNjNjMTA5NzQ2OTcwIiwiZXZlbnRfaWQiOiJmMzJmODI5OC0yNWRiLTRiNzUtYTliOC0zYWYyODFmZWJhNGEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjMxMzcwODQ1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV84eHVIVnRtTjMiLCJleHAiOjE2MzE1NzIxMTksImlhdCI6MTYzMTU2ODUxOSwianRpIjoiM2VlZjY4OWYtYzE4Yi00MGZhLTk4N2UtMzFiOTk2ZmU1MmIwIiwiY2xpZW50X2lkIjoiNW91Y200c2o5dTFqZGhiZDVpNnNsMGxtb2YiLCJ1c2VybmFtZSI6IjllY2U5MzExLTA1NTgtNDNhNS1iNDRhLTYzYzEwOTc0Njk3MCJ9.oBnydYFhqCcpBlTkgrLTeoLM7RpDUw_wejEB-UEjwZWW-0OVfd1LCnwR9W-vrTt4o8lAddpgfjjvRV5D62TLb86D2If6ALMph2-yV5c2Sotble-1Up28m4tk-TswiXAwNlw1SPxISAiacsHTVDWZB-400i62W6m-ZPUrNpffYERhSJsNSSDuc4_KisaPYNGfnyYlJZG3vT_ZX8theUPQ6XvjT46V7H9Hd4wIvwJAufP1eNxwkcP9zlSD1FRQbx4iR8WfJnJd9H8GK9b_vBQGONLonqhO4L4Id_hV_X0Ch00-vgi3r3B4esfHZKgGRGfLh0yRpt6YrvgOBENJ71OplA';
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

  app.use('/graphql', graphqlHTTP((req, res: any) => ({
      schema,
      context: res.locals.user,
      graphiql: true,
  })));

  const ws = createServer(app);
  ws.listen(8080, () => {
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: '/subscriptions',
    }
    )
  });
}

bootstrap();

export default docClient;