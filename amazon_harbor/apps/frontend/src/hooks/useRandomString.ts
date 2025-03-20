import { useState } from "react";

function useRandomString(length: number) {
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const generateRandomString = (): string => {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset.charAt(randomIndex);
    }
    return result;
  };

  const initialString = generateRandomString();

  const [randString, setRandomString] = useState<string>(initialString);

  const getRandString = () => {
    const newRandomString = generateRandomString();
    setRandomString(newRandomString);
    return newRandomString;
  };

  return { randString, getRandString };
}

export default useRandomString;
