import type { ValidationTargets } from "hono";
import z from "zod";
import { HTTP_STATUS } from "../status-codes";

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

export namespace DefaultSchemaType {
    export type Repository = Record<
        string,
        {
            input?: z.ZodType;
            output?: z.ZodType;
        }
    >;

    export type Service = Repository;

    export type Route = Record<
        string,
        {
            request?: Partial<Record<keyof ValidationTargets, z.ZodType>>;
            response?: Partial<Record<keyof typeof HTTP_STATUS, z.ZodType>>;
        }
    >;
}
