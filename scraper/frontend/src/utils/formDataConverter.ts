export default function <T>(values: T) {
  const formData = new FormData();
  for (const key in values) {
    if (Object.prototype.hasOwnProperty.call(values, key)) {
      const value = values[key as keyof T];

      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    }
  }

  return formData;
}
