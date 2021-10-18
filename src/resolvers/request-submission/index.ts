import { Arg, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from "type-graphql";
import RequestSubmissionInput, { NewRequestInput } from "../../inputs/request-submission";
import RequestSubmission from "../../models/RequestSubmission";
import RequestSubmissionService from "../../services/request-submission";

@Resolver()
class RequestSubmissionResolver {
    @Query(() => [RequestSubmission])
    async requestSubmissions(): Promise<RequestSubmission[]> {
        return await RequestSubmissionService.getAllRequests();
    }
}

export default RequestSubmissionResolver;