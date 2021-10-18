/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from 'type-graphql';
import Account from './Account';
import UserPermission from './UserPermission';

interface IUser {
    id?: string,
    name: string,
    email: string,
    phoneNumber: string,
    birthDate: string,
    accounts: Account[],
    permissions: UserPermission[],
}

@ObjectType()
class User implements IUser {
    @Field((_type) => ID)
    id!: string;

    @Field((_type) => String)
    name!: string;

    @Field((_type) => String)
    phoneNumber!: string;

    @Field((_type) => String)
    email!: string;

    @Field((_type) => String)
    birthDate!: string;

    @Field((_type) => [Account])
    accounts!: Account[];

    @Field((_type) => [UserPermission])
    permissions!: UserPermission[]
}

export default User;
