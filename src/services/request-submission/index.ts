import { v4 } from 'uuid';
import docClient from '../..';
import { IRequestSubmissionEntity } from "../../entities/RequestSubmissionEntity";

class RequestSubmissionService {
    private static tableName = 'HandleMyCaseDynamoTables-requestSubmissions307F0A30-1IC1PJSMU2YGA';

    public static async addNewRequestSubmission(
        newRequestSubmission: Omit<IRequestSubmissionEntity, 'id' | 'createdDate'>
    ): Promise<IRequestSubmissionEntity> {
        const id = v4();
        const createdDate = Date.now().toString();
        const result = await docClient.put({
            TableName: RequestSubmissionService.tableName,
            Item: {
                'id': id,
                'name': newRequestSubmission.name,
                'phoneNumber': newRequestSubmission.phoneNumber,
                'email': newRequestSubmission.email,
                'case': newRequestSubmission.case,
                'createdDate': createdDate,
            }
        }).promise();

        if (result.$response.error) throw Error(result.$response.error.message);

        return {
            ...newRequestSubmission,
            id,
            createdDate
        }
    }

    // public static async getAllRequests(): Promise<IRequestSubmissionEntity[]> {
        
    // }
}

export default RequestSubmissionService;
