import docClient from "../.."
import { IAccountPermissionsEntity } from "../../entities/AccountPermissionsEntity";

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
}

export default AccountPermissionService;
