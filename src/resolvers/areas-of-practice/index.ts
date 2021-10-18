import { Query, Resolver } from "type-graphql";
import AreasOfPractice from "../../models/AreasOfPractice";
import AreasOfPracticeService from "../../services/areas-of-practice";

@Resolver(() => AreasOfPractice)
class AreasOfPracticeResolver {
    @Query(() => [AreasOfPractice])
    async areasOfLegalPractices(): Promise<AreasOfPractice[]> {
        const response = await AreasOfPracticeService.getAll();
        
        return response as AreasOfPractice[]
    }
}

export default AreasOfPracticeResolver;