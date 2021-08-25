/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from "type-graphql";

export interface IUserPermission {
    id: string,
    name: string,
}


@ObjectType()
class UserPermission implements IUserPermission {
    @Field((_type) => ID)
    id!: string;

    @Field((_type) => String)
    name!: string;
}

export default UserPermission;