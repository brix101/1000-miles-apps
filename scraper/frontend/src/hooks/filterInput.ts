import lodash from "lodash";

export function filterInput<T extends object>(values: T): Partial<T> {
  return lodash.omitBy(
    values,
    (value) => lodash.isUndefined(value) || value === "" || value === null
  );
}
