import { v4 } from 'uuid';
import docClient from '../..';
import { IAccountEntity } from '../../entities/AccountEntity';

class AccountService {
    private static tableName = 'HandleMyCaseDynamoTables-accountProfiles2754FC86-2H5HKEKJPP7H';

    public static getAccount = async (id: string): Promise<IAccountEntity | undefined> => {
        const result = await docClient.get({
            TableName: AccountService.tableName,
            Key: {
                'id': id
            },
        }).promise();

        if (result.$response.error) {
            throw Error(result.$response.error.message);
        }

        return result.Item as IAccountEntity | undefined;
    }

    public static addAccount = async (accountName: string, permissions: string[]): Promise<IAccountEntity> => {
        const id = v4();
        const result = await docClient.put({
            TableName: AccountService.tableName,
            Item: {
                'id': id,
                'name': accountName,
                'permissions': permissions,
            }
        }).promise();

        if (result.$response.error) throw Error(result.$response.error.message);

        return {
            id: id,
            name: accountName,
            permissions: permissions,
        }
    }
}

export default AccountService;
