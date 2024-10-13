import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { Link } from "react-router-dom";
import RestaurantsFilter from "./RestaurantsFilter";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../../http/api";
import { useState } from "react";

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
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          title="Create User"
          width={720}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button>Cancel</Button>
              <Button type="primary">Submit</Button>
            </Space>
          }
        >
          <p>Hello.........</p>
        </Drawer>
      </Space>
    </>
  );
};

export default Restaurants;
