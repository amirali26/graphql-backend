/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import AddAccountInput from '../../inputs/account';
import Account from '../../models/Account';
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
        }
    }

    @FieldResolver()
    async createdBy(@Root() account: Account, @Ctx() ctx: any) {
        return await UserService.getUser(ctx.subId);
    }

    @FieldResolver()
    async permissions(@Root() account: Account) {
        try {
            const permissions = [];

            const accountEntity = await AccountService.getAccount(account.id);
            if (!accountEntity) throw Error(`No account found with the id: ${account.id}`);

            for (let i = 0; i <= accountEntity.permissions.length - 1; i++) {
                const permission = await AccountPermissionService.getAccountPermissionsById(accountEntity.permissions[i]);
                if (!permission) throw Error(`Unable to find permission with id: ${accountEntity.permissions[i]}`);

                permissions.push(permission);
            }

            return permissions;
        } catch (e) {
        }
    }

    @Query((returns) => Account)
    async account(@Arg('accountId') accountId: string) {
        try {
            return await AccountService.getAccount(accountId);
        } catch (e) {
        }
    }

    @Mutation((returns) => Account)
    async addAccount(@Arg('account') newAccount: AddAccountInput, @Ctx() ctx: any) {
        try {
            const result = await AccountService.addAccount(
                newAccount.name, ctx.subId, newAccount.permissionIds || []
            );

            UserAccountService.addNewUserAccount(ctx.subId, result.id);
            if (newAccount.usersIds?.length) {
                Promise.all(newAccount.usersIds.map((uid) => UserAccountService.addNewUserAccount(uid, result.id)));
            }

            console.log(result.createdDate);

            return {
                id: result.id,
                name: result.name,
                createdDate: result.createdDate
            };
        } catch (e) {
        }
    }
}

export default AccountResolver;
