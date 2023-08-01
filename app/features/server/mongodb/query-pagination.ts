import { Collection, Filter, Sort, WithId } from "mongodb";
import { Document } from "bson";
import { PaginatedResults } from "@commons/types/types";

export const queryPagination = async <T extends Document = Document>(
  collection: Collection<T>,
  {
    search,
    sort,
    skip = 0,
    limit = 10,
  }: {
    search?: string | null;
    sort?: string | null;
    skip: number;
    limit: number;
  },
): Promise<PaginatedResults<WithId<T>>> => {
  const query: Filter<T> = {};
  if (search) {
    query.$text = {
      $search: search,

      $caseSensitive: false,
      $diacriticSensitive: false,
      $language: "fr",
    };
  }

  let sortObject: Sort = {};
  if (sort) {
    const sortFields = sort.split(",");
    for (const field of sortFields) {
      if (field.startsWith("-")) {
        sortObject[field.substring(1)] = -1;
      } else {
        sortObject[field] = 1;
      }
    }
  }
  const total = await collection.countDocuments(query);
  const paginateResults = await collection
    .find(query)
    .sort(sortObject)
    .skip(skip)
    .limit(limit)
    .toArray();
  return {
    total,
    skip,
    limit,
    results: paginateResults,
  };
};
