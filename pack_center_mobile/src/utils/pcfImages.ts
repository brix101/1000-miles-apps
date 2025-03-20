import { BASE_URL } from "@/lib/axios-client";
import {
  ImageAsset,
  UploadImageDTO,
} from "@/services/assortments/uploadAssortmentImage";
import { PcfImage } from "@/types/file-data";

export function groupPCFImages(images: PcfImage[]) {
  return images.reduce((acc, curr) => {
    const field = curr.field as keyof UploadImageDTO;
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(curr);
    return acc;
  }, {} as Record<keyof UploadImageDTO, PcfImage[]>);
}

export function getPCFImageSrc(item?: ImageAsset | PcfImage) {
  if (!item) {
    return "";
  }

  let imgSrc = "";

  if ("uri" in item) {
    imgSrc = item.uri;
  } else if (item.fileData && typeof item.fileData.filename === "string") {
    imgSrc = `${BASE_URL}/files/static/${item.fileData.filename}`;
  }

  return imgSrc;
}
