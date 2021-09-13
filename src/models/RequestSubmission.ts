/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from "type-graphql";

interface IRequestSubmission {
    id?: string,
    name: string,
    phoneNumber: string,
    email: string,
    case: string,
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

    @Field(_type => String)
    case!: string;
}

export default RequestSubmission;
