import { useImagePicker } from "@/hooks/useImagePicker";
import { ImageAsset } from "@/services/assortments/uploadAssortmentImage";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Feather } from "@expo/vector-icons";
import { ImagePickerAsset } from "expo-image-picker";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

enum Options {
  ChooseFromLibrary = "Choose from library",
  Camera = "Camera",
  Cancel = "Cancel",
}

interface MultiImageButtonProps {
  value?: ImageAsset[];
  onChange?: (value?: ImageAsset[]) => void;
}

export function MultiImageButton({ value, onChange }: MultiImageButtonProps) {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();
  const { launchImagePicker, launchCamera } = useImagePicker({
    allowsMultipleSelection: true,
    allowsEditing: false,
  });

  const handleOnPickerChange = (assets: ImagePickerAsset[]) => {
    const items = assets.map((asset, idx) => ({
      uri: asset.uri,
      type: asset.mimeType ?? "image/jpeg",
      name: asset.fileName ?? `${Date.now()}-${idx + 1}.jpeg`,
    }));

    if (onChange) {
      onChange([...(value || []), ...items]);
    }
  };

  function onButtonPress() {
    const options = Object.values(Options);
    const libraryButtonIndex = options.indexOf(Options.ChooseFromLibrary);
    const cameraButtonIndex = options.indexOf(Options.Camera);
    const cancelButtonIndex = options.indexOf(Options.Cancel);

    showActionSheetWithOptions(
      {
        options: [
          t("keyInfo_chooseFromLibrary"),
          t("keyInfo_camera"),
          t("keyInfo_cancel"),
        ],
        title: t("KeyInfo_takemoreImage"),
        showSeparators: true,
        cancelButtonIndex,
      },
      (selectedIndex?: number) => {
        switch (selectedIndex) {
          case libraryButtonIndex:
            launchImagePicker((assets) => {
              handleOnPickerChange(assets);
            });
            break;
          case cameraButtonIndex:
            launchCamera((assets) => {
              handleOnPickerChange(assets);
            });
            break;
          case cancelButtonIndex:
        }
      }
    );
  }

  return (
    <Pressable onPress={onButtonPress}>
      <View style={styles.card}>
        <View style={styles.placeHolder}>
          <Feather name="camera" size={24} color="#16223B" />
          <Text style={styles.placeHolderText}>
            {t("KeyInfo_takemoreImage")}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 5,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: "#B8BDC7",
    fontSize: 20,
    fontWeight: "bold",
    width: 100,
    height: 100,
    overflow: "hidden",
  },
  placeHolder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  placeHolderText: {
    color: "#000",
    fontSize: 12,
    textAlign: "center",
  },
});
