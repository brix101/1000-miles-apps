import { Icons } from "@/assets/icons";
import img38 from "@/assets/img/spot-illustrations/38.webp";
import img38Dark from "@/assets/img/spot-illustrations/dark_38.webp";
import { QUERY_CLUSTERS_KEY } from "@/constant/query.constant";
import {
  ClustersEntity,
  CreateClusterInput,
  clusterSchema,
  createClusterSchema,
} from "@/schema/cluster.schema";
import { createClusterMutation } from "@/services/cluster.service";
import { useBoundStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { create } from "zustand";
import { Inputs } from "../inputs";

interface IWizardView {
  index: number;
  icon: JSX.Element;
  label: string;
  view: () => JSX.Element;
  done: boolean;
  complete: boolean;
  active: boolean;
}

interface SelectFacetState {
  selectedItems: string[];
  selectedValue: string;
  setSelectedItems: (newItems: string[]) => void;
  setSelectedValue: (newValue: string) => void;
  handleAddItem: () => void;
  handleRemoveItem: (item: string) => void;
  resetState: () => void;
}

interface NameState {
  name: string;
  setName: (name: string) => void;
}

const createStore = (initialState: Partial<SelectFacetState>) =>
  create<SelectFacetState>((set) => ({
    selectedItems: [],
    selectedValue: "",
    setSelectedItems: (newItems) => set({ selectedItems: newItems }),
    setSelectedValue: (newValue) => set({ selectedValue: newValue }),
    handleAddItem: () => {
      set((state) => ({
        selectedItems: state.selectedItems.includes(state.selectedValue)
          ? state.selectedItems
          : [...state.selectedItems, state.selectedValue],

        selectedValue: "",
      }));
    },
    handleRemoveItem: (value) => {
      set((state) => ({
        selectedItems: state.selectedItems.filter((item) => item !== value),
      }));
    },
    resetState: () => {
      set({
        selectedItems: [],
        selectedValue: "",
      });
    },
    ...initialState,
  }));

const useSelectCategoryFacetStore = createStore({
  selectedItems: [],
  selectedValue: "",
});

const useSelectCustomerFacetStore = createStore({
  selectedItems: [],
  selectedValue: "",
});

const useSelectTagFacetStore = createStore({
  selectedItems: [],
  selectedValue: "",
});

const useNameStore = create<NameState>((set) => ({
  name: "",
  setName: (name) => {
    set({ name });
  },
}));

const initialViews: IWizardView[] = [
  {
    index: 0,
    icon: <Icons.UCategories height={16} width={16} />,
    label: "Category",
    view: CategoryView,
    done: true,
    active: true,
    complete: false,
  },
  {
    index: 1,
    icon: <Icons.UUser height={16} width={16} />,
    label: "Customer",
    view: CustomerView,
    done: false,
    active: false,
    complete: false,
  },
  {
    index: 2,
    icon: <Icons.UTagAlt height={16} width={16} />,
    label: "Tag",
    view: TagView,
    done: false,
    active: false,
    complete: false,
  },
  {
    index: 3,
    icon: <Icons.FiInterests height={16} width={16} />,
    label: "Name",
    view: NameView,
    done: false,
    active: false,
    complete: false,
  },
  {
    index: 4,
    icon: <Icons.FiCheck height={16} width={16} />,
    label: "Done",
    view: DoneView,
    done: false,
    active: false,
    complete: false,
  },
];

interface WizardState {
  wizardViews: Array<IWizardView>;
  handlePreviousClick: () => void;
  handleNextClick: () => void;
  handleItemClick: (index: number) => void;
  resetItems: () => void;
  getActiveView: () => IWizardView | undefined;
  getLastIndex: () => number;
}

const useNavItemStore = create<WizardState>((set, get) => ({
  wizardViews: initialViews,
  handlePreviousClick: () =>
    set((state) => {
      const prev = state.wizardViews;
      const ActiveView = prev.find((navItem) => navItem.active);
      const activeIndex = ActiveView?.index ?? 0;

      return {
        ...state,
        wizardViews: prev.map((navItem) => {
          if (navItem.index === activeIndex) {
            return { ...navItem, active: false };
          }
          if (navItem.index === activeIndex - 1) {
            return { ...navItem, active: true };
          }
          return navItem;
        }),
      };
    }),
  handleNextClick: () =>
    set((state) => {
      const prev = state.wizardViews;
      const ActiveView = prev.find((navItem) => navItem.active);
      const activeIndex = ActiveView?.index ?? 0;

      return {
        ...state,
        wizardViews: prev.map((navItem) => {
          if (navItem.index === activeIndex) {
            return { ...navItem, complete: true, active: false };
          }
          if (navItem.index === activeIndex + 1) {
            return { ...navItem, done: true, active: true };
          }
          return navItem;
        }),
      };
    }),
  handleItemClick: (index) =>
    set((state) => {
      const prev = state.wizardViews;
      const ActiveView = prev.find((navItem) => navItem.active);
      const activeIndex = ActiveView?.index ?? 0;
      const item = prev.find((item) => item.index === index);

      return {
        ...state,
        wizardViews: item?.done
          ? prev.map((navItem) => {
              if (navItem.index === index) {
                return { ...navItem, active: true };
              }
              if (navItem.index === activeIndex) {
                return { ...navItem, active: false };
              }
              return navItem;
            })
          : prev,
      };
    }),
  resetItems: () => set((state) => ({ ...state, wizardViews: initialViews })),
  getActiveView: () => get().wizardViews.find((navItem) => navItem.active),
  getLastIndex: () =>
    get().wizardViews.reduce((highest, item) => {
      return item.index > highest ? item.index : highest;
    }, -1),
}));

export default function ClusterCreateModal() {
  const { isCreateOpen } = useBoundStore((state) => state.cluster);
  const { resetState: resetCategoryState } = useSelectCategoryFacetStore();
  const { resetState: resetCustomerState } = useSelectCustomerFacetStore();
  const { resetState: resetTagState } = useSelectTagFacetStore();
  const { setName } = useNameStore();

  const { wizardViews, handleItemClick, resetItems, getActiveView } =
    useNavItemStore();

  const ActiveView = getActiveView();

  function activeClassName(index: number): string | null {
    const classItem = [];
    const item = wizardViews.find((item) => item.index === index);
    if ((item?.active && !item?.done) || (item?.active && item?.done)) {
      classItem.push("active");
    } else if (!item?.active && item?.done && item?.complete) {
      classItem.push("done");
    }
    if (item?.complete) {
      classItem.push("complete");
    }

    return classItem.join(" ");
  }

  useEffect(() => {
    if (!isCreateOpen) {
      resetCategoryState();
      resetCustomerState();
      resetTagState();
      resetItems();
      setName("");
    }
  }, [
    isCreateOpen,
    resetCategoryState,
    resetCustomerState,
    resetTagState,
    resetItems,
    setName,
  ]);

  return (
    <Modal
      show={isCreateOpen}
      backdrop="static"
      keyboard={false}
      size="lg"
      className="theme-wizard"
    >
      <Modal.Header bsPrefix="card-header bg-100 pt-3 pb-2 border-bottom-0 rounded-top px-4">
        <ul className="nav justify-content-between nav-wizard">
          {wizardViews.map((item) => (
            <li className="nav-item" key={item.index}>
              <div
                className={`nav-link fw-semi-bold ${activeClassName(
                  item.index
                )}`}
                style={{
                  userSelect: "none",
                }}
              >
                <div
                  className="text-center d-inline-block"
                  onClick={() => handleItemClick(item.index)}
                >
                  <div className="nav-item-circle-parent">
                    <div className="nav-item-circle justify-content-center align-items-center">
                      {item.icon}
                    </div>
                  </div>
                  <span className="d-none d-md-block mt-1 fs--1">
                    {item.label}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Modal.Header>
      {ActiveView && <ActiveView.view />}
    </Modal>
  );
}

function CategoryView() {
  const {
    selectedItems,
    selectedValue,
    setSelectedValue,
    handleAddItem,
    handleRemoveItem,
  } = useSelectCategoryFacetStore();
  const { handleNextClick } = useNavItemStore();
  const { setCreateOpen } = useBoundStore((state) => state.cluster);

  function handleCancelClick() {
    setCreateOpen(false);
  }
  return (
    <>
      <Modal.Body>
        <div className="mb-3 row">
          <div className="col-10">
            <div className="text-start w-100">
              <Inputs.SelectFacet
                placeholder="Select category"
                value={selectedValue}
                selectedItems={selectedItems}
                onSelectItem={(e) => setSelectedValue(e)}
              />
            </div>
          </div>
          <div className="col-2">
            <button
              className="btn btn-primary float-end w-full white-space-nowrap w-full"
              type="button"
              onClick={handleAddItem}
              disabled={selectedValue === ""}
            >
              Add
            </button>
          </div>
        </div>
        <div
          className="form-control scrollbar-overlay"
          style={{
            backgroundColor: "var(--phoenix-body-bg)",
            height: "20rem",
          }}
        >
          {selectedItems.sort().map((item, index) => (
            <div className="badge badge-tag-custom-2 me-1 mb-1" key={index}>
              <span className="m-1">{item}</span>
              <button
                className="btn-icon-custom"
                onClick={() => handleRemoveItem(item)}
              >
                <Icons.UMultiply height={12} width={12} />
              </button>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer bsPrefix="card-footer border-top-0 p-4">
        <div className={`pager wizard list-inline mb-0 d-flex`}>
          <button
            className="btn btn-link ps-0"
            type="button"
            onClick={handleCancelClick}
          >
            <Icons.FiChevronLeft
              className="svg-inline--fa fa-chevron-right ms-1"
              height={16}
              width={16}
            />
            Cancel
          </button>
          <div className="flex-1 text-end">
            <button
              className="btn btn-primary px-6 px-sm-6"
              type="submit"
              onClick={handleNextClick}
            >
              Next
              <Icons.FiChevronRight
                className="svg-inline--fa fa-chevron-right ms-1"
                height={16}
                width={16}
              />
            </button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
}

function CustomerView() {
  const {
    selectedItems,
    selectedValue,
    setSelectedValue,
    handleAddItem,
    handleRemoveItem,
  } = useSelectCustomerFacetStore();

  const { handleNextClick, handlePreviousClick } = useNavItemStore();

  return (
    <>
      <Modal.Body>
        <div className="mb-3 row">
          <div className="col-10">
            <div className="text-start w-100">
              <Inputs.SelectFacet
                facet="customer_name"
                placeholder="Select customer"
                value={selectedValue}
                selectedItems={selectedItems}
                onSelectItem={(e) => setSelectedValue(e)}
              />
            </div>
          </div>
          <div className="col-2">
            <button
              className="btn btn-primary float-end w-full white-space-nowrap w-full"
              type="button"
              onClick={handleAddItem}
              disabled={selectedValue === ""}
            >
              Add
            </button>
          </div>
        </div>
        <div
          className="form-control scrollbar-overlay"
          style={{
            backgroundColor: "var(--phoenix-body-bg)",
            height: "20rem",
          }}
        >
          {selectedItems.sort().map((item, index) => (
            <div className="badge badge-tag-custom me-1 mb-1" key={index}>
              <span className="m-1">{item}</span>
              <button
                className="btn-icon-custom"
                onClick={() => handleRemoveItem(item)}
              >
                <Icons.UMultiply height={12} width={12} />
              </button>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer bsPrefix="card-footer border-top-0 p-4">
        <div className={`pager wizard list-inline mb-0 d-flex`}>
          <button
            className="btn btn-link ps-0"
            type="button"
            onClick={handlePreviousClick}
          >
            <Icons.FiChevronLeft
              className="svg-inline--fa fa-chevron-right ms-1"
              height={16}
              width={16}
            />
            Previous
          </button>
          <div className="flex-1 text-end">
            <button
              className="btn btn-primary px-6 px-sm-6"
              type="submit"
              onClick={handleNextClick}
            >
              Next
              <Icons.FiChevronRight
                className="svg-inline--fa fa-chevron-right ms-1"
                height={16}
                width={16}
              />
            </button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
}

function TagView() {
  const {
    selectedItems,
    selectedValue,
    setSelectedValue,
    handleAddItem,
    handleRemoveItem,
  } = useSelectTagFacetStore();

  const { handleNextClick, handlePreviousClick } = useNavItemStore();

  return (
    <>
      <Modal.Body>
        <div className="mb-3 row">
          <div className="col-10">
            <div className="text-start w-100">
              <Inputs.SelectFacet
                facet="tags"
                placeholder="Select tag"
                value={selectedValue}
                selectedItems={selectedItems}
                onSelectItem={(e) => setSelectedValue(e)}
              />
            </div>
          </div>
          <div className="col-2">
            <button
              className="btn btn-primary float-end w-full white-space-nowrap w-full"
              type="button"
              onClick={handleAddItem}
              disabled={selectedValue === ""}
            >
              Add
            </button>
          </div>
        </div>
        <div
          className="form-control scrollbar-overlay"
          style={{
            backgroundColor: "var(--phoenix-body-bg)",
            height: "20rem",
          }}
        >
          {selectedItems.sort().map((item, index) => (
            <div className="badge badge-tag-custom me-1 mb-1" key={index}>
              <span className="m-1">{item}</span>
              <button
                className="btn-icon-custom"
                onClick={() => handleRemoveItem(item)}
              >
                <Icons.UMultiply height={12} width={12} />
              </button>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer bsPrefix="card-footer border-top-0 p-4">
        <div className={`pager wizard list-inline mb-0 d-flex`}>
          <button
            className="btn btn-link ps-0"
            type="button"
            onClick={handlePreviousClick}
          >
            <Icons.FiChevronLeft
              className="svg-inline--fa fa-chevron-right ms-1"
              height={16}
              width={16}
            />
            Previous
          </button>
          <div className="flex-1 text-end">
            <button
              className="btn btn-primary px-6 px-sm-6"
              type="submit"
              onClick={handleNextClick}
            >
              Next
              <Icons.FiChevronRight
                className="svg-inline--fa fa-chevron-`right ms-1"
                height={16}
                width={16}
              />
            </button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
}

function NameView() {
  const queryClient = useQueryClient();
  const { handleNextClick, handlePreviousClick } = useNavItemStore();
  const { selectedItems: selectedCategories } = useSelectCategoryFacetStore();
  const { selectedItems: selectedCustomers } = useSelectCustomerFacetStore();
  const { selectedItems: selectedTags } = useSelectTagFacetStore();
  const { name, setName } = useNameStore();

  const form = useForm<CreateClusterInput>({
    resolver: zodResolver(createClusterSchema),
    defaultValues: {
      categories: selectedCategories,
      customers: selectedCustomers,
      tags: selectedTags,
      name: name,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createClusterMutation,
    onSuccess: (response) => {
      const parsedResponse = clusterSchema.parse(response.data);
      queryClient.setQueriesData([QUERY_CLUSTERS_KEY], (prev: unknown) => {
        const { clusters } = prev as ClustersEntity;

        return {
          clusters: [parsedResponse, ...clusters],
        };
      });
      handleNextClick();
    },
    onError: (error: AxiosError) => {
      console.log({ error });
    },
  });

  function onSubmit(values: CreateClusterInput) {
    mutate({ ...values, name });
  }

  return (
    <>
      <Modal.Body>
        <Controller
          name="name"
          control={form.control}
          defaultValue=""
          render={({ field: { onChange, ...rest }, fieldState: { error } }) => (
            <Inputs.Primary
              label="name"
              placeholder="Select name"
              error={error}
              {...rest}
              onChange={(e) => {
                const value = e.target.value;
                setName(value);
                onChange(value);
              }}
            />
          )}
        />
        <div
          style={{
            height: "19.5rem",
          }}
        ></div>
      </Modal.Body>
      <Modal.Footer bsPrefix="card-footer border-top-0 p-4">
        <div className={`pager wizard list-inline mb-0 d-flex`}>
          <button
            className="btn btn-link ps-0"
            type="button"
            onClick={handlePreviousClick}
            disabled={isLoading}
          >
            <Icons.FiChevronLeft
              className="svg-inline--fa fa-chevron-right ms-1"
              height={16}
              width={16}
            />
            Previous
          </button>
          <div className="flex-1 text-end">
            <button
              className="btn btn-primary px-6 px-sm-6"
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <span className="px-2">Next</span>
              {isLoading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  style={{ height: 14, width: 14 }}
                ></span>
              ) : (
                <Icons.FiChevronRight
                  className="svg-inline--fa fa-chevron-right ms-1"
                  height={16}
                  width={16}
                />
              )}
            </button>
          </div>
        </div>
      </Modal.Footer>
    </>
  );
}

function DoneView() {
  const { setCreateOpen } = useBoundStore((state) => state.cluster);

  return (
    <Modal.Body>
      <div
        className="row flex-center pb-8 pt-4 gx-3 gy-4"
        style={{ height: "20rem" }}
      >
        <div className="col-12 col-sm-auto">
          <div className="text-center text-sm-start">
            <img className="d-dark-none" src={img38} alt="" width="220" />
            <img className="d-light-none" src={img38Dark} alt="" width="220" />
          </div>
        </div>
        <div className="col-12 col-sm-auto">
          <div className="text-center text-sm-start">
            <h5 className="mb-3">You are all set!</h5>
            <p className="text-1100 fs--1">Cluster created</p>
            <button
              className="btn btn-primary px-6"
              onClick={() => setCreateOpen(false)}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </Modal.Body>
  );
}
