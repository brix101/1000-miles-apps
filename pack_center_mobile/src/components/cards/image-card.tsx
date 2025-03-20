import { QUERY_KEYS } from "@/constants/query.key";
import useImagePress from "@/hooks/useImagePress";
import { ImageAsset } from "@/services/assortments/uploadAssortmentImage";
import { useUpdatePCFImage } from "@/services/pcf-images/updatePCFImage";
import { Assortment } from "@/types/assortment";
import { PcfImage } from "@/types/file-data";
import { UccBarcode, getBarcodes } from "@/utils/getBarcode";
import { getPCFImageSrc } from "@/utils/pcfImages";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { BarcodeScanningResult, BarcodeType, Camera } from "expo-camera";
import { ImagePickerAsset } from "expo-image-picker";
import React from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";

type ImageItem = ImageAsset | PcfImage;

type ImageCardProps = {
  assortmentId: string;
  label?: string;
  title?: string;
  item?: ImageItem;
  isMultiple?: boolean;
  uccType?: keyof UccBarcode;
  onDeletePress?: (item: ImageAsset) => void;
  onImageSelect?: (item: ImageAsset[], errors?: string[]) => void;
  onImageError?: (errors?: string[]) => void;
};

const LEADING_TRAILING_SPACES_ERROR = "LEADING_TRAILING_SPACES_ERROR";
const NOT_MATCHED_BARCODE_ERROR = "NOT_MATCHED_BARCODE_ERROR";

export const ImageCard = ({
  label = "image",
  assortmentId,
  item,
  isMultiple,
  uccType,
  onDeletePress,
  onImageSelect,
  onImageError,
}: ImageCardProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [imgErrors, setImgErrors] = React.useState<Array<string>>(
    item && "barcodeErrors" in item ? item?.barcodeErrors : []
  );
  const assortment = queryClient.getQueryData<Assortment>([
    QUERY_KEYS.ASSORTMENTS,
    assortmentId,
  ]);
  const itemSrc = getPCFImageSrc(item);
  const isRetake = item && "isApproved" in item && !item.isApproved;
  const barcodeTypes: BarcodeType[] = ["code128", "code39", "code93", "upc_a"];

  const pcfImageUpdate = useUpdatePCFImage();
  // const assortmentUpdate = useEditAssortment();

  const { onImagePress } = useImagePress({
    imagePickerOptions: { allowsEditing: true },
    isMultiple,
    label,
    onImageSelect: (assets: ImagePickerAsset[]) => {
      const items = assets.map((asset, idx) => ({
        uri: asset.uri,
        type: asset.mimeType ?? "image/jpeg",
        name: asset.fileName ?? `${Date.now()}-${idx + 1}.jpeg`,
      }));

      if (onImageSelect) {
        onImageSelect(items, imgErrors);
      }
    },
    onDelete: onDeletePress,
  });

  const handleImagePress = () => {
    onImagePress({ item, assortmentId });
  };

  const expectedBarcode = React.useMemo(() => {
    if (uccType) {
      return getBarcodes(assortment)[uccType];
    }
    return null;
  }, [uccType]);

  // const [resBarcode, setResBarcode] = React.useState<string | undefined>();

  const handleScan = React.useCallback(
    (scanRes: BarcodeScanningResult) => {
      const scanedBarcode = scanRes.data;
      // setResBarcode(scanedBarcode);

      if (
        scanedBarcode !== scanedBarcode.trim() &&
        !imgErrors.includes(LEADING_TRAILING_SPACES_ERROR)
      ) {
        setImgErrors((prev) => [...prev, LEADING_TRAILING_SPACES_ERROR]);
      }
      if (
        expectedBarcode &&
        scanedBarcode !== expectedBarcode.trim() &&
        !imgErrors.includes(NOT_MATCHED_BARCODE_ERROR)
      ) {
        setImgErrors((prev) => [...prev, NOT_MATCHED_BARCODE_ERROR]);
      }
    },
    [expectedBarcode]
  );

  React.useEffect(() => {
    if (uccType && itemSrc) {
      Camera.scanFromURLAsync(itemSrc, barcodeTypes)
        .then((res) => {
          if (Array.isArray(res)) {
            res.forEach(handleScan);
          } else {
            handleScan(res);
          }
        })
        .catch(() => {
          setImgErrors([]);
        })
        .finally(() => {
          if (item && "_id" in item) {
            if (
              item?.barcodeErrors?.sort().join(",") !==
              imgErrors.sort().join(",")
            ) {
              pcfImageUpdate.mutate({
                _id: item._id,
                assortmentId,
                barcodeErrors: imgErrors,
              });
            }
          }
        });
    }
    return () => {
      setImgErrors([]);
    };
  }, [uccType, itemSrc, handleScan]);

  // React.useEffect(() => {
  //   if (item && "_id" in item) {
  //     if (
  //       item?.barcodeErrors?.sort().join(",") !== imgErrors.sort().join(",")
  //     ) {
  //       pcfImageUpdate.mutate({
  //         _id: item._id,
  //         assortmentId,
  //         barcodeErrors: imgErrors,
  //       });
  //     }
  //   }
  // }, [imgErrors, item]);

  // React.useEffect(() => {
  //   if (expectedBarcode && resBarcode && uccType) {
  //     const expedtedQty = expectedBarcode?.split(" ")[1];
  //     const expedtedUnit = expectedBarcode?.split(" ")[2];

  //     const resQty = resBarcode?.split(" ")[1];
  //     const resUnit = resBarcode?.split(" ")[2];

  //     let updateData: EditAssortmentDTO = { _id: assortmentId };

  //     if (expedtedQty && resQty && resQty !== expedtedQty) {
  //       updateData = {
  //         ...updateData,
  //         [uccType === "masterUccLabel" ? "itemInCarton" : "itemPerUnit"]:
  //           resQty,
  //       };
  //     }

  //     if (expedtedUnit && resUnit && resUnit !== expedtedUnit) {
  //       updateData = {
  //         ...updateData,
  //         unit: resUnit,
  //       };
  //     }

  //     if (Object.keys(updateData).length > 1) {
  //       assortmentUpdate.mutate(updateData);
  //     }
  //   }
  // }, [resBarcode, expectedBarcode]);

  return (
    <Pressable onPress={handleImagePress}>
      <View style={styles.card}>
        {item ? (
          <View style={styles.cardImage}>
            <Image
              src={itemSrc}
              style={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.placeHolder}>
            <Feather name="camera" size={24} color="#16223B" />
            <Text style={styles.placeHolderText}>{t("keyText_takeImage")}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.name}>{label}</Text>
        </View>
        {Boolean(imgErrors.length) ? (
          <View style={styles.errorCard}>
            <Text style={styles.textError}>{t("keyText_barcodeError")}</Text>
          </View>
        ) : (
          isRetake && (
            <View style={styles.retakeCard}>
              <Text style={styles.textError}>{t("keyText_retake")}</Text>
            </View>
          )
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  retakeCard: {
    position: "absolute",
    backgroundColor: "rgba(255, 0, 83, 0.3)",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textError: {
    color: "white",
    textTransform: "uppercase",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
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
  cardImage: {
    flex: 3,
  },
  cardFooter: {
    borderTopWidth: 0.5,
    borderColor: "#B8BDC7",
    paddingVertical: 2,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  name: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#050E21",
  },
  placeHolder: {
    flex: 1,
    borderBlockColor: "#16223B",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  placeHolderText: {
    color: "#000",
    fontSize: 12,
  },
  errorCard: {
    position: "absolute",
    backgroundColor: "rgba(245, 124, 0, 0.5)",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
