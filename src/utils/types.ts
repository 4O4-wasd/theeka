import type { ValidationTargets } from "hono";
import z from "zod";
import { HTTP_STATUS } from "./status-codes";

export type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

type InferZodSchema<T> = T extends z.ZodType<infer U> ? U : T;

type InferSchemaLevel<T> =
    T extends (...args: any[]) => any ? InferSchemaLevel<ReturnType<T>>
    :   {
            [K in keyof T]: T[K] extends z.ZodType<any> ? InferZodSchema<T[K]>
            : T[K] extends object ? InferSchemaLevel<T[K]>
            : T[K];
        };

export type InferSchema<T> = Prettify<{
    [K in keyof T]: T[K] extends (...args: any[]) => any ?
        Prettify<InferSchemaLevel<ReturnType<T[K]>>>
    :   Prettify<InferSchemaLevel<T[K]>>;
}>;

export type ToFunctions<T> = {
    [K in keyof T]: T[K] extends { input: infer I; output: infer O } ?
        (input: I) => Promise<O>
    : T[K] extends { output: infer O } ? () => Promise<O>
    : T[K] extends { input: infer I } ? (input: I) => Promise<void>
    : () => Promise<void>;
};

export type HttpMethod =
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE"
    | "OPTIONS";

export namespace DefaultSchemaType {
    export type Service = Record<
        string,
        {
            input?: z.ZodType;
            output?: z.ZodType;
        }
        >;
    
    export type RouteType = {
        description: string;
        request: Partial<Record<keyof ValidationTargets, z.ZodType>>;
        response: Partial<Record<keyof typeof HTTP_STATUS, z.ZodType>>;
    };

    export type Route = {
        [K in `${HttpMethod} /` | (`${string} /${string}` & {})]?: RouteType;
    };
}

// i do not understand any of this, my respect for library devs has increased. it's 2:47 AM pls send help i wanna cry
// edit: uh it's pretty easy to understand it's 3:25 AM, yeah...
type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I
    :   never;

type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => infer R ?
        R
    :   never;

export type UnionToTuple<
    T,
    L = LastOf<T>,
    N = [T] extends [never] ? true : false,
> = true extends N ? [] : [...UnionToTuple<Exclude<T, L>>, L];