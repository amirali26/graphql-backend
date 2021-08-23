import 'reflect-metadata';
import { Arg, Query, Resolver } from 'type-graphql';
import User from '../../models/User';
import { IUserService } from '../../services/user';

@Resolver(User)
class UserResolver {
  constructor(private userService: IUserService) { }

  @Query((returns) => User)
  async getUser(@Arg('id') id: string) {
    return await this.userService.getUser(id);
  }

  @Query((returns) => User)
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }
}

export default UserResolver;

