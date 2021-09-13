import { Arg, Args, Mutation, PubSub, PubSubEngine, Resolver, Root, Subscription } from "type-graphql";
import RequestSubmission from "../../models/RequestSubmission";
import RequestSubmissionService from "../../services/request-submission";

@Resolver(() => RequestSubmissionResolver)
class RequestSubmissionResolver {
    @Subscription({
        topics: "NEW_REQUEST_SUBMISSION"
    })
    newRequest(@Root() newRequestSubmission: RequestSubmission, @Args() args: RequestSubmission): RequestSubmission {
        return args;
    }

    @Mutation(returns => RequestSubmission)
    async newRequestSubmission(@Arg('requestSubmission') newRequestSubmission: RequestSubmission,
     @PubSub() pubSub: PubSubEngine): Promise<RequestSubmission> {
        const result = await RequestSubmissionService.addNewRequestSubmission({
            ...newRequestSubmission
        });

        await pubSub.publish("NEW_REQUEST_SUBMISSION", result);

        return result;
    }
}

export default RequestSubmissionResolver;