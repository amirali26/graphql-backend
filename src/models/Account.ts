/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from 'type-graphql';
import AccountPermission from './AccountPermission';
import User from './User';

export interface IAccount {
    id?: string,
    name: string,
    users: User[],
    permissions: AccountPermission[],
}

@ObjectType()
class Account implements IAccount {
    @Field((_type) => ID)
    id!: string;

    @Field((_type) => String)
    name!: string;

    @Field((_type) => [User])
    users!: User[];

    @Field((_type) => [AccountPermission])
    permissions!: AccountPermission[];
}

export default Account;
