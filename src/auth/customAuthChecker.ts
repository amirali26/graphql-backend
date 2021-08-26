import { AuthChecker } from "type-graphql";
import { IContext } from "../models/Context";

const customAuthChecker: AuthChecker<IContext> = (
    { root, args, context, info },
    roles,
) => {
    if (roles.every((role) => context.permissions.some(
        (perm) => perm.toLocaleLowerCase() === role.toLowerCase()))) return true;

    return false;
};

export default customAuthChecker;
