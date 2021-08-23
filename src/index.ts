import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { connect, connection } from 'mongoose';
import schema, { RootQuery } from './schema';

const app = express();

connect('mongodb+srv://admin:admin@cluster0.ymz3w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
connection.once('open', () => {
	console.log('connection successful');
})

app.use('/graphql', graphqlHTTP({
	schema: schema,
	rootValue: RootQuery,
	graphiql: true,
}));

app.listen(8080);

console.log('Running server mate :)');