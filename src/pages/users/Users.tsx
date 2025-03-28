import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  Tag,
  theme,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createUser, getUser, updateUser } from "../../http/api";
import { CreateUserData, FieldData, UpdateUserData, User } from "../../types";
import { useAuthStore } from "../../store";
import UserFilter from "./UserFilter";
import { useState } from "react";
import UserForm from "./forms/UserForm";
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

  {
    title: "Restaurant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <div>{record.tenant?.address}</div>;
    },
  },
];

const Users = () => {
  const [form] = Form.useForm(); //: This hook provided by antd
  const [filterForm] = Form.useForm();

  const [currentEditingUser, setCurrentEditingUser] =
    React.useState<User | null>(null);

  const queryClient = useQueryClient();

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  React.useEffect(() => {
    if (currentEditingUser) {
      // console.log("currentEditingUser", currentEditingUser);
      setDrawerOpen(true);
      form.setFieldsValue({
        ...currentEditingUser,
        tenantId: currentEditingUser.tenant?.id,
      });
    }
  }, [currentEditingUser, form]);

  const {
    data: users, //: Alise name
    // isLoading,  //: If we use "placeholderData" then isLoading not working. Use isFetching
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => {
      // const filteredParams = Object.entries(queryParams); //- it will convert the data in array formats like [key, value]
      // console.log(filteredParams);

      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter((item) => !!item[1]) //- It will filter the truthy value and ignore the falsey values
      );

      const queryString = new URLSearchParams(
        filteredParams as unknown as Record<string, string>
      ).toString();
      // console.log(queryString);
      return getUser(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData, //: to fix the UI jumping issue
  });

  const { user } = useAuthStore();

  //: Create user mutation
  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data: CreateUserData) =>
      createUser(data).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  //: Update user mutation
  const { mutate: updateUserMutate } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async (data: UpdateUserData) =>
      updateUser(data, currentEditingUser!.id).then((res) => res.data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  //: Handle form data
  const onHandleSubmit = async () => {
    await form.validateFields();
    const isEditMode = !!currentEditingUser;
    if (isEditMode) {
      // console.log("Updating....");
      await updateUserMutate(form.getFieldsValue());
    } else {
      // console.log("Creating....");
      await userMutate(form.getFieldsValue());
      // console.log("Form Data: ", form.getFieldsValue());
    }

    form.resetFields(); //: After submit from should be clear
    setCurrentEditingUser(null);
    setDrawerOpen(false);
  };

  const debounceQUpdate = React.useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  //: Filter functionality
  const onFilterChange = (changedFields: FieldData[]) => {
    // console.log(changedFields);
    //- ================= Return explicitly ========================
    // const changedFiltersField = changedFields.map((item) => {
    //   // console.log([item.name[0]]);
    //   return {
    //     [item.name[0]]: item.value,
    //   };
    // });
    //- ===========================================================

    const changedFiltersField = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    // console.log(changedFiltersField);

    //: Add debounce functionality for 'q' query
    if ("q" in changedFiltersField) {
      debounceQUpdate(changedFiltersField.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFiltersField,
        currentPage: 1, //: search start from 1st page, otherwise is skip the previous pages
      }));
    }

    // console.log(queryParams);
  };

  if (user?.role !== "admin") {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            // separator=">"
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Users" },
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
          <UserFilter>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setDrawerOpen(true)}
            >
              Add User
            </Button>
          </UserFilter>
        </Form>

        <Table
          // columns={columns}
          columns={[
            ...columns,
            {
              title: "Actions",
              render: (_text: string, record: User) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => setCurrentEditingUser(record)}
                    >
                      Edit
                    </Button>
                    {/* TODO: Add delete functionality */}
                    {/* <Button type="link">Delete</Button> */}
                  </Space>
                );
              },
            },
          ]}
          dataSource={users?.data}
          rowKey={"id"}
          pagination={{
            total: users?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              // console.log(page, pageSize);
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              return `Showing ${range[0]} - ${range[1]} of ${total} items`;
            },
          }}
        />

        <Drawer
          title={currentEditingUser ? "Update User" : "Create User"}
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setCurrentEditingUser(null);
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setCurrentEditingUser(null);
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
            <UserForm isEditMode={!!currentEditingUser} />
          </Form>
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
