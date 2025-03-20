import useGetShipmentStatuses from "@/hooks/queries/useGetShipmentStatuses";
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

export function ShipmentStatusSelect({ value, onChange }: Props) {
  const { data, isLoading } = useGetShipmentStatuses();

  const defaultOptions = data ?? [];

  const filter = (inputValue: string) => {
    return defaultOptions.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<SelectOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filter(inputValue));
      }, 500);
    });

  const selectedOptions = defaultOptions.filter((item) =>
    value.includes(item.value)
  );

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
