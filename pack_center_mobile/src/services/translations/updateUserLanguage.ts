import { useMutation } from "@tanstack/react-query";
import * as z from "zod";

import { api } from "@/lib/axios-client";
import { MutationConfig } from "@/lib/react-query";
import { useSession } from "@/providers/session-provider";
import { useTranslation } from "react-i18next";
import { ToastAndroid } from "react-native";

export const updateUserLanguageSchema = z.object({
  _id: z.string(),
  language: z.string(),
});

export type UpdateUserLangugeDTO = z.infer<typeof updateUserLanguageSchema>;

export async function editUserLanguage(data: UpdateUserLangugeDTO) {
  return api.patch(`/users/${data._id}`, data, {});
}

type MutationFnType = typeof editUserLanguage;

export function useUpdateUserLanguage(
  options?: MutationConfig<MutationFnType>
) {
  const { t, i18n } = useTranslation();
  const { session, signIn } = useSession();

  return useMutation({
    ...options,
    onMutate: async ({ language }) => {
      if (session) {
        signIn({ ...session, language });
      }

      i18n.changeLanguage(language);
      ToastAndroid.show(t("keyMessage_languageChanged"), ToastAndroid.SHORT);
      return { prevState: session };
    },
    onError: (_err, _newTodo, context) => {
      if (context && context.prevState) {
        signIn(context.prevState);
      }
    },
    mutationFn: editUserLanguage,
  });
}
