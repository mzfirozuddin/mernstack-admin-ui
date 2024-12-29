import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import {
  Avatar,
  Badge,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Space,
  theme,
} from "antd";
import Icon, { BellFilled } from "@ant-design/icons";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import UserIcon from "../components/icons/UserIcon";
import FoodIcon from "../components/icons/FoodIcon";
import BasketIcon from "../components/icons/BasketIcon";
import GiftIcon from "../components/icons/GiftIcon";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const { Sider, Header, Content, Footer } = Layout;

const getMenuItems = (role: string) => {
  const baseItems = [
    {
      key: "/",
      icon: <Icon component={Home} />,
      label: <NavLink to="/">Home</NavLink>,
      priority: 0,
    },
    {
      key: "/restaurants",
      icon: <Icon component={FoodIcon} />,
      label: <NavLink to="/restaurants">Restaurants</NavLink>,
      priority: 2,
    },
    {
      key: "/products",
      icon: <Icon component={BasketIcon} />,
      label: <NavLink to="/products">Products</NavLink>,
      priority: 3,
    },
    {
      key: "/promos",
      icon: <Icon component={GiftIcon} />,
      label: <NavLink to="/promos">Promos</NavLink>,
      priority: 4,
    },
  ];

  //: Hiding the user routes for other user like customer and manager
  if (role === "admin") {
    /* return [
      ...baseItems,
      {
        key: "/users",
        icon: <Icon component={UserIcon} />,
        label: <NavLink to="/users">Users</NavLink>,
        priority: 1,
      },
    ]; */

    //: If we want to maintain the order
    const menus = [...baseItems];
    menus.splice(1, 0, {
      key: "/users",
      icon: <Icon component={UserIcon} />,
      label: <NavLink to="/users">Users</NavLink>,
      priority: 1,
    });

    return menus;
  }

  // return baseItems.sort((a, b) => a.priority - b.priority); //! This process not working properly
  return baseItems;
};

const Dashboard = () => {
  const location = useLocation();
  const { logout: logoutFromStore } = useAuthStore();

  //:TODO: we can make this a custom hook
  const { mutate: logoutMutate } = useMutation({
    mutationKey: ["logout"],
    mutationFn: logout, //- logout from backend
    onSuccess: async () => {
      logoutFromStore(); //- logout from store
      return;
    },
  });

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //: If user not login then redirect to login page
  const { user } = useAuthStore();
  if (user === null) {
    // return <Navigate to="/auth/login" replace={true} />;
    return (
      <Navigate
        to={`/auth/login?returnTo=${location.pathname}`}
        replace={true}
      />
    );
  }

  const items = getMenuItems(user.role); //: this function for manupulate the manu items
  // console.log(items);

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <div className="logo">
            <Logo />
          </div>
          <Menu
            theme="light"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Header
            style={{
              paddingLeft: "16px",
              paddingRight: "16px",
              background: colorBgContainer,
            }}
          >
            <Flex gap="middle" align="start" justify="space-between">
              <Badge
                text={user.role === "admin" ? "Admin" : user.tenant?.name}
                status="success"
              />
              <Space size={16}>
                <Badge dot={true}>
                  <BellFilled />
                </Badge>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "logout",
                        label: "Logout",
                        onClick: () => logoutMutate(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Avatar
                    style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
                  >
                    U
                  </Avatar>
                </Dropdown>
              </Space>
            </Flex>
          </Header>
          <Content style={{ margin: "20px" }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>Mernspace pizza shop</Footer>
        </Layout>
      </Layout>
    </div>
  );
};

export default Dashboard;
