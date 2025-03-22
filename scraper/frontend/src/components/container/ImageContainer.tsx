import imgFallback from "@/assets/img/avatar.webp";

function ImageContainer(
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    fallbackimg?: string;
  }
) {
  const addImageFallback = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = props.fallbackimg || imgFallback;
  };
  return <img {...props} onError={addImageFallback} />;
}

export default ImageContainer;
