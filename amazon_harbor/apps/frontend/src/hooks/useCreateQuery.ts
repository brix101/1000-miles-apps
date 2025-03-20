import { useState } from "react";

function useCreateQuery<T>(obj: T) {
  const applyQuery = (): T => obj;
  const [query, setQuery] = useState<T>(() => applyQuery());

  const updateQuery = () => {
    setQuery(applyQuery());
  };

  return [query, updateQuery] as const;
}

export default useCreateQuery;
