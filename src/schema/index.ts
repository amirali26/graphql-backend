import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})

export default schema;