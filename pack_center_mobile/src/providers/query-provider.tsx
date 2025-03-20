import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { onlineManager } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React from "react";

import { log } from "@/lib/logger";
import { queryClient } from "@/lib/react-query";

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

export const OnlineStatusContext = React.createContext<Boolean>(true);

export function QueryProvider(props: React.PropsWithChildren) {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    return NetInfo.addEventListener((state) => {
      const status = !!state.isConnected;
      setIsOnline(status);
      onlineManager.setOnline(status);
    });
  }, []);

  log.info(
    `[${
      isOnline ? "ONLINE" : "OFFLINE"
    }] +++++++++++++++++++++++++++++++++++++++++++++++++++++`
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() =>
        queryClient
          .resumePausedMutations()
          .then(() => queryClient.invalidateQueries())
      }
    >
      <OnlineStatusContext.Provider value={isOnline}>
        {props.children}
      </OnlineStatusContext.Provider>
    </PersistQueryClientProvider>
  );
}

export function useOnlineStatus() {
  const context = React.useContext(OnlineStatusContext);
  if (context === undefined) {
    throw new Error(
      "useOnlineStatus must be used within a OnlineStatusProvider"
    );
  }
  return context;
}
