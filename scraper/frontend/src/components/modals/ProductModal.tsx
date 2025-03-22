import { Icons } from "@/assets/icons";
import { ProductHitsContext } from "@/components/hits/ProductHits";
import { useBoundStore } from "@/store";
import { useContext } from "react";
import { Modal } from "react-bootstrap";

function ProductModal() {
  const {
    setProductToModal,
    product: { productToModal },
  } = useBoundStore();
  const { products, excludedWords } = useContext(ProductHitsContext);
  const show = Boolean(productToModal);

  const currentIndex = productToModal
    ? products.findIndex((item) => item.id === productToModal.id)
    : 0;

  const newCategoryArray = productToModal?.categories.map((category, index) => {
    const level = category.level;
    const space = level + 1;
    const col1 = level ? `col-${space}` : "";
    const col2 = level ? `col-${12 - space}` : "";
    return (
      <div key={index} className="row">
        {index > 0 && (
          <span className={`${col1} d-flex justify-content-end p-0`}>
            <Icons.UCornerDownRight width={16} height={16} />
          </span>
        )}
        <p className={`${col2} mb-0 text-capitalize`}>{category.name}</p>
      </div>
    );
  });


  const scraperCategoryArray = productToModal?.scraper_categories?.map((category, index) => {
    const level = category.level;
    const space = level + 1;
    const col1 = level ? `col-${space}` : "";
    const col2 = level ? `col-${12 - space}` : "";
    return (
      <div key={index} className="row">
        {index > 0 && (
          <span className={`${col1} d-flex justify-content-end p-0`}>
            <Icons.UCornerDownRight width={16} height={16} />
          </span>
        )}
        <p className={`${col2} mb-0 text-capitalize`}>{category.name}</p>
      </div>
    );
  });


  const recomended_sp =
    productToModal?.price_usd && productToModal?.markup
      ? productToModal.price_usd / productToModal.markup
      : null;

  function handlePrevClick() {
    if (productToModal) {
      setProductToModal(products[currentIndex - 1]);
    }
  }

  function handleNextClick() {
    if (productToModal) {
      setProductToModal(products[currentIndex + 1]);
    }
  }

  return (
    <Modal
      show={show}
      onHide={() => setProductToModal(undefined)}
      size="xl"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body
        as="div"
        className="row p-10 position-relative"
        style={{ minHeight: "40rem" }}
      >
        <button
          className="position-absolute btn-close border"
          style={{
            top: "20px",
            right: "40px",
          }}
          onClick={() => setProductToModal(undefined)}
        />
        {/* Prev Button */}
        <button
          className="btn-gallery-custom btn-link"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateX(-100%)",
            left: 0,
          }}
          onClick={handlePrevClick}
          disabled={currentIndex === 0}
        >
          <Icons.FiChevronLeft width={40} height={40} />
        </button>
        {/* Next Button */}
        <button
          className="btn-gallery-custom btn-link"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateX(100%)",
            right: 0,
          }}
          onClick={handleNextClick}
          disabled={currentIndex === products.length - 1}
        >
          <Icons.FiChevronRight width={40} height={40} />
        </button>
        <div className="col-6 border rounded-2 d-flex justify-content-center align-content-center">
          {productToModal?.image && (
            <img
              src={productToModal.image}
              className="img-fluid"
              alt="Image"
              width="fit"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                display: "block",
                margin: "auto",
                objectFit: "contain",
              }}
            />
          )}
        </div>
        <div
          className="col-6 position-relative p-5 scrollbar-overlay "
          style={{ height: "40rem" }}
        >
          <h3 className="pb-2 fs-2">{productToModal?.name}</h3>
          <h6
            className="pb-4 fs-0 fw-bolder"
            style={{ color: "var(--phoenix-700)" }}
          >
            {productToModal?.customer_name}
          </h6>
          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold">Customer Sales Price: </label>
            <p className="col-8 mb-0">
              $ {productToModal?.price_usd?.toFixed(2) ?? 0}
            </p>
          </div>
          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold">Customer Category: </label>
            <div className="col-8">{newCategoryArray}</div>
          </div>

          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold">Scraper Category: </label>
            <div className="col-8">{scraperCategoryArray}</div>
          </div>
          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold">Tags: </label>
            <div className="col-8">
              {productToModal?.tags
                .filter(
                  (tag) => !excludedWords.find((word) => word.word === tag)
                )
                .map((tag, index) => (
                  <span key={index} className="badge badge-tag me-1 mb-1">
                    {tag}
                  </span>
                ))}
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold ">
              Recomended Sales Price:
            </label>
            <p className="col-8 mb-0">{recomended_sp?.toFixed(2)}</p>
          </div>
          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold">Markup: </label>
            <p className="col-8 mb-0 fs-0">
              {productToModal?.markup ? productToModal.markup : ""}
            </p>
          </div>
          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold white-space-nowrap">
              Review Score:
            </label>
            <p className="col-8 mb-0">
              {productToModal?.review_score?.toFixed(2)}
            </p>
          </div>
          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold white-space-nowrap">
              Review Number:
            </label>
            <p className="col-8 mb-0">{productToModal?.review_number}</p>
          </div>
          <div className="row mb-2">
            <label className="col-4 fs-0 fw-bold">Description: </label>
            <p className="col-8 mb-0 fs-0">{productToModal?.description}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ProductModal;
