import { ImageAsset } from "@/services/assortments/uploadAssortmentImage";
import { PcfImage } from "@/types/file-data";
import { UccBarcode } from "@/utils/getBarcode";
import { groupPCFImages } from "@/utils/pcfImages";
import { ImageCard } from "./image-card";

type ImageCardProps = {
  assortmentId: string;
  label?: string;
  name: string;
  value?: ImageAsset;
  onChange?: (value?: ImageAsset) => void;
  onErrors?: (errors?: string[]) => void;
  groupPcfImages: ReturnType<typeof groupPCFImages>;
};

export const ImagePickerCard = ({
  label = "Image",
  assortmentId,
  name,
  value,
  onChange,
  onErrors,
  groupPcfImages,
}: ImageCardProps) => {
  const pcfImage = groupPcfImages[name as keyof typeof groupPCFImages]?.[0] as
    | PcfImage
    | undefined;

  const item = value ?? pcfImage;
  const uccType = ["masterUccLabel", "innerUccLabel"].includes(name)
    ? (name as keyof UccBarcode)
    : undefined;

  return (
    <ImageCard
      assortmentId={assortmentId}
      item={item}
      label={label}
      uccType={uccType}
      onImageSelect={(item) => onChange?.(item[0])}
      onImageError={onErrors}
      onDeletePress={() => onChange?.()}
    />
  );
};
