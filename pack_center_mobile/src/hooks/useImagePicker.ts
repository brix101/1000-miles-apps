import { useCameraState } from "@/providers/camera-state";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export function useImagePicker(
  options?: ImagePicker.ImagePickerOptions | undefined
) {
  const { setCameraOpen } = useCameraState();
  const [assets, setAssets] = useState<ImagePicker.ImagePickerAsset[] | null>();

  const defaultOpts: ImagePicker.ImagePickerOptions = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    // aspect: [4, 3],
    quality: 1,
    ...options,
  };

  const launchImagePicker = async (
    callback?: (assets: ImagePicker.ImagePickerAsset[]) => void
  ) => {
    setCameraOpen(true);
    let result = await ImagePicker.launchImageLibraryAsync(defaultOpts);

    if (!result.canceled) {
      setCameraOpen(false);
      setAssets(result.assets);
      if (callback) {
        callback(result.assets);
      }
    } else {
      setCameraOpen(false);
    }
  };

  const launchCamera = async (
    callback?: (assets: ImagePicker.ImagePickerAsset[]) => void
  ) => {
    setCameraOpen(true);
    let result = await ImagePicker.launchCameraAsync(defaultOpts);

    if (!result.canceled) {
      setCameraOpen(false);
      setAssets(result.assets);
      if (callback) {
        callback(result.assets);
      }
    } else {
      setCameraOpen(false);
    }
  };

  return { assets, launchImagePicker, launchCamera };
}
