/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from 'type-graphql';
import User from './User';

export interface IAccount {
    id?: string,
    name: string,
    users: User[],
}

@ObjectType()
class Account implements IAccount {
    @Field((_type) => ID)
    id!: string;

    @Field((_type) => String)
    name!: string;

    @Field((_type) => [User])
    users!: User[];
}

export default Account;
