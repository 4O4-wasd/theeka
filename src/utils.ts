import type z from "zod";

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
