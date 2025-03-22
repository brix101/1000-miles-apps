import { Icons } from "@/assets/icons";
import CustomerImageContainer from "@/components/container/CustomerImageContainer";
import { Inputs } from "@/components/inputs";
import LoadingContent from "@/components/loader/LoadingContent";
import {
  QUERY_CUSTOMERS_KEY,
  QUERY_CUSTOMER_KEY,
} from "@/constant/query.constant";
import { STATIC_URL } from "@/constant/server.constant";
import {
  CustomersEntity,
  UpdateCustomerInput,
  customerSchema,
  updateCustomerSchema,
} from "@/schema/customer.schema";
import { ResponseError } from "@/schema/error.schema";
import { useQueryCountries } from "@/services/country.service";
import { useQueryCurrencies } from "@/services/currency.service";
import {
  updateCustomerMutation,
  useQueryCustomer,
} from "@/services/customer.service";
import { useQueryCustomerTypes } from "@/services/customerType.service";
import { useQueryLanguges } from "@/services/language.service";
import { useQueryFrequencies } from "@/services/scrapingFrequency.service";
import searchClient from "@/utils/searchClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function EditCustomer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { customerId } = useParams();
  const {
    data: customerData,
    isLoading: isCustomerLoading,
    error,
  } = useQueryCustomer(customerId ?? "");

  const { data: countriesData, isLoading: isCountriesLoading } =
    useQueryCountries();
  const { data: currenciesData, isLoading: isCurrenciesLoading } =
    useQueryCurrencies();
  const { data: customerTypesData, isLoading: isCustomerTypesLoading } =
    useQueryCustomerTypes();
  const { data: languagesData, isLoading: isLanguagesLoading } =
    useQueryLanguges();
  const { data: frequenciesData, isLoading: isFrequenciesLoading } =
    useQueryFrequencies();

  const {
    handleSubmit,
    register,
    watch,
    clearErrors,
    reset,
    control,
    formState: { isDirty },
  } = useForm<UpdateCustomerInput>({
    resolver: zodResolver(updateCustomerSchema),
  });

  const { mutate, isLoading: isMutateLoading } = useMutation({
    mutationFn: updateCustomerMutation,
    onSuccess: (response) => {
      const customer = customerSchema.parse(response.data);
      queryClient.setQueryData([QUERY_CUSTOMER_KEY, customerId], {
        ...customer,
      });
      queryClient.setQueriesData([QUERY_CUSTOMERS_KEY], (prev: unknown) => {
        const { customers } = prev as CustomersEntity;
        const upatedCustomers = customers.map((item) => {
          if (item.id === customer.id) {
            return customer;
          }
          return item;
        });

        return { customers: upatedCustomers };
      });
      searchClient.clearCache();
      toast.success("Customer Updated");
    },
    onError: ({ response }: AxiosError) => {
      if (response) {
        const responseError = response as ResponseError;

        toast(responseError.data.detail);
        console.log(responseError);
      }
    },
  });

  function onSubmit(values: UpdateCustomerInput) {
    mutate(values);
  }

  const requiredLogin = watch("require_login");
  useEffect(() => {
    if (!requiredLogin) {
      clearErrors(["username", "password"]);
    }
  }, [requiredLogin, clearErrors]);

  useEffect(() => {
    if (customerData) {
      reset({
        ...customerData,
        type: customerData.type.id ?? "",
        country: customerData.country.id ?? "",
        language: customerData.language.id ?? "",
        currency: customerData.currency.id ?? "",
        frequency: customerData.frequency.id ?? "",
        username: customerData.username ?? undefined,
        password: customerData.password ?? undefined,
        spider_name: customerData.spider_name ?? "",
        spider_code: customerData.spider_code ?? "",
      });

      const fileURL = `${STATIC_URL}/codes/${customerId}.txt`;

      const fetchData = async () => {
        try {
          const response = await fetch(fileURL);
          if (!response.ok) {
            throw new Error("Error reading file");
          }
          const fileContent = await response.text();
          reset((prev) => ({ ...prev, spider_code: fileContent }));
        } catch (error) {
          console.error("Error reading file:", error);
        }
      };

      fetchData();
    }
  }, [customerData, reset, customerId]);

  if (isCustomerLoading) {
    return <LoadingContent />;
  }

  if (error) {
    toast.error("Customer not found");
    navigate("/dashboard/customers");
  }

  return (
    <>
      <form className="mb-9" onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-3 flex-between-end mb-5">
          <div className="col-auto">
            <h2 className="mb-2">Edit customer</h2>
          </div>
          <div className="col-auto">
            <button
              className="btn btn-danger me-2 mb-2 mb-sm-0"
              type="button"
              onClick={() => {
                isDirty ? reset() : navigate("/dashboard/customers");
              }}
              disabled={isMutateLoading}
            >
              {isDirty ? (
                <>
                  <span className="px-2">Discard</span>
                </>
              ) : (
                <>
                  <Icons.FiChevronLeft height={16} width={16} />
                  <span className="px-2">Cancel</span>
                </>
              )}
            </button>
            <button
              className="btn btn-primary mb-2 mb-sm-0"
              type="submit"
              disabled={isMutateLoading}
            >
              <span className="px-2">Update</span>
              {isMutateLoading ? (
                <span
                  className="spinner-border spinner-border-sm "
                  style={{ height: 16, width: 16 }}
                ></span>
              ) : (
                <>
                  <Icons.FiChevronRight height={16} width={16} />
                </>
              )}
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-xl-6 px-2">
            <div className="row g-2">
              <div className="col-12 col-xl-12">
                <div className="card mb-2">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-12 col-sm-5 position-relative d-flex justify-content-center">
                        <Controller
                          name="file"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <CustomerImageContainer
                              selectedFile={value}
                              setSelectedFile={(e) => onChange(e)}
                              image_url={customerData?.image_url}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-sm-7">
                        <div className="mb-2">
                          <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <Inputs.Primary
                                label="Customer name"
                                placeholder="Customer name"
                                type="text"
                                error={error}
                                {...field}
                              />
                            )}
                          />
                        </div>
                        <div className="mb-2">
                          <Controller
                            name="type"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <Inputs.Select
                                label="Customer type"
                                placeholder="Select customer type"
                                isLoading={isCustomerTypesLoading}
                                error={error}
                                options={customerTypesData?.customerTypes.map(
                                  (customerType) => ({
                                    value: customerType.id as string,
                                    label: customerType.name,
                                  })
                                )}
                                {...field}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-12">
                <div className="card">
                  <div className="card-body">
                    <div className="mb-2">
                      <Controller
                        name="website"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Primary
                            label="Website"
                            placeholder="http://www.example.com"
                            type="text"
                            error={error}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="row mb-2">
                      <div className="col-12 col-sm-6">
                        <Controller
                          name="country"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <Inputs.Select
                              label="Country"
                              placeholder="Select country"
                              isLoading={isCountriesLoading}
                              error={error}
                              options={countriesData?.countries.map(
                                (country) => ({
                                  value: country.id as string,
                                  label: country.short_name,
                                })
                              )}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-sm-6">
                        <Controller
                          name="language"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <Inputs.Select
                              label="Langauge"
                              placeholder="Select language"
                              isLoading={isLanguagesLoading}
                              error={error}
                              options={languagesData?.languages.map(
                                (language) => ({
                                  value: language.id as string,
                                  label: language.name,
                                })
                              )}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-12 col-sm-6">
                        <Controller
                          name="currency"
                          control={control}
                          render={({ field, fieldState: { error } }) => (
                            <Inputs.Select
                              label="Currency"
                              placeholder="Select currency"
                              isLoading={isCurrenciesLoading}
                              error={error}
                              options={currenciesData?.currencies.map(
                                (currency) => ({
                                  value: currency.id as string,
                                  label: currency.code + " " + currency.symbol,
                                })
                              )}
                              {...field}
                            />
                          )}
                        />
                      </div>
                      <div className="col-12 col-sm-6 text-start">
                        <label className="form-label">markup</label>
                        <div className="form-icon-container">
                          <input
                            className="form-control custom-padding-right"
                            type="number"
                            placeholder="Markup"
                            min="0"
                            max="1000"
                            step="any"
                            {...register("markup", { valueAsNumber: true })}
                          />
                          <OverlayTrigger
                            placement={"top"}
                            trigger={"focus"}
                            overlay={
                              <Popover id="popover-basic">
                                <Popover.Header
                                  as="h3"
                                  className="text-capitalize"
                                >
                                  markup
                                </Popover.Header>
                                <Popover.Body>
                                  Percentage of the markup that the customer
                                  sell our products.
                                </Popover.Body>
                              </Popover>
                            }
                          >
                            <button
                              className="btn form-icon-right btn-icon btn-link"
                              type="button"
                            >
                              <Icons.UInforCircle
                                className="info-circle"
                                width={20}
                                height={20}
                              />
                            </button>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </div>

                    <div className="mb-2">
                      <Controller
                        name="frequency"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Select
                            label="Scraping frequency"
                            placeholder="Select scraping frequency"
                            isLoading={isFrequenciesLoading}
                            error={error}
                            options={frequenciesData?.frequencies.map(
                              (frequency) => ({
                                value: frequency.id as string,
                                label: frequency.name,
                              })
                            )}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="mb-2">
                      <Controller
                        name="spider_name"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Primary
                            label="Spider name"
                            placeholder="Spider name"
                            type="text"
                            error={error}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="row flex-between-center">
                      <div className="col-auto">
                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            {...register("require_login")}
                          />
                          <label
                            className="form-check-label mb-0"
                            htmlFor="basic-checkbox"
                          >
                            Website requires login details
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <Controller
                        name="username"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Primary
                            label="Email address"
                            placeholder="john.doe@example.com"
                            disabled={!watch("require_login")}
                            leftIcon={
                              <Icons.UUser className="text-900 fs--1 form-icon" />
                            }
                            error={error}
                            {...field}
                          />
                        )}
                      />
                    </div>
                    <div className="mb-2">
                      <Controller
                        name="password"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <Inputs.Password
                            label="Password"
                            placeholder="Password"
                            disabled={!watch("require_login")}
                            error={error}
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-6 px-2">
            <div className="row g-2">
              <div className="col-12 col-xl-12">
                <div className="card mb-2 h-100">
                  <div className="card-body">
                    <label className="form-label">Scrappy Code</label>
                    <textarea
                      className="form-control textarea-no-resize scrollbar-overlay"
                      rows={40}
                      {...register("spider_code")}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default EditCustomer;
