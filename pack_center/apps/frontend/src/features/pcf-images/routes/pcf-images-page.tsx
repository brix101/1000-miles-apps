import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Accordion } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { QUERY_KEYS } from '@/constant/query-key';
import {
  Assortment,
  UploadAssortmentImageDTO,
  uploadAssortmentImageSchema,
  useUploadAssortmentImage,
} from '@/features/assortments';
import { groupPCFImages } from '@/utils/pcf-util';
import { useTranslation } from 'react-i18next';
import { PcfImage } from '..';
import { ImageDropZone } from '../components/image-dropzone';
import { ImageDropZoneMulti } from '../components/image-dropzone-multi';

export interface PCFImagesPageProps<T extends Assortment> {
  assortment: T & { pcfImages: PcfImage[] };
}

export function PCFImagesPage<T extends Assortment>({
  assortment,
}: PCFImagesPageProps<T>) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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
    onSuccess: (data) => {
      form.reset();
      queryClient.setQueryData([QUERY_KEYS.ASSORTMENTS, assortment._id], data);
      toast.success('Images saved successfully');
    },
  });

  const groupedImages = groupPCFImages(assortment?.pcfImages || []);

  function onSubmit(values: UploadAssortmentImageDTO) {
    mutate({ ...values, _id: assortment._id });
  }

  return (
    <Form {...form}>
      <div className="row">
        <div className="col"></div>
        <div className="col d-flex align-items-center justify-content-center">
          <a
            className={'text-uppercase fw-semi-bold fs--1'}
            href={`/api/zulu-assortments/${assortment._id}/downloads`}
            target="_blank"
          >
            <Icons.ShareO1 width={16} height={16} />
            <span className="ms-2">{t(`keyButton_download.images`)}</span>
          </a>
        </div>
        <div className="col d-flex justify-content-end">
          <Button
            variant={'primary'}
            type="button"
            disabled={isPending || !form.formState.isDirty}
            onClick={() => form.handleSubmit(onSubmit)()}
          >
            {isPending && (
              <Icons.LoaderSpinner
                height={16}
                width={16}
                className="custom-spinner"
              />
            )}
            <span className="ms-2">{t(`keyButton_savedImages`)}</span>
          </Button>
        </div>
      </div>
      <Accordion
        defaultActiveKey={['0', '1', '2', '3', '4', '5']}
        alwaysOpen
        className="card px-4 py-1 mt-4"
      >
        <Accordion.Item eventKey="0" className="pb-4">
          <Accordion.Header className="text-uppercase">
            {t('keyImageSection_masterCarton')}
          </Accordion.Header>
          <Accordion.Body>
            <div className="border-top pt-2 assortments-images-container">
              <FormField
                control={form.control}
                name="masterUccLabel"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_uccLabel')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="masterShippingMark"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_shippingMark')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="masterCarton"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_masterCarton')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1" className="pb-4">
          <Accordion.Header className="text-uppercase">
            {t('keyImageSection_innerCarton')}
          </Accordion.Header>
          <Accordion.Body>
            <div className="border-top pt-2 assortments-images-container">
              <FormField
                control={form.control}
                name="innerItemLabel"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_itemLabel')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="innerUccLabel"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_uccLabel')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="innerItemUccLabel"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_uccItemLabel')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="innerCarton"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_innerCarton')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2" className="pb-4">
          <Accordion.Header className="text-uppercase">
            {t('keyImageSection_upcLabel')}
          </Accordion.Header>
          <Accordion.Body>
            <div className="border-top pt-2 assortments-images-container">
              <FormField
                control={form.control}
                name="upcLabelFront"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_frontUPCLabel')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="upcLabelBack"
                render={({ field }) => (
                  <ImageDropZone
                    label={t('keyImageType_backUPCLabel')}
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                )}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className="pb-4">
          <Accordion.Header className="text-uppercase">
            {t('keyImageSection_upcPlacement')}
          </Accordion.Header>
          <Accordion.Body>
            <FormField
              control={form.control}
              name="upcPlacement"
              render={({ field }) => (
                <div className="border-top pt-2">
                  <ImageDropZoneMulti
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                </div>
              )}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4" className="pb-4">
          <Accordion.Header className="text-uppercase">
            {t('keyImageSection_product')}
          </Accordion.Header>
          <Accordion.Body>
            <FormField
              control={form.control}
              name="productPictures"
              render={({ field }) => (
                <div className="border-top pt-2">
                  <ImageDropZoneMulti
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                </div>
              )}
            />
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5" className="pb-4">
          <Accordion.Header className="text-uppercase">
            {t('keyImageSection_protected')}
          </Accordion.Header>
          <Accordion.Body>
            <FormField
              control={form.control}
              name="protectivePackaging"
              render={({ field }) => (
                <div className="border-top pt-2">
                  <ImageDropZoneMulti
                    {...field}
                    assortmentId={assortment._id}
                    groupPcfImages={groupedImages}
                  />
                </div>
              )}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Form>
  );
}
