import { Breadcrumb, Button, Drawer, Space, Table, Tag } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../http/api";
import { User } from "../../types";
import { useAuthStore } from "../../store";
import UserFilter from "./UserFilter";
import { useState } from "react";

const columns = [
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: User) => {
      return (
        <div>
          {record.firstName} {record.lastName}
        </div>
      );
    },
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (text: string) => {
      let color = text === "admin" ? "green" : "geekblue";
      if (text === "customer") {
        color = "orange";
      }
      return (
        <Tag bordered={false} color={color} key={text}>
          {text}
        </Tag>
      );
    },
  },

  {
    title: "Email Id",
    dataIndex: "email",
    key: "email",
  },
];

const Users = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    data: users, //: Alise name
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => {
      return getUser().then((res) => res.data);
    },
  });

  const { user } = useAuthStore();
  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Breadcrumb
          // separator=">"
          separator={<RightOutlined />}
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
        />

        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}

        <UserFilter
          onFilterChange={(filterName: string, filterValue: string) => {
            console.log(filterName, filterValue);
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setDrawerOpen(true)}
          >
            Add User
          </Button>
        </UserFilter>

        <Table columns={columns} dataSource={users} rowKey={"id"} />

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

      {/* {users && (
        <div>
          <h1>Users</h1>
          <ul>
            {users.map((user: User) => (
              <li>{user.firstName}</li>
            ))}
          </ul>
        </div>
      )} */}
    </>
  );
};

export default Users;
