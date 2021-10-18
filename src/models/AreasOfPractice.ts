import { Field, ID, ObjectType } from "type-graphql";

export interface IAreasOfPractice {
    id: string,
    name: string,
}

@ObjectType()
class AreasOfPractice implements IAreasOfPractice {
    @Field(() => ID)
    id!: string;

    @Field(() => String)
    name!: string;
}

export default AreasOfPractice;
