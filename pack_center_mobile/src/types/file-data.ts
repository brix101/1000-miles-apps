export interface FileData {
  _id: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  filename: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export type PcfImage = {
  _id: string;
  field: string;
  isApproved: boolean;
  sequence: 0;
  barcodeErrors: string[];
  fileData: FileData;
  createdAt: string;
  updatedAt: string;
};
