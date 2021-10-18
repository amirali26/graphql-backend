/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, InputType } from "type-graphql";
import AreasOfPractice from "../../models/AreasOfPractice";

@InputType()
class AreasOfPracticeInput implements Partial<AreasOfPractice> {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    name!: string
}

export default AreasOfPracticeInput;
