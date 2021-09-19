import { Field, InputType } from "type-graphql";
import RequestSubmission from "../../models/RequestSubmission";

@InputType()
class RequestSubmissionInput implements Partial<RequestSubmission> {
    @Field(_type => String)
    name!: string;

    @Field(_type => String)
    phoneNumber!: string;

    @Field(_type => String)
    email!: string;

    @Field(_type => String)
    case!: string;
}

@InputType()
export class NewRequestInput {
    @Field(_type => [String])
    id!: string[];
}

export default RequestSubmissionInput;
