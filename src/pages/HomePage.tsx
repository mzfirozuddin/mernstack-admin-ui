import {
  Button,
  Card,
  Col,
  List,
  Row,
  Skeleton,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { useAuthStore } from "../store";
import { ComponentType } from "react";
import Icon from "@ant-design/icons";
import { BarChartIcon } from "../components/icons/BarChart";
import BasketIcon from "../components/icons/BasketIcon";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const list = [
  {
    OrderSummary: "Peperoni, Margarita ...",
    address: "Bandra, Mumbai",
    amount: 1200,
    status: "preparing",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
  {
    OrderSummary: "Paneer, Chicken BBQ ...",
    address: "Balurghat, West bengal",
    amount: 2000,
    status: "on the way",
    loading: false,
  },
];

interface CardTitleProp {
  title: string;
  prefixIcon: ComponentType<unknown>;
}

const CardTitle = ({ title, prefixIcon }: CardTitleProp) => {
  return (
    <Space>
      <Icon component={prefixIcon} />
      {title}
    </Space>
  );
};

function HomePage() {
  const { user } = useAuthStore();
  return (
    <div>
      <Title level={4}>Welcome, {user?.firstName}</Title>
      <Row gutter={16}>
        <Col span={12}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic title="Total Order" value={52} />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Statistic
                  title="Total Order"
                  value={70000}
                  precision={2}
                  prefix="₹"
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card
                bordered={false}
                title={<CardTitle title="Sales" prefixIcon={BarChartIcon} />}
              ></Card>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Card
            bordered={false}
            title={<CardTitle title="Recent Orders" prefixIcon={BasketIcon} />}
          >
            <List
              className="demo-loadmore-list"
              loading={false}
              itemLayout="horizontal"
              loadMore={true}
              dataSource={list}
              renderItem={(item) => (
                <List.Item>
                  <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                      title={
                        <a href="https://ant.design">{item.OrderSummary}</a>
                      }
                      description={item.address}
                    />
                    <Row style={{ flex: 1 }} justify="space-between">
                      <Col>
                        <Text strong>₹ {item.amount}</Text>
                      </Col>
                      <Col>
                        <Tag color="volcano">{item.status}</Tag>
                      </Col>
                    </Row>
                  </Skeleton>
                </List.Item>
              )}
            />
            <div style={{ marginTop: 20 }}>
              <Button type="link">
                <Link to="/orders">See all orders</Link>
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      {/* 
      <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
          <Layout>
            <Row gutter={16}>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="Total Order"
                    value={52}
                    // precision={2}
                    // valueStyle={{ color: "#3f8600" }}
                    // prefix={<ArrowUpOutlined />}
                    // suffix="%"
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="Total Sale"
                    value={70000}
                    precision={2}
                    // valueStyle={{ color: "#cf1322" }}
                    // prefix={<ArrowDownOutlined />}
                    // suffix="%"
                  />
                </Card>
              </Col>
            </Row>
          </Layout>

          <Layout style={{ paddingTop: "20px" }}>
            <Card
              title="Sale"
              // prefix={<BarChartOutlined />}

              // style={{ width: 300 }}
            ></Card>
          </Layout>
        </Layout>

        <Layout style={layoutStyle}>
          <Card
            title="Recent Orders"
            // extra={<BarChartOutlined />}

            // style={{ width: 300 }}
          ></Card>
        </Layout>
      </Flex> 
      */}
    </div>
  );
}

export default HomePage;
