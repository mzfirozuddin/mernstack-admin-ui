import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import { FieldData, Product } from "../../types";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { PER_PAGE } from "../../constants";
import { createProduct, getProducts } from "../../http/api";
import { format } from "date-fns";
import React from "react";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./helper/helper";

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: Product) => {
      return (
        <div>
          <Space>
            <Image width={60} src={record.image} preview={false} />
            <Typography.Text>{record.name}</Typography.Text>
          </Space>
        </div>
      );
    },
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Status",
    dataIndex: "isPublish",
    key: "isPublish",
    render: (_text: boolean, record: Product) => {
      return (
        <>
          {record.isPublish ? (
            <Tag color="green">Published</Tag>
          ) : (
            <Tag color="purple">Draft</Tag>
          )}
        </>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        // <Typography.Text>
        //   {new Date(text).toLocaleDateString()}
        //   {new Date(text).toLocaleTimeString()}
        // </Typography.Text>

        <Typography.Text>
          {format(new Date(text), "dd-MMM-yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
];

const Products = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const { user } = useAuthStore();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
    tenantId: user!.role === "manager" ? user?.tenant?.id : undefined, //: Add this to do role based filter
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: products,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1]) //- It will filter the truthy value and ignore the falsey values
        // Object.entries(queryParams).filter((item) => console.log(item[1])) //- Checking
      );
      // console.log("filteredParams", filteredParams);

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();

      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  const debounceQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, page: 1 }));
    }, 500);
  }, []);

  const onFilterChange = (changedFields: FieldData[]) => {
    const changedFiltersField = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    // console.log("ChangedFields: ", changedFiltersField);

    //: Add debounce functionality for 'q' query
    if ("q" in changedFiltersField) {
      debounceQUpdate(changedFiltersField.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFiltersField,
        page: 1, //: search start from 1st page, otherwise is skip the previous pages
      }));
    }

    console.log("QueryParams: ", queryParams);
  };

  //: Create product mutation
  const queryClient = useQueryClient();
  const { mutate: productMutate } = useMutation({
    mutationKey: ["product"],
    mutationFn: async (data: FormData) =>
      createProduct(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      form.resetFields(); //: After successfull submit clear the form
      setDrawerOpen(false);
      return;
    },
  });

  const onHandleSubmit = async () => {
    //: Validate the fields
    await form.validateFields();
    // console.log("productForm", form.getFieldsValue());

    //+ PriceConfiguration:
    //: Required priceConfiguration
    // const dummyPriceConfiguration = {
    //   Size: {
    //     priceType: "base",
    //     availableOptions: {
    //       Small: 400,
    //       Medium: 600,
    //       Large: 800,
    //     },
    //   },
    //   Crust: {
    //     priceType: "additional",
    //     availableOptions: {
    //       Thin: 50,
    //       Thick: 100,
    //     },
    //   },
    // };

    //: Current received priceConfiguration
    // const currentPrice = {
    //   '{"configurationKey":"Size","priceType":"base"}': {
    //     Small: 100,
    //     Medium: 200,
    //     Large: 300,
    //   },
    //   '{"configurationKey":"Crust","priceType":"additional"}': {
    //     Thin: 0,
    //     Thick: 50,
    //   },
    // };

    //: Transform to required priceConfiguration
    const priceConfiguration = form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);

        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    ); //: Second parameter initial value in reduce (empty object)
    // console.log("PriceConfiguration: ", pricing);

    //+ CategoryId:
    //: Get categoryId
    // const currentCategory = {"_id":"678408f2f0c79050c20777cc","name":"Pizza","priceConfiguration":{"Size":{"priceType":"base","availableOptions":["Small","Medium","Large"],"_id":"67855f363bc4abc62825041d"},"Crust":{"priceType":"additional","availableOptions":["Thin","Thick"],"_id":"67855f363bc4abc62825041e"}},"attributes":[{"name":"isHit","widgetType":"switch","defaultValue":"No","availableOptions":["Yes","No"],"_id":"67855f363bc4abc62825041b"},{"name":"Spiciness","widgetType":"radio","defaultValue":"Medium","availableOptions":["Less","Medium","High"],"_id":"67855f363bc4abc62825041c"}],"createdAt":"2025-01-12T18:24:50.054Z","updatedAt":"2025-01-13T19:01:23.697Z","__v":0}
    const categoryId = JSON.parse(form.getFieldValue("categoryId"))._id;
    // console.log("CategoryId: ", categoryId);

    //+ Attributes:
    //: Required attributes
    // const dummyAttributes = [
    //   {
    //     name: "Is Hit",
    //     value: true,
    //   },
    //   {
    //     name: "Spiciness",
    //     value: "Hot",
    //   },
    // ];

    //: Current received attributes
    // const currentAttributes = {
    //   isHit: "No",
    //   Spiciness: "Less",
    // };

    //: Transform to required attributes
    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );
    // console.log("Attributes: ", attributes);

    //: Prepare the product data befor send
    const postData = {
      ...form.getFieldsValue(),
      image: form.getFieldValue("image"), //: File data is a class object, that's why we specify it explectly (To solve the error)
      isPublish: form.getFieldValue("isPublish") ? true : false,
      categoryId,
      priceConfiguration: pricing,
      attributes,
    };
    // console.log("PostData: ", postData);

    //: Now convert the postData to formData because it need to be multipart-Form-Data (Because file also present)
    const formData = makeFormData(postData);
    // console.log("FormData: ", formData);
    await productMutate(formData);
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            // separator=">"
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />

          {isFetching && (
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          )}

          {isError && (
            <Typography.Text type="danger">{error.message}</Typography.Text>
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setDrawerOpen(true);
              }}
            >
              Add Product
            </Button>
          </ProductFilter>
        </Form>

        <Table
          // columns={columns}
          columns={[
            ...columns,
            {
              title: "Actions",
              render: () => {
                return (
                  <Space>
                    <Button type="link" onClick={() => {}}>
                      Edit
                    </Button>
                    {/* TODO: Add delete functionality */}
                    {/* <Button type="link">Delete</Button> */}
                  </Space>
                );
              },
            },
          ]}
          dataSource={products?.data}
          rowKey={"id"}
          pagination={{
            total: products?.total,
            pageSize: queryParams.limit,
            current: queryParams.page,
            onChange: (page) => {
              // console.log(page, pageSize);
              setQueryParams((prev) => {
                return {
                  ...prev,
                  page: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]} - ${range[1]} of ${total} items`;
            },
          }}
        />

        <Drawer
          title={"Add Product"}
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={onHandleSubmit}>
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <ProductForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
