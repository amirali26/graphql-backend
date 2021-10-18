import docClient from "../..";
import { IAreasOfPracticeEntity } from "../../entities/AreasOfPracticeEntity";

class AreasOfPracticeService {
    private static tableName = 'HandleMyCaseDynamoTables-areasOfLawTable0F7E222B-ITRGPWQDG9OZ';

    public static async getAll(): Promise<IAreasOfPracticeEntity[]> {
        const result = await docClient.scan({
            TableName: AreasOfPracticeService.tableName,
        }).promise();

        if (result.$response.error) throw Error(result.$response.error.message);

        return result.Items as IAreasOfPracticeEntity[];
    }

    public static async getArea(id: string): Promise<IAreasOfPracticeEntity> {
        const result = await docClient.query({
            TableName: AreasOfPracticeService.tableName,
            KeyConditionExpression: '#id = :id',
            ExpressionAttributeNames: {
                '#id': 'id',
            },
            ExpressionAttributeValues: {
                ':id': id
            }
        }).promise();

        if (result.$response.error || !result.Items?.length) throw Error(result.$response.error?.message || 'Can not find area of practice');

        return result.Items[0] as IAreasOfPracticeEntity
    }
}

export default AreasOfPracticeService;

