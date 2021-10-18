import { v4 } from 'uuid';
import docClient from '../..';
import { IAccountEntity } from '../../entities/AccountEntity';

class AccountService {
    private static tableName = 'HandleMyCaseDynamoTables-accountProfiles2754FC86-2H5HKEKJPP7H';

    public static getAccount = async (id: string): Promise<IAccountEntity> => {
        const result = await docClient.query({
            TableName: AccountService.tableName,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id,
            }
        }).promise();

        if (result.$response.error) {
            throw Error(result.$response.error.message);
        }

        if (!result.Items?.length) {
            throw Error(`No account found with the id: ${id}`);
        }

        return result.Items[0] as IAccountEntity;
    }

    public static addAccount = async (accountName: string,
        userId: string,
        permissions: string[],
        receiveEmails: boolean,
        areasOfPractices: string[]
    ): Promise<IAccountEntity> => {
        const id = v4();
        const createdDate = Date.now().toString();
        const result = await docClient.put({
            TableName: AccountService.tableName,
            Item: {
                'id': id,
                'name': accountName,
                'permissions': permissions,
                'receiveEmails': receiveEmails,
                'areasOfPractices': areasOfPractices,
                'createdDate': createdDate,
                'createdBy': userId,
            }
        }).promise();

        if (result.$response.error) throw Error(result.$response.error.message);

        return {
            id: id,
            name: accountName,
            permissions: permissions,
            createdBy: userId,
            createdDate,
        }
    }
}

export default AccountService;
