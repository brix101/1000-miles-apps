import { useDeletePCFImage } from "@/services/assortments/deletePCFImage";
import { ImageAsset } from "@/services/assortments/uploadAssortmentImage";
import { PcfImage } from "@/types/file-data";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import { useTranslation } from "react-i18next";
import { useImagePicker } from "./useImagePicker";

interface Opts {
  imagePickerOptions: ImagePicker.ImagePickerOptions | undefined;
  isMultiple?: boolean;
  label?: string;
  onImageSelect?: (items: ImagePicker.ImagePickerAsset[]) => void;
  onDelete?: (item: ImageAsset) => void;
}

enum Options {
  ChooseFromLibrary = "Choose from library",
  Camera = "Camera",
  Delete = "Delete",
  Cancel = "Cancel",
}

type ImageItem = ImageAsset | PcfImage;
type ImagePressOpts = {
  item?: ImageItem;
  assortmentId: string;
};

export default function useImagePress({
  imagePickerOptions,
  isMultiple,
  label,
  onImageSelect,
  onDelete,
}: Opts) {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();
  const { launchImagePicker, launchCamera } =
    useImagePicker(imagePickerOptions);

  const delImage = useDeletePCFImage();

  const onImagePress = React.useCallback(
    ({ item, assortmentId }: ImagePressOpts) => {
      const options = Object.values(Options);
      const libraryButtonIndex = options.indexOf(Options.ChooseFromLibrary);
      const cameraButtonIndex = options.indexOf(Options.Camera);
      const cancelButtonIndex = options.indexOf(Options.Cancel);
      const deleteButtonIndex = options.indexOf(Options.Delete);
      const disabledButtonIndices = [];

      if (isMultiple) {
        disabledButtonIndices.push(libraryButtonIndex, cameraButtonIndex);
      } else if (!item) {
        disabledButtonIndices.push(deleteButtonIndex);
      }

      showActionSheetWithOptions(
        {
          options: [
            t("keyInfo_chooseFromLibrary"),
            t("keyInfo_camera"),
            t("keyInfo_delete"),
            t("keyInfo_cancel"),
          ],
          title: t("keyInfo_select_iterpolate", { value: label }),
          showSeparators: true,
          cancelButtonIndex,
          destructiveButtonIndex: deleteButtonIndex,
          disabledButtonIndices,
        },
        (selectedIndex?: number) => {
          switch (selectedIndex) {
            case libraryButtonIndex:
              launchImagePicker(onImageSelect);
              break;
            case cameraButtonIndex:
              launchCamera(onImageSelect);
              break;
            case deleteButtonIndex:
              if (item && "_id" in item) {
                delImage.mutate({ pcfImageId: item._id, assortmentId });
              }
              if (item && "uri" in item) {
                onDelete?.(item);
              }
              break;
            case cancelButtonIndex:
          }
        }
      );
    },
    [isMultiple, onImageSelect, onDelete, t, label, delImage]
  );

  return { onImagePress };
}
