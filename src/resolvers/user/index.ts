/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'reflect-metadata';
import { Arg, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { IAccountEntity } from '../../entities/AccountEntity';
import User from '../../models/User';
import AccountService from '../../services/account';
import UserService from '../../services/user';
import UserAccountService from '../../services/user-accounts';

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

      console.log(accounts);
      return accounts;
    } catch (e) {
      console.log(e.message);
    }
  }

  @FieldResolver()
  async permissions(@Root() user: User) {
    try {
      const permissions = [];
      const results = await 
    } catch(e) {
      console.log(e.message);
    }
  }

  @Query((returns) => User)
  async user(@Arg('userId') userId: string) {
    return await UserService.getUser(userId);
  }
}

export default UserResolver;

