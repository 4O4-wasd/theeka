import * as auth from "./auth";
import * as service from "./business";
import * as serviceProvider from "./professional";
import * as review from "./review";

export const schema = {
    ...serviceProvider,
    ...auth,
    ...review,
    ...service,
};
