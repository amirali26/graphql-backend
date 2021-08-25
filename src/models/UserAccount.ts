import { Field } from "type-graphql";

interface IUserAccount {
    userId: string,
    accountId: string,
}

class UserAccount implements IUserAccount {
    @Field(() => String)
    userId!: string;

    @Field(() => String)
    accountId!: string;
}

export default UserAccount;
