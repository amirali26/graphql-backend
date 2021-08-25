import docClient from '../..';
import { IUserAccountEntity } from '../../entities/UserAccountEntity';

class UserAccountService {
    private static tableName = 'HandleMyCaseDynamoTables-userAccounts0943D2A6-19SO2WP46BUFC';

    public static getAllUsersByAccountId = async (accountId: string): Promise<IUserAccountEntity[]> => {
        const result = await docClient.query({
            TableName: UserAccountService.tableName,
            KeyConditionExpression: '#aid = :aid',
            ExpressionAttributeNames: {
                "#aid": "accountId"
            },
            ExpressionAttributeValues: {
                ":aid": accountId,
            },
        }).promise();

        if (result.$response.error) {
            throw Error(result.$response.error.message);
        }

        return result.Items as IUserAccountEntity[] || [];
    }

    public static getAllAccountsByUserId = async (userId: string): Promise<IUserAccountEntity[]> => {
        const result = await docClient.query({
            TableName: UserAccountService.tableName,
            IndexName: 'userId-AccountId',
            KeyConditionExpression: '#uid = :uid',
            ExpressionAttributeNames: {
                '#uid': 'userId',
            },
            ExpressionAttributeValues: {
                ':uid': userId,
            },
        }).promise();

        if (result.$response.error) {
            throw Error(result.$response.error.message);
        }

        return result.Items as IUserAccountEntity[] || [];
    }
}

export default UserAccountService;
