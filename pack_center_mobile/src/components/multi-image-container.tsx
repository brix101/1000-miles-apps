import { ImageAsset } from "@/services/assortments/uploadAssortmentImage";
import { groupPCFImages } from "@/utils/pcfImages";
import { ImageCard } from "./cards/image-card";

interface MultiImageContainerProps {
  assortmentId: string;
  name: string;
  value?: ImageAsset[];
  onChange?: (value?: ImageAsset[]) => void;
  groupPcfImages: ReturnType<typeof groupPCFImages>;
}

export function MultiImageContainer({
  assortmentId,
  name,
  value,
  onChange,
  groupPcfImages,
}: MultiImageContainerProps) {
  const pcfImages = groupPcfImages[name as keyof typeof groupPcfImages] || [];
  const itemValues = value || [];

  const items = [...pcfImages, ...itemValues];

  function handleOnDelete(item: ImageAsset) {
    const filteredItems = value?.filter((i) => i !== item);
    onChange?.(filteredItems);
  }

  return (
    <>
      {items.map((item, index) => (
        <ImageCard
          key={index}
          assortmentId={assortmentId}
          item={item}
          label={`Image ${index + 1}`}
          isMultiple={true}
          onDeletePress={handleOnDelete}
        />
      ))}
    </>
  );
}
