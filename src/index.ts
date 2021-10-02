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
    ],
    // automatically create `schema.gql` file with schema definition in current folder
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    authChecker: customAuthChecker,
  });

  app.use(cors());

  app.use((req, res, next) => {
    const accountId = req.headers.accountid;
    const accessToken = req.headers.authorization;
    // const accessToken = 'eyJraWQiOiJWREI1STJ3VExKaklcL2N6T2FmUmp4M1wvbXVYYTl1UFJZNDZySEVzOENBZ3M9IiwiYWxnIjoiUlMyNTYifQ.eyJvcmlnaW5fanRpIjoiODdkZWVkMjctY2FhNS00OTA2LWI4MmItMjY4OTQyMzMyNzA3Iiwic3ViIjoiOWVjZTkzMTEtMDU1OC00M2E1LWI0NGEtNjNjMTA5NzQ2OTcwIiwiZXZlbnRfaWQiOiI3MDBiNjU0OS03YmZkLTQ1ZjktOTljYy01YzU4ZDk0OWEzNTEiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNjMxNzg3MTc0LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuZXUtd2VzdC0xLmFtYXpvbmF3cy5jb21cL2V1LXdlc3QtMV84eHVIVnRtTjMiLCJleHAiOjE2MzI2Njg4NDgsImlhdCI6MTYzMjY2NTI0OCwianRpIjoiOWQwOGU2ZmYtNWJhNi00YTYzLWE4MjUtZDgwYTQzZTU1NWRjIiwiY2xpZW50X2lkIjoiNW91Y200c2o5dTFqZGhiZDVpNnNsMGxtb2YiLCJ1c2VybmFtZSI6IjllY2U5MzExLTA1NTgtNDNhNS1iNDRhLTYzYzEwOTc0Njk3MCJ9.epileANKXyUJ1scd34625JOQkWCKvKvQ03g88zCRRR-TE-l30RnJDRdlxVkAU58kG9sjONdSmpctmFoxAHVpd0KsAIM2YcRv-mYo4oiI4AWwvuc_fLQ6H_8bypyT6jP111aAAWo5-HUnYhXkn4oKSgmY9EgHLOadWFOIOuLYv47Ut1pa6DcyYFnZJyyYG6AsTkgf2xdXH0pP7HsIThEJhT467_vHyrZa6z3_DCEFKdvpmcKL1wpyL-qirfgsdAyIJSKaMsV_bPo9onS8ISUn3VEXKXEFlqdFAkwDI6Mub2vxzkiT9rs12y1pqM7Hig9ts0Py-mDCEKbMR8boeSYKWw';
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