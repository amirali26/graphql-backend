import docClient from "../.."
import { IAccountPermissionsEntity } from "../../entities/AccountPermissionsEntity";
import createId from "../../utils/createId";

class AccountPermissionService {
    private static tableName = 'HandleMyCaseDynamoTables-accountPermissionsB4DF4A1F-QQ19OWGVEBJM';

    public static async getAccountPermissionsById(id: string): Promise<IAccountPermissionsEntity | undefined> {
        const response = await docClient.get({
            TableName: AccountPermissionService.tableName,
            Key: {
                'id': id,
            }
        }).promise();

        if (response.$response.error) throw Error(response.$response.error.message);

        return response.Item as IAccountPermissionsEntity;
    }

    public static async addAccountPermission(name: string): Promise<IAccountPermissionsEntity> {
        const id = createId();
        const response = await docClient.put({
            TableName: AccountPermissionService.tableName,
            Item: {
                'id': id,
                'name': name,
            }
        }).promise();

        if (response.$response.error) throw Error(response.$response.error.message);

        return {
            id,
            name
        }
    }
}

export default AccountPermissionService;
