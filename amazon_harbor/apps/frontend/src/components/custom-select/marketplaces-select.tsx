import useGetMarketplaces from "@/hooks/queries/useGetMarketplaces";
import { SelectOption } from "@/types";
import { ActionMeta, SingleValue } from "react-select";
import AsyncSelect from "react-select/async";

interface Props {
  isDisabled?: boolean;
  value: string;
  onChange: (
    newValue: SingleValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
}

export function Marketplaceselect({ value, onChange }: Props) {
  const { data, isLoading } = useGetMarketplaces();

  const defaultOptions: SelectOption[] =
    data?.map(({ marketplaceId, country }) => ({
      value: marketplaceId,
      // label: `${sellersAccount} - ${country}`,
      label: country,
    })) ?? [];

  const filterColors = (inputValue: string) => {
    return defaultOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 500);
    });

  const selectedOptions = defaultOptions.find((item) => value === item.value);

  return (
    <AsyncSelect
      isClearable={false}
      isLoading={isLoading}
      defaultOptions={defaultOptions}
      loadOptions={promiseOptions}
      placeholder="Select ..."
      value={selectedOptions}
      onChange={onChange}
      className="capitalize"
    />
  );
}
