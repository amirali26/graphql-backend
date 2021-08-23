import { v4 as uuidv4 } from 'uuid';
import docClient from '../..';
import User from '../../models/User';

export interface IUserService {
    addUser: (user: User) => Promise<User>,
    getAllUsers: () => Promise<User[]>,
    // updateUser: () => User,
    // removeUser: () => void,
}

class UserService implements IUserService {
    private tableName = 'HandleMyCaseDynamoTables-userProfiles870EDB81-VFZOMKP9623E';

    public getAllUsers = async (): Promise<User[]> => {
      const result = await docClient.query({
        TableName: this.tableName,
        IndexName: 'id',
      }).promise();

      if (!result.Items?.length) {
        throw Error('There was an issue retrieving your users');
      }

      return result.Items as User[];
    };

    public addUser = async (user: User): Promise<User> => {
      const userId = uuidv4();
      const result = await docClient.put({
        TableName: this.tableName,
        Item: {
          id: { S: userId },
          accountId: { S: '1' },
        },
      }).promise();

      if (result.$response.error) {
        throw Error(result.$response.error.message);
      }

      return { ...user, id: userId };
    };

  // public updateUser = () => User;

  // public removeUser = () => { };
}

export default UserService;
