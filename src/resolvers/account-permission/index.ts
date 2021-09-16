import { Arg, Mutation, Resolver } from "type-graphql";
import AddAccountPermissionInput from "../../inputs/account-permissions";
import AccountPermission from "../../models/AccountPermission";
import AccountPermissionService from "../../services/account-permissions";

@Resolver(() => AccountPermission)
class AccountPermissionResolver {
    @Mutation(() => AccountPermission)
    async addAccountPermissions(@Arg('accountPermission') newAccountPermission: AddAccountPermissionInput) {
        try {
            const response = await AccountPermissionService.addAccountPermission(newAccountPermission.name);
        
            return {
                id: response.id,
                name: response.name,
            }
        } catch(e) {
        }
    }
}

export default AccountPermissionResolver;