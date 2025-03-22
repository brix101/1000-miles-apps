export default function compareArrays<T>(
  arr1: Array<T>,
  arr2: Array<T>
): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((element) => arr2.includes(element));
}
