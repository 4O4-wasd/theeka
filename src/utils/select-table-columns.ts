import type { SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";

export const selectTableColumns = <
    TSchema extends SQLiteTableWithColumns<any>,
    TType extends "omit" | "pick",
    TColumns extends {
        [K in keyof TSchema["$inferSelect"]]?: true;
    },
>(
    schema: TSchema,
    type: TType,
    columns: TColumns,
) => {
    return Object.fromEntries(
        type === "pick" ?
            Object.keys(columns).map((key) => [
                key as keyof TColumns,
                schema[key as keyof TColumns],
            ])
        :   Object.keys(schema)
                .filter((key) => !Object.keys(columns).includes(key))
                .map((key) => [
                    key as keyof TColumns,
                    schema[key as keyof TColumns],
                ]),
    ) as TType extends "pick" ?
        {
            [K in keyof TColumns]: TSchema[K];
        }
    : TType extends "omit" ?
        {
            [K in keyof Omit<
                TSchema["$inferSelect"],
                keyof TColumns
            >]: TSchema[K];
        }
    :   never;
};

type a = {
    abc: "hello";
    bc: "he";
};

type b = Omit<a, "abc">;
