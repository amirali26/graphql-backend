import RequestStatus from "../enums/RequestStatus";

export interface IRequestSubmissionEntity {
    id: string,
    name: string,
    phoneNumber: string,
    email: string,
    case: string,
    status: RequestStatus,
    createdDate: string,
}