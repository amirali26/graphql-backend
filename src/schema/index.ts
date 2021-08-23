import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import Account from '../models/account';
import User from "../models/user";

const AccountType: any = new GraphQLObjectType({
    name: "Account",
    description: "The account model",
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
            }
        }
    })
});

const x = new Graphql

const UserType: any = new GraphQLObjectType({
    name: 'User',
    description: 'The user model',
    fields: () => ({
        id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        age: {
            type: GraphQLInt
        },
        account: {
            type: AccountType,
            resolve(parent, args) {
            }
        }
    })
});

export const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    description: "The root query which allows access to the front-end to query everything",
    fields: {
        account: {
            type: AccountType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
            },

        },
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parents, args) {
            },
        },
        accounts: {
            type: new GraphQLList(AccountType),
            description: 'Return all accounts',
            resolve(parent, args) {
            }
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'Return all users',
            resolve(parent, args) {
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        addAccount: {
            type: AccountType,
            args: {
                name: {
                    type: GraphQLString
                },
            },
            resolve(parent, args) {
                let author = new Account({
                    name: args.name
                });

                return author.save();
            }
        },
        addUser: {
            type: UserType,
            args: {
                name: {
                    type: GraphQLString
                }
            },
            resolve(parent, args) {
                const user = new User({
                    name: args.name
                })

                return user.save();
            },
        }
    }
});

const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
})

export default schema;