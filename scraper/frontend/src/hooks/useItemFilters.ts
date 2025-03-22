import { useEffect, useRef, useState } from "react";

interface DefaultObject {
  id?: string;
}

interface Props<T> {
  rows?: Array<T>;
  skip?: Array<keyof T>;
  filter?: string;
}

export default function useItemFilters<TRow extends DefaultObject>({
  rows,
  skip,
  filter,
}: Props<TRow>) {
  const [result, setResult] = useState<TRow[]>([]);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (!rows || !filter) {
      setResult(rows || []);
      return;
    }

    const skipAttributes = new Set([
      ...["_id", "id", "created_at", "updated_at"],
      ...(skip || []),
    ]);

    const processedIds: Set<string> = new Set<string>();
    const filteredList: TRow[] = [];

    const checkValue = <T>(value: T): boolean => {
      const stringValue = String(value);
      return stringValue.toLowerCase().includes(filter.toLowerCase());
    };

    const processObject = (obj: TRow) => {
      const keys = Object.keys(obj) as Array<keyof TRow>;

      for (const attribute of keys) {
        if (skipAttributes.has(attribute as string)) {
          continue;
        }

        const value = obj[attribute];

        if (value === null || typeof value === "undefined") {
          continue; // Skip if value is null or undefined
        }

        if (checkValue(value)) {
          return true;
        }

        if (typeof value === "object") {
          const nestedKeys = Object.keys(value);

          for (const nestedAttribute of nestedKeys) {
            if (skipAttributes.has(nestedAttribute)) {
              continue;
            }

            const nestedValue = value[nestedAttribute as keyof typeof value];

            if (typeof nestedValue !== "object") {
              if (checkValue(nestedValue)) {
                return true;
              }
            }
          }
        }
      }

      return false;
    };

    for (const current of rows) {
      if (processedIds.has(current.id || "")) {
        continue;
      }

      if (processObject(current)) {
        processedIds.add(current.id || "");
        filteredList.push(current);
      }
    }

    timeoutRef.current = setTimeout(() => {
      setResult(filteredList);
    }, 500) as unknown as number;

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [rows, skip, filter]);

  return { result };
}
