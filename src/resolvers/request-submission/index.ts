import { Arg, Mutation, PubSub, PubSubEngine, Resolver, Root, Subscription } from "type-graphql";
import { IRequestSubmissionEntity } from "../../entities/RequestSubmissionEntity";
import RequestSubmissionInput from "../../inputs/request-submission";
import RequestSubmission from "../../models/RequestSubmission";
import RequestSubmissionService from "../../services/request-submission";

@Resolver()
class RequestSubmissionResolver {
    @Subscription({ topics: 'NOTIFICATIONS' })
    newNotification(@Root() payload: IRequestSubmissionEntity): RequestSubmission {
        return payload;
    }

    @Mutation(() => RequestSubmission)
    async newRequestSubmission(@Arg('requestSubmission') newRequestSubmission: RequestSubmissionInput,
        @PubSub() pubsub: PubSubEngine): Promise<RequestSubmission> {
        const result = await RequestSubmissionService.addNewRequestSubmission({
            ...newRequestSubmission
        });

        await pubsub.publish('NOTIFICATIONS', result)

        return result;
    }
}

export default RequestSubmissionResolver;