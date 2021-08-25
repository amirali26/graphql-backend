import { Field, ObjectType } from "type-graphql";

interface IUserAccount {
    userId: string,
    accountId: string,
}

@ObjectType()
class UserAccount implements IUserAccount {
    @Field(() => String)
    userId!: string;

    @Field(() => String)
    accountId!: string;
}

export default UserAccount;
