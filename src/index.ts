import express from 'express';
import AWS from 'aws-sdk';
import { graphqlHTTP } from 'express-graphql';
import schema, { RootQuery } from './schema';

const docClient = new AWS.DynamoDB.DocumentClient();

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: RootQuery,
  graphiql: true,
}));

app.listen(8080);

export default docClient;
