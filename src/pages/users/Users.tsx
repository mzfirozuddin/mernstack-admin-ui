import { Breadcrumb, Space, Table, Tag } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../http/api";
import { User } from "../../types";
import { useAuthStore } from "../../store";
import UserFilter from "./UserFilter";

const columns = [
  {
    title: "First Name",
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
        />

        <Table columns={columns} dataSource={users} rowKey={"id"} />
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
