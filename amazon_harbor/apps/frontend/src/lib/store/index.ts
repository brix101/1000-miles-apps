import { AuthSlice } from "./createAuthSlice";
import { DialogSlice } from "./createDialogSlice";
import { UISlice } from "./createUiSlice";

type UnionToIntersection<U> = (
  U extends infer T ? (k: T) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type StoreState = UnionToIntersection<UISlice | AuthSlice | DialogSlice>;
