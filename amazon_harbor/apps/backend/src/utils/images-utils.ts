import type { Image } from "@repo/schema";
import type { AxiosResponse } from "axios";
import axios from "axios";

function getImages<
  T extends {
    images: Image[];
  },
>(item: T, variant?: string) {
  const defaultVariant = variant ?? "MAIN";
  const images = item.images[0].images;
  const filteredImages = images.filter((img) => img.variant === defaultVariant);

  const sortedImages = filteredImages.sort((a, b) => {
    // Assuming width and height are numeric properties
    const areaA = a.width * a.height;
    const areaB = b.width * b.height;

    return areaB - areaA;
  });

  return sortedImages;
}

async function fetchImage(imageUrl: string) {
  const response: AxiosResponse<ArrayBuffer> = await axios.get(imageUrl, {
    responseType: "arraybuffer",
  });
  return response.data;
}

export { fetchImage, getImages };
