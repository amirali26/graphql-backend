import { v4 } from 'uuid';
import docClient from '../..';
import { IRequestSubmissionEntity } from "../../entities/RequestSubmissionEntity";
import RequestStatus from '../../enums/RequestStatus';
import { DateTime } from 'luxon';

class RequestSubmissionService {
    private static tableName = 'HandleMyCaseDynamoTables-requestSubmissions307F0A30-1IC1PJSMU2YGA';

    public static async addNewRequestSubmission(
        newRequestSubmission: Omit<IRequestSubmissionEntity, 'id' | 'createdDate' | 'status'>
    ): Promise<IRequestSubmissionEntity> {
        const id = v4();
        const createdDate = DateTime.now().setZone('utc').toSeconds().toString();
        const result = await docClient.put({
            TableName: RequestSubmissionService.tableName,
            Item: {
                'id': id,
                'name': newRequestSubmission.name,
                'phoneNumber': newRequestSubmission.phoneNumber,
                'email': newRequestSubmission.email,
                'case': newRequestSubmission.case,
                'status': RequestStatus.OPEN,
                'createdDate': createdDate,
                'createdate#topic#accountId#userId': `${createdDate}#${newRequestSubmission.case}#undefined#undefined`
            }
        }).promise();

        if (result.$response.error) throw Error(result.$response.error.message);

        return {
            ...newRequestSubmission,
            id,
            createdDate,
            status: RequestStatus.OPEN,
        }
    }

    public static async getAllRequests(): Promise<IRequestSubmissionEntity[]> {

        const previousThirtyDays = DateTime.now().minus({ days: 30 }).setZone('utc').toSeconds().toString();

        const results = await docClient.query({
            TableName: RequestSubmissionService.tableName,
            IndexName: 'gsiStatusCreatedDateTopicAccountUserId',
            KeyConditionExpression: '#status= :status and #gsiSort >= :createdDate',
            ExpressionAttributeNames: {
                '#status': 'status',
                '#gsiSort': 'createdate#topic#accountId#userId',
            },
            ExpressionAttributeValues: {
                ':status': 'OPEN',
                ':createdDate': previousThirtyDays,
            }
        }).promise();

        if (results.$response.error) {
            throw Error(results.$response.error.message);
        }

        return results.Items as IRequestSubmissionEntity[]
    }
}

export default RequestSubmissionService;
