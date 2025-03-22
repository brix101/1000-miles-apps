import { Ref, forwardRef } from "react";
import type { SearchBoxProps } from "react-instantsearch-hooks-web";
import { SearchBox } from "react-instantsearch-hooks-web";

type SearchProps = React.ComponentProps<typeof SearchBox>;

let timerId: ReturnType<typeof setTimeout> | undefined;
const timeout = 500;

const queryHook: SearchBoxProps["queryHook"] = (query, search) => {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => search(query), timeout);
};

const SearchInput = forwardRef<HTMLDivElement, SearchProps>(
  (props: SearchProps, ref: Ref<HTMLDivElement>) => {
    return (
      <SearchBox
        ref={ref}
        queryHook={queryHook}
        autoFocus
        classNames={{
          root: "position-relative",
          form: "position-relative",
          input: "form-control search-input search",
        }}
        //   searchAsYouType={false}
        //   loadingIconComponent={({ classNames }) => (
        //     <div className={classNames.loadingIcon}>Loading</div>
        //   )}
        //   resetIconComponent={({ classNames }) => (
        //     <div className={classNames.resetIcon}>Reset</div>
        //   )}
        submitIconComponent={({ classNames }) => (
          <div className={classNames.submitIcon}>Submit</div>
        )}
        {...props}
      />
    );
  }
);

export default SearchInput;
