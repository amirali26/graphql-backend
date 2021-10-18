/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, InputType } from "type-graphql";
import Account from "../../models/Account";

@InputType()
class AddAccountInput implements Partial<Account> {
    @Field(() => ID)
    name!: string;

    @Field(() => [String])
    areasOfPracticeIds!: string[];

    @Field(() => Boolean)
    receiveEmails!: boolean;

    @Field(() => [String], { nullable: true })
    usersIds?: string[];

    @Field(() => [String], { nullable: true })
    permissionIds?: string[];
}

export default AddAccountInput;
