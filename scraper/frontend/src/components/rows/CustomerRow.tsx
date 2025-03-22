import { Icons } from "@/assets/icons";
import ImgFallback from "@/assets/img/image.webp";
import { QUERY_CUSTOMER_KEY } from "@/constant/query.constant";
import { STATIC_URL } from "@/constant/server.constant";
import { CustomerEntity } from "@/schema/customer.schema";
import { useBoundStore } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import AvatarContainer from "../container/AvatarContainer";
import ImageContainer from "../container/ImageContainer";

function CustomerRow(customer: CustomerEntity) {
  const queryClient = useQueryClient();
  queryClient.setQueryData([QUERY_CUSTOMER_KEY, customer.id], customer);

  const customerImage = STATIC_URL + "/customers/" + customer?.image_url;

  const {
    customer: { setToDeactivate },
    auth: { user },
  } = useBoundStore();

  function handleShow() {
    setToDeactivate(customer);
  }

  const isLoading = Boolean(
    queryClient.isMutating({
      mutationKey: [QUERY_CUSTOMER_KEY, customer.id],
    })
  );
  const lastScrapped = customer.last_scraped;

  const lastTimeScrapped = lastScrapped
    ? moment(lastScrapped).format("MMM DD, YYYY")
    : null;

  return (
    <>
      <tr className="hover-actions-trigger btn-reveal-trigger position-static">
        <td className="fs--1 align-middle ps-0 py-3">
          <div className="avatar avatar-xl border rounded-2 overflow-hidden">
            {customer.image_url ? (
              <ImageContainer
                src={customerImage}
                alt={customer.id}
                fallbackimg={ImgFallback}
              />
            ) : (
              <AvatarContainer name={customer.name ?? ""} />
            )}
          </div>
        </td>
        <td className="align-middle white-space-nowrap pe-5">
          <NavLink
            className="d-flex align-items-center fw-semi-bold text-uppercase"
            to={`/dashboard/customers/${customer.id}/view`}
          >
            <p className="mb-0 text-primary fw-bold"> {customer.name}</p>
          </NavLink>
        </td>
        <td className="align-middle white-space-nowrap pe-5 fw-bold">
          {customer.total_products ?? 0}
        </td>
        <td className="align-middle white-space-nowrap fw-semi-bold text-1000">
          {customer.website}
        </td>
        <td className="align-middle white-space-nowrap fw-bold ps-3 text-1100">
          {customer.frequency.name}
        </td>
        <td className="align-middle white-space-nowrap text-1000 ps-7">
          {lastTimeScrapped}
        </td>
        <td
          className={`align-middle white-space-nowrap fw-bold text-capitalize status-${customer.scrape_status}`}
        >
          {customer.scrape_status}
        </td>
        {user?.permission_id?.write ? (
          <td className="align-middle text-700 text-end">
            {isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                style={{ height: 16, width: 16 }}
              ></span>
            ) : (
              <Dropdown>
                <Dropdown.Toggle
                  variant="inherit"
                  id="dropdown-basic"
                  size="sm"
                >
                  <Icons.UEllipsisH height={16} width={16} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    as={NavLink}
                    to={`/dashboard/customers/${customer.id}/view`}
                  >
                    View
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="border-top"
                    as={NavLink}
                    to={`/dashboard/customers/${customer.id}/edit`}
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="text-danger border-top"
                    onClick={handleShow}
                  >
                    Deactive
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </td>
        ) : (
          <></>
        )}
      </tr>
    </>
  );
}

export default CustomerRow;
