import { Icons } from "@/assets/icons";
import ImageContainer from "@/components/container/ImageContainer";
import { Inputs } from "@/components/inputs";
import { STATIC_URL } from "@/constant/server.constant";
import { UserEntity } from "@/schema/user.schema";
import { useBoundStore } from "@/store";
import { Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import AvatarContainer from "../container/AvatarContainer";

function UserRow({ user }: { user: UserEntity }) {
  const {
    user: { selectedUser },
    addToSelectedUser,
    removeToSelectedUser,
    addToDeactivateUser,
  } = useBoundStore();
  const userImage = STATIC_URL + "/users/" + user.image_url;

  function handleDeactivateClick() {
    addToDeactivateUser([user.id ?? ""]);
  }

  const isCheck = selectedUser.includes(user.id || "");
  function setCheckUser() {
    if (isCheck) {
      removeToSelectedUser([user.id || ""]);
    } else {
      addToSelectedUser([user.id || ""]);
    }
  }

  return (
    <>
      <tr className="hover-actions-trigger btn-reveal-trigger position-static">
        <td className="fs--1 align-middle ps-0 py-3">
          <div className="form-check mb-0 fs-0">
            <Inputs.Check
              className="form-check-input"
              checked={isCheck}
              onChange={setCheckUser}
            />
          </div>
        </td>
        <td className="customer align-middle white-space-nowrap">
          <NavLink
            className="d-flex align-items-center text-900 text-hover-1000"
            to={`/dashboard/users/${user.id}/view`}
          >
            <div className="avatar avatar-m border rounded-circle overflow-hidden">
              {user.image_url ? (
                <ImageContainer src={userImage} alt={user.id} />
              ) : (
                <AvatarContainer name={user.name ?? ""} />
              )}
            </div>
            <h6 className="mb-0 ms-3 fw-semi-bold">{user.name}</h6>
          </NavLink>
        </td>
        <td className="email align-middle white-space-nowrap">
          <a className="fw-semi-bold" href={`mailto:${user.email}`}>
            {user.email}
          </a>
        </td>
        <td className="mobile_number align-middle white-space-nowrap">
          {user.role_id?.name}
        </td>
        <td className="align-middle white-space-nowrap text-success text-capitalize">
          {user.status}
        </td>
        <td className="align-middle text-700 text-capitalize">
          {user.permission_id?.name}
        </td>
        <td className="joined align-middle white-space-nowrap text-700 text-center">
          <Dropdown>
            <Dropdown.Toggle variant="inherit" id="dropdown-basic" size="sm">
              <Icons.UEllipsisH height={16} width={16} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                as={NavLink}
                to={`/dashboard/users/${user.id}/view`}
              >
                View
              </Dropdown.Item>
              <Dropdown.Item
                className="border-top"
                as={NavLink}
                to={`/dashboard/users/${user.id}/edit`}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="text-danger border-top"
                as={"button"}
                type="button"
                onClick={handleDeactivateClick}
              >
                Deactive
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
      </tr>
    </>
  );
}

export default UserRow;
