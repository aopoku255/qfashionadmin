import React, { useEffect, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Input,
  Label,
  FormFeedback,
  Form,
  Modal,
} from "reactstrap";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  addNewCategory,
  getCategory,
  addNewProduct as onAddNewProduct,
} from "../../../slices/thunks";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import classnames from "classnames";
import Dropzone from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

// Import React FilePond
import { registerPlugin } from "react-filepond";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import {
  removeVariation,
  setVariations,
} from "../../../slices/ecommerce/reducer";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EcommerceAddProduct = (props) => {
  document.title = "Create Product | Velzon - React Admin & Dashboard Template";

  const history = useNavigate();
  const dispatch = useDispatch();

  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = (tab) => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  const [selectedFiles, setselectedFiles] = useState([]);
  const [selectedVisibility, setselectedVisibility] = useState(null);

  function handleAcceptedFiles(files) {
    files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      }),
    );
    setselectedFiles(files);
    validation.setFieldValue("gallery", files);
  }

  function handleSelectVisibility(selectedVisibility) {
    setselectedVisibility(selectedVisibility);
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // const productCategory = [
  //   {
  //     options: [
  //       { label: "All", value: "All" },
  //       { label: "Appliances", value: "Kitchen Storage & Containers" },
  //       { label: "Fashion", value: "Clothes" },
  //       { label: "Electronics", value: "Electronics" },
  //       { label: "Grocery", value: "Grocery" },
  //       { label: "Home & Furniture", value: "Furniture" },
  //       { label: "Kids", value: "Kids" },
  //       { label: "Mobiles", value: "Mobiles" },
  //     ],
  //   },
  // ];

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  const productCategory =
    useSelector((state) => state.Ecommerce?.categories) || [];

  const dateFormat = () => {
    let d = new Date(),
      months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    let h = d.getHours() % 12 || 12;
    let ampm = d.getHours() < 12 ? "AM" : "PM";
    return (
      d.getDate() +
      " " +
      months[d.getMonth()] +
      ", " +
      d.getFullYear() +
      ", " +
      h +
      ":" +
      d.getMinutes() +
      " " +
      ampm
    ).toString();
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const dateString = e.toString().split(" ");
    let time = dateString[4];
    let H = +time.substr(0, 2);
    let h = H % 12 || 12;
    h = h <= 9 ? (h = "0" + h) : h;
    let ampm = H < 12 ? "AM" : "PM";
    time = h + time.substr(2, 3) + " " + ampm;

    const date = dateString[2] + " " + dateString[1] + ", " + dateString[3];
    const orderDate = (date + ", " + time).toString();
    setDate(orderDate);
  };

  const productStatus = [
    {
      options: [
        { label: "Active", value: true },
        { label: "Inactive", value: false },
      ],
    },
  ];

  const productVisibility = [
    {
      options: [
        { label: "Featured", value: true },
        { label: "Not Featured", value: false },
      ],
    },
  ];

  const [isOpenVariation, setIsOpenVariation] = useState(false);
  const [isOpenCategories, setIsOpenCategories] = useState(false);

  const handleOpenVatiation = () => {
    setIsOpenVariation(!isOpenVariation);
  };

  const handleOpenCategories = () => {
    setIsOpenCategories(!isOpenCategories);
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: "",
      slug: "",
      price: "",
      stock: "",
      color: "",
      size: "",
      icon: "",
      variationStock: "",
      priceOverride: "",
      sku: "",
      category: "",
      status: true,
      isFeatured: true,
      manufacturer_brand: "",
      product_discount: "",
      meta_title: "",
      meta_keyword: "",
      categoryName: "",
      categorySlug: "",
      categoryIcon: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter a Product Title"),
      price: Yup.string().required("Please Enter a Product Price"),
      stock: Yup.string().required("Please Enter a Product stock"),
      category: Yup.string().required("Please Enter a Product category"),
      meta_title: Yup.string().required("Please Enter a Meta Title"),
      meta_keyword: Yup.string().required("Please Enter a Meta Keyword"),
      // categoryName: Yup.string().required("Please Enter a Cat"),
    }),

    onSubmit: (values) => {
      const newProduct = {
        name: values.name,
        slug: values.slug,
        price: values.price,
        category: values.category,
        status: values.status,
        isFeatured: values.isFeatured,
        brand: values.manufacturer_brand,
        discount: values.product_discount,
        meta_title: values.meta_title,
        meta_keyword: values.meta_keyword,
        categoryName: values.categoryName,
        categorySlug: values.categorySlug,
        categoryIcon: values.categoryIcon,
        description: values.description,
        files: values.gallery,
        variations: ProductsVariations,
      };
      // save new product
      dispatch(onAddNewProduct(newProduct));
      // history("/apps-ecommerce-products");
      console.log(newProduct);
      // validation.resetForm();
    },
  });

  const handleRemoveVariation = (sku) => {
    dispatch(removeVariation(sku));
  };

  const handleVariations = async (e) => {
    e.preventDefault();

    // mark required fields as touched so errors show
    validation.setTouched({
      color: true,
      size: true,
      variationStock: true,
    });

    // run formik validation (uses your Yup schema)
    const errors = await validation.validateForm();

    // stop if any of the required ones have errors
    if (errors.color || errors.size || errors.variationStock) return;

    const variation = {
      color: validation.values.color,
      size: validation.values.size,
      stock: validation.values.variationStock,
      priceOverride: validation.values.priceOverride,
      sku: validation.values.sku,
    };

    dispatch(setVariations(variation));

    setIsOpenVariation(false);

    // reset only variation fields
    validation.setFieldValue("color", "");
    validation.setFieldValue("size", "");
    validation.setFieldValue("variationStock", "");
    validation.setFieldValue("priceOverride", "");
    validation.setFieldValue("sku", "");
  };

  const ProductsVariations =
    useSelector((state) => state.Ecommerce?.variations) || [];

  const generateSku = ({ name, color, size }) => {
    // 1. Product code from name (max 12 chars)
    const productCode = (name || "")
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, "")
      .trim()
      .split(/\s+/)
      .slice(0, 3) // first 3 words
      .join("") // AIR FORCE 1 -> AIRFORCE1
      .slice(0, 12); // safety limit

    // 2. Color code (first 3 letters)
    const colorCode = (color || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 3);

    // 3. Size (first value if comma-separated)
    const sizeCode = (size || "").split(",")[0].trim();

    return `${productCode}-${colorCode}-${sizeCode}`;
  };

  const handleAddCategories = async (e) => {
    e.preventDefault();

    validation.setTouched({
      categoryName: true,
    });
    const errors = await validation.validateForm();

    if (errors.categoryName) return;

    const category = {
      name: validation.values.categoryName,
      slug: validation.values.categorySlug,
      icon: validation.values.categoryIcon,
    };

    dispatch(addNewCategory(category));
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Create Product" pageTitle="Ecommerce" />

        <Row>
          <Col lg={8}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();

                // ✅ show errors on submit
                validation.setTouched(
                  Object.keys(validation.initialValues).reduce((acc, key) => {
                    acc[key] = true;
                    return acc;
                  }, {}),
                );

                validation.handleSubmit();
                return false;
              }}
            >
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="product-title-input">
                      Product Title
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      id="product-title-input"
                      name="name"
                      value={validation.values.name || ""}
                      onBlur={validation.handleBlur}
                      onChange={(e) => {
                        const nextName = e.target.value;
                        const nextSlug = nextName
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-");

                        validation.setFieldValue("name", nextName);
                        validation.setFieldValue("slug", nextSlug);
                      }}
                    />

                    {validation.errors.name && validation.touched.name ? (
                      <FormFeedback type="invalid">
                        {validation.errors.name}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="product-slug-input">
                      Slug
                    </Label>
                    <Input
                      readOnly
                      type="text"
                      className="form-control"
                      id="product-slug-input"
                      placeholder="Enter product slug"
                      name="slug"
                      value={validation.values.slug}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.slug && validation.touched.slug
                          ? true
                          : false
                      }
                    />
                    {validation.errors.slug && validation.touched.slug ? (
                      <FormFeedback type="invalid">
                        {validation.errors.slug}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div>
                    <Label>Product Description</Label>

                    <CKEditor
                      editor={ClassicEditor}
                      data={validation.values.description || ""}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        validation.setFieldValue("description", data);
                      }}
                    />
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">Product Gallery</h5>
                </CardHeader>
                <CardBody>
                  <div>
                    <p className="text-muted">Add Product Gallery Images.</p>

                    <Dropzone
                      onDrop={(acceptedFiles) => {
                        handleAcceptedFiles(acceptedFiles);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone dz-clickable">
                          <div
                            className="dz-message needsclick cursor-pointer"
                            {...getRootProps()}
                          >
                            {/* ✅ THIS is required */}
                            <input {...getInputProps()} />

                            <div className="mb-3">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h5>Drop files here or click to upload.</h5>
                          </div>
                        </div>
                      )}
                    </Dropzone>

                    <div className="list-unstyled mb-0" id="file-previews">
                      {selectedFiles.map((f, i) => {
                        return (
                          <Card
                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                            key={i + "-file"}
                          >
                            <div className="p-2">
                              <Row className="align-items-center">
                                <Col className="col-auto">
                                  <img
                                    data-dz-thumbnail=""
                                    height="80"
                                    className="avatar-sm rounded bg-light"
                                    alt={f.name}
                                    src={f.preview}
                                  />
                                </Col>
                                <Col>
                                  <Link
                                    to="#"
                                    className="text-muted font-weight-bold"
                                  >
                                    {f.name}
                                  </Link>
                                  <p className="mb-0">
                                    <strong>{f.formattedSize}</strong>
                                  </p>
                                </Col>
                              </Row>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <Nav className="nav-tabs-custom card-header-tabs border-bottom-0">
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "1",
                        })}
                        onClick={() => {
                          toggleCustom("1");
                        }}
                      >
                        General Info
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "2",
                        })}
                        onClick={() => {
                          toggleCustom("2");
                        }}
                      >
                        Variations
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: customActiveTab === "3",
                        })}
                        onClick={() => {
                          toggleCustom("3");
                        }}
                      >
                        Meta Data
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>

                <CardBody>
                  <TabContent activeTab={customActiveTab}>
                    <TabPane id="addproduct-general-info" tabId="1">
                      <Row></Row>
                      <Row>
                        <Col lg={3}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="manufacturer-brand-input"
                            >
                              Brand Name
                            </label>
                            <Input
                              type="text"
                              className="form-control"
                              id="manufacturer-brand-input"
                              name="manufacturer_brand"
                              placeholder="Enter manufacturer brand"
                              value={validation.values.manufacturer_brand || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.manufacturer_brand &&
                                validation.touched.manufacturer_brand
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.manufacturer_brand &&
                            validation.touched.manufacturer_brand ? (
                              <FormFeedback type="invalid">
                                {validation.errors.manufacturer_brand}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col sm={3}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="product-stock-input"
                            >
                              Stocks
                            </label>
                            <div className="input-group mb-3">
                              <Input
                                type="text"
                                className="form-control"
                                id="product-stock-input"
                                placeholder="Enter Stocks"
                                name="stock"
                                value={validation.values.stock || ""}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                invalid={
                                  validation.errors.stock &&
                                  validation.touched.stock
                                    ? true
                                    : false
                                }
                              />
                              {validation.errors.stock &&
                              validation.touched.stock ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.stock}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </div>
                        </Col>

                        <Col sm={3}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="product-price-input"
                            >
                              Price
                            </label>
                            <div className="input-group mb-3">
                              <span
                                className="input-group-text"
                                id="product-price-addon"
                              >
                                $
                              </span>
                              <Input
                                type="text"
                                className="form-control"
                                id="product-price-input"
                                placeholder="Enter price"
                                name="price"
                                aria-label="Price"
                                aria-describedby="product-price-addon"
                                value={validation.values.price || ""}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                invalid={
                                  validation.errors.price &&
                                  validation.touched.price
                                    ? true
                                    : false
                                }
                              />
                              {validation.errors.price &&
                              validation.touched.price ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.price}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </div>
                        </Col>

                        <Col sm={3}>
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="product-Discount-input"
                            >
                              Discount
                            </label>
                            <div className="input-group mb-3">
                              <span
                                className="input-group-text"
                                id="product-Discount-addon"
                              >
                                %
                              </span>
                              <Input
                                type="text"
                                className="form-control"
                                id="product-Discount-input"
                                placeholder="Enter Discount"
                                name="product_discount"
                                aria-label="product_discount"
                                aria-describedby="product-orders-addon"
                                value={validation.values.product_discount || ""}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                invalid={
                                  validation.errors.product_discount &&
                                  validation.touched.product_discount
                                    ? true
                                    : false
                                }
                              />
                              {validation.errors.product_discount &&
                              validation.touched.product_discount ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.product_discount}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane id="addproduct-variation" tabId="2">
                      <div className="d-flex flex-column">
                        {ProductsVariations.length > 0 ? (
                          <div className="mt-3">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 className="mb-0">Product Variations</h6>

                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleOpenVatiation}
                              >
                                Add Another
                              </button>
                            </div>

                            <div className="table-responsive">
                              <table className="table table-bordered align-middle mb-0">
                                <thead className="table-light">
                                  <tr>
                                    <th>#</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>Stock</th>
                                    <th>Price Override</th>
                                    <th>SKU</th>
                                    <th className="text-end">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {ProductsVariations.map((v, idx) => (
                                    <tr key={v.sku ?? idx}>
                                      <td>{idx + 1}</td>
                                      <td>{v.color}</td>
                                      <td>{v.size}</td>
                                      <td>{v.stock}</td>
                                      <td>{v.priceOverride}</td>
                                      <td>{v.sku}</td>
                                      <td className="text-end">
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-danger"
                                          onClick={() =>
                                            handleRemoveVariation(v.sku)
                                          }
                                        >
                                          Remove
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="d-flex flex-column">
                            <p className="text-center my-4">
                              Add Product Variations
                            </p>

                            <button
                              type="button"
                              className="btn btn-success mx-auto"
                              onClick={handleOpenVatiation}
                            >
                              Add Variations
                            </button>
                          </div>
                        )}
                      </div>
                      <Modal
                        isOpen={isOpenVariation}
                        centered
                        toggle={handleOpenVatiation}
                      >
                        <form
                          action=""
                          className="px-5 py-5"
                          onSubmit={handleVariations}
                        >
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-title-input"
                            >
                              Color
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="color"
                              name="color"
                              value={validation.values.color || ""}
                              onBlur={validation.handleBlur}
                              onChange={(e) => {
                                validation.handleChange(e);

                                validation.setFieldValue(
                                  "sku",
                                  generateSku({
                                    name: validation.values.name,
                                    color: e.target.value,
                                    size: validation.values.size,
                                  }),
                                );
                              }}
                            />

                            {validation.errors.color &&
                            validation.touched.color ? (
                              <FormFeedback type="invalid">
                                {validation.errors.color}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-title-input"
                            >
                              Size
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="size"
                              name="size"
                              value={validation.values.size || ""}
                              onBlur={validation.handleBlur}
                              onChange={(e) => {
                                validation.handleChange(e);

                                validation.setFieldValue(
                                  "sku",
                                  generateSku({
                                    name: validation.values.name,
                                    color: validation.values.color,
                                    size: e.target.value,
                                  }),
                                );
                              }}
                            />

                            {validation.errors.size &&
                            validation.touched.size ? (
                              <FormFeedback type="invalid">
                                {validation.errors.size}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-title-input"
                            >
                              Stock
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter stock"
                              id="variationStock"
                              name="variationStock"
                              value={validation.values.variationStock || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.variationStock &&
                                validation.touched.variationStock
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.variationStock &&
                            validation.touched.variationStock ? (
                              <FormFeedback type="invalid">
                                {validation.errors.variationStock}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-title-input"
                            >
                              Price Override
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter price override"
                              id="priceOverride"
                              name="priceOverride"
                              value={validation.values.priceOverride || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.priceOverride &&
                                validation.touched.priceOverride
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.priceOverride &&
                            validation.touched.priceOverride ? (
                              <FormFeedback type="invalid">
                                {validation.errors.priceOverride}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-title-input"
                            >
                              Sku
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter sku"
                              id="sku"
                              name="sku"
                              value={validation.values.sku || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.sku && validation.touched.sku
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.sku && validation.touched.sku ? (
                              <FormFeedback type="invalid">
                                {validation.errors.sku}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <button type="submit" className="btn btn-success ">
                            Submit
                          </button>
                        </form>
                      </Modal>
                    </TabPane>

                    <TabPane id="addproduct-metadata" tabId="3">
                      <Row>
                        <Col lg={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-title-input"
                            >
                              Meta title
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter meta title"
                              id="meta-title-input"
                              name="meta_title"
                              value={validation.values.meta_title || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.meta_title &&
                                validation.touched.meta_title
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.meta_title &&
                            validation.touched.meta_title ? (
                              <FormFeedback type="invalid">
                                {validation.errors.meta_title}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div className="mb-3">
                            <Label
                              className="form-label"
                              htmlFor="meta-keywords-input"
                            >
                              Meta Keywords
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              placeholder="Enter meta keywords"
                              id="meta-keywords-input"
                              name="meta_keyword"
                              value={validation.values.meta_keyword || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              invalid={
                                validation.errors.meta_keyword &&
                                validation.touched.meta_keyword
                                  ? true
                                  : false
                              }
                            />
                            {validation.errors.meta_keyword &&
                            validation.touched.meta_keyword ? (
                              <FormFeedback type="invalid">
                                {validation.errors.meta_keyword}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>

                      <div>
                        <Label
                          className="form-label"
                          htmlFor="meta-description-input"
                        >
                          Meta Description
                        </Label>
                        <textarea
                          className="form-control"
                          id="meta-description-input"
                          placeholder="Enter meta description"
                          name="meta_description"
                          rows="3"
                        ></textarea>
                      </div>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>

              <div className="text-end mb-3">
                <button type="submit" className="btn btn-success w-sm">
                  Submit
                </button>
              </div>
            </Form>
          </Col>

          <Col lg={4}>
            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Publish</h5>
              </CardHeader>
              <CardBody>
                <div className="mb-3">
                  <Label
                    htmlFor="choices-publish-status-input"
                    className="form-label"
                  >
                    Status
                  </Label>
                  <Input
                    name="status"
                    type="select"
                    className="form-select"
                    id="choices-publish-status-input"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.status || ""}
                  >
                    {productStatus.map((item, key) => (
                      <React.Fragment key={key}>
                        {item.options.map((item, key) => (
                          <option value={item.value} key={key}>
                            {item.label}
                          </option>
                        ))}
                      </React.Fragment>
                    ))}
                  </Input>
                  {validation.touched.status && validation.errors.status ? (
                    <FormFeedback type="invalid">
                      {validation.errors.status}
                    </FormFeedback>
                  ) : null}
                </div>

                <div>
                  <Label
                    htmlFor="choices-publish-visibility-input"
                    className="form-label"
                  >
                    Featured
                  </Label>

                  <Select
                    value={selectedVisibility}
                    onChange={(opt) => {
                      setselectedVisibility(opt);
                      validation.setFieldValue("isFeatured", opt?.value ?? "");
                    }}
                    options={productVisibility[0].options}
                    classNamePrefix="select2-selection form-select"
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h5 className="card-title mb-0">Product Categories</h5>
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-2">
                  {" "}
                  <Link
                    to="#"
                    className="float-end text-decoration-underline"
                    onClick={handleOpenCategories}
                  >
                    Add New
                  </Link>
                  Select product category
                </p>

                <Input
                  name="category"
                  type="select"
                  className="form-select"
                  id="category"
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.category || ""}
                >
                  {productCategory.map((item, key) => (
                    <React.Fragment key={key}>
                      <option value={item.id} key={key}>
                        {item.name}
                      </option>
                    </React.Fragment>
                  ))}
                </Input>
                {validation.touched.category && validation.errors.category ? (
                  <FormFeedback type="invalid">
                    {validation.errors.category}
                  </FormFeedback>
                ) : null}
              </CardBody>
              <Modal
                isOpen={isOpenCategories}
                toggle={handleOpenCategories}
                centered
              >
                <form
                  action=""
                  className="px-4 py-4"
                  onSubmit={handleAddCategories}
                >
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="meta-keywords-input">
                      Name
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Enter category name"
                      id="categoryName"
                      name="categoryName"
                      value={validation.values.categoryName || ""}
                      onBlur={validation.handleBlur}
                      onChange={(e) => {
                        const nextName = e.target.value;
                        const nextSlug = nextName
                          .toLowerCase()
                          .trim()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-");

                        validation.setFieldValue("categoryName", nextName);
                        validation.setFieldValue("categorySlug", nextSlug);
                      }}
                      invalid={
                        validation.errors.categoryName &&
                        validation.touched.categoryName
                          ? true
                          : false
                      }
                    />
                    {validation.errors.categoryName &&
                    validation.touched.categoryName ? (
                      <FormFeedback type="invalid">
                        {validation.errors.categoryName}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="meta-keywords-input">
                      Category slug
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Enter category slug"
                      id="categorySlug"
                      name="categorySlug"
                      value={validation.values.categorySlug || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.categorySlug &&
                        validation.touched.categorySlug
                          ? true
                          : false
                      }
                    />
                    {validation.errors.categorySlug &&
                    validation.touched.categorySlug ? (
                      <FormFeedback type="invalid">
                        {validation.errors.categorySlug}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <div className="mb-3">
                    <Label className="form-label" htmlFor="meta-keywords-input">
                      Icon
                    </Label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Enter category icon"
                      id="categoryIcon"
                      name="categoryIcon"
                      value={validation.values.categoryIcon || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={
                        validation.errors.categoryIcon &&
                        validation.touched.categoryIcon
                          ? true
                          : false
                      }
                    />
                    {validation.errors.categoryIcon &&
                    validation.touched.categoryIcon ? (
                      <FormFeedback type="invalid">
                        {validation.errors.categoryIcon}
                      </FormFeedback>
                    ) : null}
                  </div>
                  <button type="submit" className="btn btn-success w-sm">
                    Submit
                  </button>
                </form>
              </Modal>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EcommerceAddProduct;
