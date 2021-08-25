import { Field, InputType } from "type-graphql";
import UserAccount from "../../models/UserAccount"

@InputType()
class AddUserAccountInput implements Partial<UserAccount> {
    @Field(() => String)
    userId!: string;

    @Field(() => String)
    accountId!: string;
}

export default AddUserAccountInput;
