import { Icons } from "@/assets/icons";
import { NestedCategoryEntity } from "@/schema/category.schema";
import { useBoundStore } from "@/store";
import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { CustomToggle } from "../CustomToggle";

interface Props {
  category: NestedCategoryEntity;
  isPrimary?: boolean;
}

function CategoryAccordion({ category, isPrimary }: Props) {
  const {
    category: { setToRemove, setToUpdate, setToUpdateParent },
  } = useBoundStore();
  const [isOpen, setOpen] = useState(false);
  const hasChildren = category.sub.length > 0;
  // const level = category.level ?? 0;

  function handleOpenChild() {
    if (hasChildren) {
      setOpen((prev) => !prev);
    }
  }

  function handleOpenAddSubCategory() {
    setToUpdateParent(category);
  }

  function handleOpenEditCategory() {
    setToUpdate(category);
  }

  function handleRemoveCategory() {
    setToRemove(category);
  }

  function handleCategoryClick() {
    setToUpdateParent(category);
  }
  return (
    <div className="nav-item-wrapper">
      <div
        className={
          "nav-link dropdown-indicator label-1 row d-flex justify-content-between text-dark border-bottom  py-2"
        }
      >
        <div
          className="d-flex align-items-center col-10"
          style={{ userSelect: "none", cursor: hasChildren ? "pointer" : "" }}
        >
          <div
            className={`d-flex justify-content-center align-items-center ${
              hasChildren ? "btn btn-icon btn-phoenix-primary" : ""
            }`}
            onClick={handleOpenChild}
            style={{ width: "20px", height: "20px" }}
          >
            <Icons.UCaretRight
              width={8}
              height={8}
              className={`rotate-animate ${isOpen ? "rotate-90" : ""} ${
                !hasChildren ? "d-none" : ""
              }`}
            />
          </div>
          <a
            className="fw-bold line-clamp-3 mb-0 px-2"
            href="#!"
            onClick={handleCategoryClick}
          >
            {category.category}
          </a>
        </div>
        <div className="col-1 d-none">
          {isPrimary ? (
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} variant="inherit" size="sm">
                <Icons.UEllipsisH height={16} width={16} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  as={"button"}
                  type="button"
                  onClick={handleOpenAddSubCategory}
                >
                  Update Sub Category
                </Dropdown.Item>
                <Dropdown.Item
                  className="border-top"
                  as={"button"}
                  type="button"
                  onClick={handleOpenEditCategory}
                >
                  Edit
                </Dropdown.Item>
                <Dropdown.Item
                  className="text-danger border-top"
                  as={"button"}
                  type="button"
                  onClick={handleRemoveCategory}
                >
                  Remove
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : undefined}
        </div>
      </div>
      <div className="parent-wrapper label-1">
        <ul
          className={`collapse parent ${
            isOpen ? "show d-flex flex-column" : ""
          }`}
          style={{ gap: 10 }}
        >
          {category.sub.map((childCategory) => (
            <li key={childCategory.id} className="row">
              <CategoryAccordion category={childCategory} isPrimary={false} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CategoryAccordion;
