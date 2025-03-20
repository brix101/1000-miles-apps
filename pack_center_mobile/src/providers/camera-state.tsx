import React, { createContext, useContext, useState } from "react";

// Define the context type
interface CameraContextType {
  cameraOpen: boolean;
  setCameraOpen: (open: boolean) => void;
}

// Define the context
const CameraContext = createContext<CameraContextType | undefined>(undefined);

// Define the provider
export function CameraProvider(props: React.PropsWithChildren) {
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <CameraContext.Provider value={{ cameraOpen, setCameraOpen }}>
      {props.children}
    </CameraContext.Provider>
  );
}

// Define a hook for easy access to the context
export const useCameraState = (): CameraContextType => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error("useCamera must be used within a CameraProvider");
  }
  return context;
};
