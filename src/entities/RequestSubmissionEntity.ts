import RequestStatus from "../models/RequestStatus";

export interface IRequestSubmissionEntity {
    id: string,
    name: string,
    phoneNumber: string,
    email: string,
    case: string,
    status: RequestStatus,
    createdDate: string,
}