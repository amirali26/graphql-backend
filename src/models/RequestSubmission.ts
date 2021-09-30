/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from "type-graphql";
import RequestStatus from "../enums/RequestStatus";


interface IRequestSubmission {
    id?: string,
    name: string,
    phoneNumber: string,
    email: string,
    status: RequestStatus,
    case: string,
    createdDate: string,
}


@ObjectType()
class RequestSubmission implements IRequestSubmission {
    @Field(_type => ID)
    id!: string;

    @Field(_type => String)
    name!: string;

    @Field(_type => String)
    phoneNumber!: string;

    @Field(_type => String)
    email!: string;

    @Field(_type => RequestStatus)
    status!: RequestStatus;

    @Field(_type => String)
    case!: string;

    @Field(_type => String)
    createdDate!: string;
}

export default RequestSubmission;
