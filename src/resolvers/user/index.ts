import { Resolver } from 'dns';
import { Query } from 'mongoose';
import { Arg } from 'type-graphql';
import User from '../../models/User';
import { IUserService } from '../../services/user';

@Resolver(User)
class UserResolver {
  constructor(private userService: IUserService) { }

  @Query((returns) => User)
  async getUser(@Arg('id') id: string, @Arg('name') name: string) {
    const user = await this.userService.getUser();
  }

  async getAllUsers() {
    const user = await this.userService.getAllUsers();
  }
}
w;
