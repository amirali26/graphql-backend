import express from 'express';
import AWS from 'aws-sdk';
import { graphqlHTTP } from 'express-graphql';
import UserResolver from './resolvers/user';
import { buildSchema } from 'type-graphql';
import path from 'path';

const docClient = new AWS.DynamoDB.DocumentClient();
async function bootstrap() {
  
  const app = express();
  
  const schema = await buildSchema({
    resolvers: [UserResolver],
    // automatically create `schema.gql` file with schema definition in current folder
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
  });

  app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
  }));
  
  app.listen(8080);
}  

bootstrap();

export default docClient;