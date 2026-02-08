// this file is the example of why the fuck should you not over-engineer shit

import { convertDateToISODateTime } from "@/utils/convertDateToTime";
import { HTTP_STATUS } from "@/utils/status-codes";
import type {
    DefaultSchemaType,
    HttpMethod,
    UnionToTuple,
} from "@/utils/types";
import { type Env, type MiddlewareHandler, type ValidationTargets } from "hono";
import { describeRoute, resolver, validator } from "hono-openapi";
import type z from "zod";

type ExtractMethod<T extends string> =
    T extends `${infer M extends HttpMethod} ${string}` ? M : never;

type ExtractPath<T extends string> =
    T extends `${string} ${infer P}` ? P : never;

export const parseRouteKey = <
    TKey extends `${HttpMethod} /` | (`${string} /${string}` & {}),
>(
    routeKey: TKey,
): [ExtractMethod<TKey>, ExtractPath<TKey>] => {
    const [method, path] = routeKey.split(" ");
    return [method, path] as [ExtractMethod<TKey>, ExtractPath<TKey>];
};

type GetStatusCode<T extends string> =
    T extends keyof typeof HTTP_STATUS ? (typeof HTTP_STATUS)[T] : 200;

type ResponseSchema<T extends Partial<Record<string, z.ZodType>>> = {
    [K in keyof T as GetStatusCode<K & string>]: {
        description: K;
        content: {
            "application/json": {
                schema: ReturnType<typeof resolver>;
            };
        };
    };
};

export const buildResponseSchema = <
    T extends Partial<Record<string, z.ZodType>>,
>(
    response: T,
) => {
    return Object.fromEntries(
        Object.entries(response).map(([status, schema]) => [
            HTTP_STATUS[status as keyof typeof HTTP_STATUS],
            {
                description: status,
                content: {
                    "application/json": {
                        schema: resolver(convertDateToISODateTime(schema)),
                    },
                },
            },
        ]),
    ) as ResponseSchema<T>;
};

type ValidatorTuple<T extends DefaultSchemaType.RouteType["request"]> =
    UnionToTuple<
        {
            [K in keyof T]: T[K] extends z.ZodType ?
                MiddlewareHandler<
                    Env,
                    string,
                    {
                        in: { [P in K]: z.input<T[K]> };
                        out: { [P in K]: z.output<T[K]> };
                    }
                >
            :   never;
        }[keyof T]
    >;

export const buildValidators = <
    T extends DefaultSchemaType.RouteType["request"],
>(
    request: T,
) => {
    return Object.entries(request).map(([target, schema]) =>
        validator(target as keyof ValidationTargets, schema),
    ) as unknown as ValidatorTuple<T>;
};

export const buildDescribeRoute = <T extends DefaultSchemaType.RouteType>(
    route: T,
) => {
    return describeRoute({
        description: route.description,
        responses: buildResponseSchema(route.response),
    });
};

export const route = <
    TRoute extends DefaultSchemaType.Route,
    TKey extends keyof TRoute &
        (`${HttpMethod} /` | (`${string} /${string}` & {})),
>(
    routeKey: TKey,
    routeSchema: TRoute,
): [
    ExtractMethod<TKey>,
    ExtractPath<TKey>,
    ReturnType<typeof describeRoute>,
    ...(TRoute[TKey] extends (
        {
            request: infer R extends DefaultSchemaType.RouteType["request"];
        }
    ) ?
        ValidatorTuple<R>
    :   readonly []),
] => {
    const route = routeSchema[routeKey] as DefaultSchemaType.RouteType;
    const [method, path] = parseRouteKey(routeKey);
    const description = buildDescribeRoute(route);
    const validators = buildValidators(route.request);

    return [method, path, description, ...validators] as any;
};

