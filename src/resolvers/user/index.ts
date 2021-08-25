/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'reflect-metadata';
import { Arg, FieldResolver, InputType, Query, Resolver, Root } from 'type-graphql';
import { IAccountEntity } from '../../entities/AccountEntity';
import User from '../../models/User';
import AccountService from '../../services/account';
import UserService from '../../services/user';
import UserAccountService from '../../services/user-accounts';
import UserPermissionsService from '../../services/user-permissions';

@Resolver(of => User)
class UserResolver {
  @FieldResolver()
  async accounts(@Root() user: User) {
    try {
      const accounts: IAccountEntity[] = [];
      const results = await UserAccountService.getAllAccountsByUserId(user.id);

      for(let i = 0; i <= results.length - 1; i++) {
        const account = await AccountService.getAccount(results[i].accountId);
        if (!account) throw Error(`Error finding account with id: ${results[i].accountId}`);

        accounts.push(account);
      }

      return accounts;
    } catch (e) {
      console.log(e.message);
    }
  }

  @FieldResolver()
  async permissions(@Root() user: User) {
    try {
      const permissions = [];

      const userEntity = await UserService.getUser(user.id);
      if (!userEntity) throw Error(`Cannot find user with the id: ${user.id}`);

      for(let i = 0; i <= userEntity.permissions.length - 1; i++) {
        const permission = UserPermissionsService.getPermissionById(userEntity.permissions[i]);
        permissions.push(permission);
      }

      return permissions;
    } catch(e) {
      console.log(e.message);
    }
  }

  @Query((returns) => User)
  async user(@Arg('userId') userId: string) {
    return await UserService.getUser(userId);
  }

  @InputType()
  
}

export default UserResolver;

