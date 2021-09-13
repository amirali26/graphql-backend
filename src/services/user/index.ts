import docClient from '../..';
import { IUserEntity } from '../../entities/UserEntity';
class UserService {
  private static tableName = 'HandleMyCaseDynamoTables-userProfiles870EDB81-HQA8YQA5VUP3';

    public static getUser = async (id: string): Promise<IUserEntity | undefined> => {
      const result = await docClient.get({
        TableName: UserService.tableName,
        Key: {
          'id': id,
        },
      }).promise();

      if (result.$response.error) {
        throw Error(result.$response.error.message);
      }

      return result.Item as IUserEntity | undefined;
    }

    public static getAllUsers = async (id: string): Promise<IUserEntity[]> => {
      const result = await docClient.query({
        TableName: UserService.tableName,
        KeyConditionExpression: "#id = :id",
        ExpressionAttributeNames: {
          '#id': 'id',
        },
        ExpressionAttributeValues: {
          ':id': id
        },
      }).promise();

      if (!result.Items?.length) {
        throw Error('There was an issue retrieving your users');
      }

      return result.Items as IUserEntity[];
    };
}

export default UserService;
