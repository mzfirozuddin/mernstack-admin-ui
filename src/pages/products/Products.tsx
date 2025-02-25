import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Image,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import { FieldData, Product } from "../../types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PER_PAGE } from "../../constants";
import { getProducts } from "../../http/api";
import { format } from "date-fns";
import React from "react";
import { debounce } from "lodash";

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
  const [filterForm] = Form.useForm();

  const [queryParams, setQueryParams] = useState({
    limit: PER_PAGE,
    page: 1,
  });

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
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {}}>
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
      </Space>
    </>
  );
};

export default Products;
