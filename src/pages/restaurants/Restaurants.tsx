import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { Link } from "react-router-dom";
import RestaurantsFilter from "./RestaurantsFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getRestaurants } from "../../http/api";
import { useState } from "react";
import TenantForm from "./forms/TenantForm";
import { Tenant } from "../../types";

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
  const queryClient = useQueryClient();
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
    queryKey: ["restaurants"],
    queryFn: () => {
      return getRestaurants().then((res) => res.data);
    },
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

        <RestaurantsFilter
          onFilterChange={(filterValue: string) => {
            console.log(filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add Restaurants
          </Button>
        </RestaurantsFilter>

        <Table columns={columns} dataSource={restaurants} rowKey={"id"} />

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
