import 'reflect-metadata';
import { Arg, Query, Resolver } from 'type-graphql';
import User from '../../models/User';
import UserService, { IUserService } from '../../services/user';

@Resolver(User)
class UserResolver {

  @Query((returns) => User)
  async getUser(@Arg('id') id: string) {
    return await UserService.getUser(id);
  }

  @Query((returns) => [User])
  async getAllUsers() {
    return await UserService.getAllUsers();
  }
}

export default UserResolver;

