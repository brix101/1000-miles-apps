import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export default () => {
  const queryClient = useQueryClient();
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket("wss://echo.websocket.org/");
    websocket.onopen = () => {
      console.log("connected");
    };

    websocketRef.current = websocket;

    return () => {
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        websocketRef.current.close();
      }
    };
  }, [queryClient]);
};
