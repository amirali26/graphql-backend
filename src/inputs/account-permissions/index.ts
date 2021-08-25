import { Field, InputType } from "type-graphql";
import AccountPermission from "../../models/AccountPermission";

@InputType()
class AddAccountPermissionInput implements Partial<AccountPermission> {
    @Field(() => String)
    name!: string;
}

export default AddAccountPermissionInput;
