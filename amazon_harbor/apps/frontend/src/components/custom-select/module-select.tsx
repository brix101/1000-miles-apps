import useGetModules from "@/hooks/queries/useGetModules";
import { SelectOption } from "@/types";
import { ActionMeta, MultiValue } from "react-select";
import AsyncSelect from "react-select/async";

interface Props {
  isDisabled?: boolean;
  value: string[];
  onChange: (
    newValue: MultiValue<SelectOption>,
    actionMeta: ActionMeta<SelectOption>
  ) => void;
}

export function ModuleSelect({ value, onChange }: Props) {
  const { data, isLoading } = useGetModules();

  const defaultOptions: SelectOption[] =
    data?.map((module) => ({ value: module._id, label: module.name })) ?? [];

  const filterModules = (inputValue: string) => {
    return defaultOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterModules(inputValue));
      }, 500);
    });

  const selectedOptions = defaultOptions.filter((item) =>
    value.includes(item.value)
  );

  return (
    <AsyncSelect
      isMulti
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
