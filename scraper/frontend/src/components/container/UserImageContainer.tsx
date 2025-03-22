import { Icons } from "@/assets/icons";
import ImageContainer from "@/components/container/ImageContainer";
import { STATIC_URL } from "@/constant/server.constant";
import { useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

interface Props {
  selectedFile?: File | null;
  setSelectedFile?: React.Dispatch<React.SetStateAction<File | null>>;
  image_url?: string | null;
  disabled?: boolean;
}

function UserImageContainer({
  selectedFile,
  setSelectedFile,
  image_url,
  disabled,
}: Props) {
  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (file && setSelectedFile) {
        setSelectedFile(file);
      }
    },
    [setSelectedFile]
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".jpeg", ".png"],
    },
    disabled,
  });

  const borderClass = () => {
    if (isDragActive && isDragAccept) {
      return "border-success";
    } else if (isDragActive && isDragReject) {
      return "border-danger";
    } else {
      return "";
    }
  };
  const borderColor = borderClass();

  const handleRemoveClick = () => {
    if (setSelectedFile) {
      setSelectedFile(null);
    }
  };

  const userImage = STATIC_URL + "/users/" + image_url;
  const fileImage = selectedFile
    ? URL.createObjectURL(selectedFile)
    : userImage;

  return (
    <div className="position-relative">
      <div
        {...getRootProps({
          className: `dropzone border avatar avatar-5xl profile-container ${borderColor} ${
            !disabled ? "cursor-pointer" : ""
          }`,
        })}
      >
        <input {...getInputProps()} />
        {image_url || selectedFile ? (
          <ImageContainer
            className="img-fluid img-thumbnail rounded-circle"
            src={fileImage}
            alt="Preview"
          />
        ) : (
          <div
            className="text-center text-600 p-5"
            data-dz-message="data-dz-message"
          >
            Drag the photo here
            <span className="text-800 p-1">or</span>
            <button className="btn btn-link p-0" type="button">
              Browse
            </button>
            <br />
            <Icons.UImagePlus className="mt-3 me-2" width={50} height={50} />
          </div>
        )}
      </div>
      {selectedFile && (
        <button
          className="btn-icon-custom d-flex justify-content-center align-items-center"
          onClick={handleRemoveClick}
          style={{
            position: "absolute",
            top: "0.25rem",
            right: "0.25rem",
          }}
        >
          <Icons.UMultiply height={12} width={12} />
        </button>
      )}
    </div>
  );
}

export default UserImageContainer;
