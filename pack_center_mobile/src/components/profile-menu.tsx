import { useSession } from "@/providers/session-provider";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

export function ProfileMenu() {
  const { t } = useTranslation();
  const { signOut } = useSession();

  return (
    <Menu>
      <MenuTrigger>
        <MaterialIcons name="menu" size={24} color="black" />
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={signOut} text={t("keyButton_signout")} />
        {/* <MenuOption onSelect={() => alert(`Delete`)}>
          <Text style={{ color: "red" }}>Delete</Text>
        </MenuOption>
        <MenuOption
          onSelect={() => alert(`Not called`)}
          disabled={true}
          text="Disabled"
        /> */}
      </MenuOptions>
    </Menu>
  );
}
