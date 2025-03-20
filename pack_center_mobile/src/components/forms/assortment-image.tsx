import {
  AppState,
  AppStateStatus,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { ImagePickerCard } from "@/components/cards/image-picker-card";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { QUERY_KEYS } from "@/constants/query.key";
import { useCameraState } from "@/providers/camera-state";
import {
  UploadAssortmentImageDTO,
  uploadAssortmentImageSchema,
  useUploadAssortmentImage,
} from "@/services/assortments/uploadAssortmentImage";
import { AssortmentPCF } from "@/types/assortment";
import { groupPCFImages } from "@/utils/pcfImages";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MultiImageButton } from "../multi-image-button";
import { MultiImageContainer } from "../multi-image-container";

interface AssortmentImagesProps {
  assortment: AssortmentPCF;
  refreshing: boolean;
  onRefresh?: () => void;
}

export function AssortmentImages({
  assortment,
  refreshing,
  onRefresh,
}: AssortmentImagesProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { cameraOpen } = useCameraState();
  const cameraOpenRef = React.useRef(cameraOpen);

  const form = useForm<UploadAssortmentImageDTO>({
    resolver: zodResolver(uploadAssortmentImageSchema),
    defaultValues: {
      _id: assortment._id,
      masterUccLabel: undefined,
      masterShippingMark: undefined,
      masterCarton: undefined,
      innerUccLabel: undefined,
      innerItemLabel: undefined,
      innerItemUccLabel: undefined,
      innerCarton: undefined,
      upcLabelFront: undefined,
      upcLabelBack: undefined,
      upcPlacement: [],
      productPictures: [],
      protectivePackaging: [],
    },
  });

  const { mutate, isPending } = useUploadAssortmentImage({
    mutationKey: [QUERY_KEYS.ASSORTMENTS, assortment._id],
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEYS.ASSORTMENTS, assortment._id], data);
      if (AppState.currentState === "active") {
        ToastAndroid.show(t("keyMessage_imageuploaded"), ToastAndroid.SHORT);
      }
      form.reset();
    },
  });

  const groupedImages = groupPCFImages(assortment?.pcfImages || []);

  function onSubmit(values: UploadAssortmentImageDTO) {
    mutate({ ...values, _id: assortment._id });
  }

  function handleSave() {
    form.handleSubmit(onSubmit)();
  }

  const handleAppStateChange = React.useCallback((state: AppStateStatus) => {
    if (
      !cameraOpenRef.current &&
      (state === "background" || state === "inactive")
    ) {
      handleSave();
    }
  }, []);

  React.useEffect(() => {
    cameraOpenRef.current = cameraOpen;
  }, [cameraOpen]);

  React.useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      handleSave();
    };
  }, []);

  return (
    <Form {...form}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            enabled={true}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.title}>{t("keyImageSection_masterCarton")}</Text>
          <View style={styles.items}>
            <FormField
              control={form.control}
              name="masterUccLabel"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_uccLabel")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  onErrors={(errors) => {
                    if (value) {
                      form.setValue("masterUccErrors", errors?.join(","));
                    }
                  }}
                  groupPcfImages={groupedImages}
                />
              )}
            />
            <FormField
              control={form.control}
              name="masterShippingMark"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_shippingMark")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  groupPcfImages={groupedImages}
                />
              )}
            />
            <FormField
              control={form.control}
              name="masterCarton"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_masterCarton")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  groupPcfImages={groupedImages}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>{t("keyImageSection_innerCarton")}</Text>
          <View style={styles.items}>
            <FormField
              control={form.control}
              name="innerItemLabel"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_itemLabel")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  groupPcfImages={groupedImages}
                />
              )}
            />
            <FormField
              control={form.control}
              name="innerUccLabel"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_uccLabel")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  onErrors={(errors) => {
                    if (value) {
                      form.setValue("innerUccErrors", errors?.join(","));
                    }
                  }}
                  groupPcfImages={groupedImages}
                />
              )}
            />
            <FormField
              control={form.control}
              name="innerItemUccLabel"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_uccItemLabel")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  groupPcfImages={groupedImages}
                />
              )}
            />
            <FormField
              control={form.control}
              name="innerCarton"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_innerCarton")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  groupPcfImages={groupedImages}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>{t("keyImageSection_upcLabel")}</Text>
          <View style={styles.items}>
            <FormField
              control={form.control}
              name="upcLabelFront"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_frontUPCLabel")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  groupPcfImages={groupedImages}
                />
              )}
            />
            <FormField
              control={form.control}
              name="upcLabelBack"
              render={({ field: { name, value, onChange } }) => (
                <ImagePickerCard
                  label={t("keyImageType_backUPCLabel")}
                  assortmentId={assortment._id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  groupPcfImages={groupedImages}
                />
              )}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>{t("keyImageSection_upcPlacement")}</Text>
          <View style={styles.items}>
            <FormField
              control={form.control}
              name="upcPlacement"
              render={({ field: { name, value, onChange } }) => (
                <>
                  <MultiImageContainer
                    assortmentId={assortment._id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    groupPcfImages={groupedImages}
                  />
                  <MultiImageButton value={value} onChange={onChange} />
                </>
              )}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>{t("keyImageSection_product")}</Text>
          <View style={styles.items}>
            <FormField
              control={form.control}
              name="productPictures"
              render={({ field: { name, value, onChange } }) => (
                <>
                  <MultiImageContainer
                    assortmentId={assortment._id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    groupPcfImages={groupedImages}
                  />
                  <MultiImageButton value={value} onChange={onChange} />
                </>
              )}
            />
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>{t("keyImageSection_protected")}</Text>
          <View style={styles.items}>
            <FormField
              control={form.control}
              name="protectivePackaging"
              render={({ field: { name, value, onChange } }) => (
                <>
                  <MultiImageContainer
                    assortmentId={assortment._id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    groupPcfImages={groupedImages}
                  />
                  <MultiImageButton value={value} onChange={onChange} />
                </>
              )}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <Button
          style={styles.saveBtn}
          title={t("keyButton_savedImages")}
          isLoading={isPending}
          disabled={isPending || !form.formState.isDirty}
          onPress={handleSave}
        />
      </View>
    </Form>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 10,
  },
  section: {
    gap: 5,
    paddingBottom: 25,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    padding: 5,
  },
  items: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  btnContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  saveBtn: {
    width: "50%",
  },
});
