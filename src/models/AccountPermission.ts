/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from "type-graphql";

interface IAccountPermission {
    id: string,
    name: string,
}

@ObjectType()
class AccountPermission implements IAccountPermission {
    @Field(_type => ID)
    id!: string;

    @Field(_type => String)
    name!: string;
}

export default AccountPermission;
