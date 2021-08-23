import { GraphQLSchema } from 'graphql';

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});

export default schema;
