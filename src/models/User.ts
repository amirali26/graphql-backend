/* eslint-disable no-unused-vars */
import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';

interface UserType {
    id: string,
    name: string,
    accounts: string[],
}

@ObjectType()
class User implements UserType {
    @Field((type) => ID)
    id!: string;

    @Field((type) => String)
    name!: string;

    @Field((type) => [String], { nullable: true })
    accounts!: string[];
}

export default User;
