/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import Account from '../../models/Account';
import User from '../../models/User';
import AccountService from '../../services/account';
import AccountPermissionService from '../../services/account-permissions';
import UserService from '../../services/user';
import UserAccountService from '../../services/user-accounts';

@Resolver(of => Account)
class AccountResolver {

    @FieldResolver()
    async users(@Root() account: Account) {
        try {
            const users = [];
            const results = await UserAccountService.getAllUsersByAccountId(account.id);
            for (let i = 0; i <= results.length - 1; i++) {
                const userEntity = await UserService.getUser(results[i].userId);
                users.push(userEntity);
            }
            
            return users;
        } catch (e) {
            console.log(e.message);
        }
    }

    @FieldResolver()
    async permissions(@Root() account: Account) {
        try {
            const permissions = [];

            const accountEntity = await AccountService.getAccount(account.id);
            if (!accountEntity) throw Error(`No account found with the id: ${account.id}`);

            for(let i = 0; i <= accountEntity.permissions.length - 1; i++) {
                const permission = await AccountPermissionService.getAccountPermissionsById(accountEntity.permissions[i]);
                if (!permission) throw Error(`Unable to find permission with id: ${accountEntity.permissions[i]}`);

                permissions.push(permission);
            }

            return permissions;
        } catch(e) {
            console.log(e.message);
        }
    }

    @Query((returns) => Account)
    async account(@Arg('accountId') accountId: string) {
        try {
            return await AccountService.getAccount(accountId);
        } catch (e) {
            console.log(e.message);
        }
    }
}

export default AccountResolver;
