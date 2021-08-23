import { Resolver } from 'dns';
import { Query } from 'mongoose';
import { Arg } from 'type-graphql';
import User from '../../models/User';
import { IUserService } from '../../services/user';

@Resolver(User)
class UserResolver {
  constructor(private userService: IUserService) {}

    @Query((returns) => User)
  async user(@Arg('id') id: string, name: string) {
    const user = await this.userService.getAllUsers({
      id,
      name,
    });
  }
}
