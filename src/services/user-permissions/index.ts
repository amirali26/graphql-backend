import docClient from "../..";
import { IUserPermissionsEntity } from "../../entities/UserPermissionsEntity";

class UserPermissionsService {
    private static tableName = "HandleMyCaseDynamoTables-userPermissions1D4AAF0F-WC7S29N3F7EP";

    public static async getPermissionById(id: string): Promise<IUserPermissionsEntity | undefined> {
        const response = await docClient.get({
            TableName: UserPermissionsService.tableName,
            Key: {
                'id': id
            },
        }).promise();

        if (response.$response.error) throw Error(response.$response.error.message);

        return response.Item as IUserPermissionsEntity;
    }
}

export default UserPermissionsService;