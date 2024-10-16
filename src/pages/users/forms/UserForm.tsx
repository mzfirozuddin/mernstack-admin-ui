import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getRestaurants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "../../../types";

const UserForm = () => {
  const {
    data: restaurants, //: Alise name
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      return getRestaurants().then((res) => res.data);
    },
  });

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large">
          <Card title="Basic info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="First name"
                  name="firstName"
                  style={{ fontWeight: "500" }}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last name"
                  name="lastName"
                  style={{ fontWeight: "500" }}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  style={{ fontWeight: "500" }}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Security info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="password"
                  style={{ fontWeight: "500" }}
                >
                  <Input size="large" type="password" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Confirm password"
                  name="cPassword"
                  style={{ fontWeight: "500" }}
                >
                  <Input size="large" type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Role & Tenant info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  style={{ fontWeight: "500" }}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select role"
                    onChange={() => {}}
                  >
                    <Select.Option value="admin">Admin</Select.Option>
                    <Select.Option value="manager">Manager</Select.Option>
                    <Select.Option value="customer">Customer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Restaurants"
                  name="tenantId"
                  style={{ fontWeight: "500" }}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select restaurant"
                    onChange={() => {}}
                  >
                    {restaurants?.map((tenant: Tenant) => (
                      <Select.Option value={tenant.id}>
                        {tenant.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
};

export default UserForm;
