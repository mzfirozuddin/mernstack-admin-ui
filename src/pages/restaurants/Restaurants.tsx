import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { Link } from "react-router-dom";
import RestaurantsFilter from "./RestaurantsFilter";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createTenant, getRestaurants } from "../../http/api";
import { useState } from "react";
import TenantForm from "./forms/TenantForm";
import { FieldData, Tenant } from "../../types";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";
import React from "react";

const columns = [
  {
    title: "Id",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      //: Step 1: Convert the string into a Date object
      const dateObject = new Date(text);

      //: Step 2: Create an array for month names
      const months = [
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

      //: Step 3: Extract day, month, and year from the Date object
      const day = dateObject.getUTCDate(); // Get the day (1-31)
      const month = months[dateObject.getUTCMonth()]; // Get the month index and map it to month name
      const year = dateObject.getUTCFullYear(); // Get the full year

      //: Step 4: Format the date as "11-Jun 2024"
      const formattedDate = `${day}-${month}-${year}`;

      return <>{formattedDate}</>;
    },
  },
];

const Restaurants = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const queryClient = useQueryClient();

  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const {
    data: restaurants, //: Alise name
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["restaurants", queryParams],
    queryFn: () => {
      const queryString = new URLSearchParams(
        queryParams as unknown as Record<string, string>
      ).toString();
      // console.log(queryString);

      return getRestaurants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData, //: to fix the UI jumping issue
  });

  //: Create tenant mutate
  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenant"],
    mutationFn: (data: Tenant) => createTenant(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  const onHandleSubmit = async () => {
    await form.validateFields();
    await tenantMutate(form.getFieldsValue());
    // console.log(form.getFieldsValue());
    form.resetFields();
    setDrawerOpen(false);
  };

  //: Add debounce functionality
  const debounceQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  //: Add filter functionality
  const onFilterChange = (changedFields: FieldData[]) => {
    // console.log(changedFields);
    const changedFiltersField = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    // console.log(changedFiltersField.q);
    debounceQUpdate(changedFiltersField.q); //: use debounce
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Breadcrumb
          // separator=">"
          separator={<RightOutlined />}
          items={[
            { title: <Link to="/">Dashboard</Link> },
            { title: "Restaurants" },
          ]}
        />

        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <RestaurantsFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add Restaurants
            </Button>
          </RestaurantsFilter>
        </Form>

        <Table
          columns={columns}
          dataSource={restaurants?.data}
          rowKey={"id"}
          pagination={{
            total: restaurants?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            //: In onChange we get two parameter(page, pageSize)
            onChange: (page) => {
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
          }}
        />

        <Drawer
          title="Create Tenant"
          width={550}
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
          <Form layout="horizontal" form={form}>
            <TenantForm />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Restaurants;
