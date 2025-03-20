import { useStorageState } from "@/hooks/useStorageState";
import { Language } from "@/i18n/config";
import { UserResource } from "@/schema/user";
import React from "react";
import { useTranslation } from "react-i18next";

const AuthContext = React.createContext<{
  signIn: (values: UserResource) => void;
  signOut: () => void;
  session?: UserResource | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function SessionProvider(props: React.PropsWithChildren) {
  const { i18n } = useTranslation();
  const [[isLoading, session], setSession] = useStorageState("session-live");

  React.useEffect(() => {
    if (session) {
      const user = JSON.parse(session);
      const userLang = (user?.language as Language) ?? "en";
      if (i18n.language !== userLang) {
        i18n.changeLanguage(userLang);
      }
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        signIn: (data) => {
          setSession(JSON.stringify(data));
        },
        signOut: () => {
          setSession(null);
        },
        session: session ? JSON.parse(session) : null,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}
