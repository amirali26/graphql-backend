/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from 'type-graphql';
import AccountPermission from './AccountPermission';
import AreasOfPractice from './AreasOfPractice';
import User from './User';

export interface IAccount {
    id?: string,
    name: string,
    createdBy: User,
    users: User[],
    permissions: AccountPermission[],
    areasOfPractice: AreasOfPractice[],
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

    @Field((_type) => User)
    createdBy!: User;

    @Field((_type) => String)
    createdDate!: string;

    @Field((_type) => [AreasOfPractice])
    areasOfPractice!: AreasOfPractice[]
}

export default Account;
