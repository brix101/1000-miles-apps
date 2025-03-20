import useGetBrands from "@/hooks/queries/useGetBrands";
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

export function BrandSelect({ value, onChange }: Props) {
  const { data, isLoading } = useGetBrands();

  const defaultOptions: SelectOption[] =
    data?.map((brand) => ({
      value: brand.name.toUpperCase(),
      label: brand.name.toUpperCase(),
    })) ?? [];

  const filterBrands = (inputValue: string) => {
    return defaultOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterBrands(inputValue));
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
