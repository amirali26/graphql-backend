/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'reflect-metadata';
import { Arg, Args, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import AddAccountInput from '../../inputs/account';
import Account from '../../models/Account';
import AreasOfPractice from '../../models/AreasOfPractice';
import AccountService from '../../services/account';
import AccountPermissionService from '../../services/account-permissions';
import AreasOfPracticeService from '../../services/areas-of-practice';
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
        } catch (e: any) {
            throw Error(e.message);
        }
    }

    @FieldResolver()
    async areasOfPractices(@Root() account: Account) {
        return Promise.all(account.areasOfPractices.map(aop => AreasOfPracticeService.getArea(aop as unknown as string)));
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

            for (let i = 0; i <= accountEntity.permissions.length - 1; i++) {
                const permission = await AccountPermissionService.getAccountPermissionsById(accountEntity.permissions[i]);
                if (!permission) throw Error(`Unable to find permission with id: ${accountEntity.permissions[i]}`);

                permissions.push(permission);
            }

            return permissions;
        } catch (e: any) {
            throw Error(e.message);
        }
    }

    @Query((returns) => Account)
    async account(@Arg('accountId') accountId: string) {
        try {
            return await AccountService.getAccount(accountId);
        } catch (e: any) {
            throw e.message;
        }
    }

    @Mutation((returns) => Account)
    async addAccount(@Arg('account') newAccount: AddAccountInput, @Ctx() ctx: any) {
        try {
            const result = await AccountService.addAccount(
                newAccount.name,
                ctx.subId, newAccount.permissionIds || [],
                newAccount.receiveEmails,
                newAccount.areasOfPracticeIds
            );

            UserAccountService.addNewUserAccount(ctx.subId, result.id);
            Promise.all(newAccount.areasOfPracticeIds.map((id) => AreasOfPracticeService.getArea(id)));
            if (newAccount.usersIds?.length) {
                Promise.all(newAccount.usersIds.map((uid) => UserAccountService.addNewUserAccount(uid, result.id)));
            }

            return {
                id: result.id,
                name: result.name,
                createdDate: result.createdDate
            };
        } catch (e: any) {
            throw Error(e.message);
        }
    }
}

export default AccountResolver;
