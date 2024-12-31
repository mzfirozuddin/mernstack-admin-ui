import { Card, Col, Form, Input, Row, Select, Space } from "antd";
import { getRestaurants } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import { Tenant } from "../../../types";

const UserForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
  const {
    data: restaurants, //: Alise name
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      //: make this dynamic, like search for tenants in the input
      return getRestaurants(`perPage=100&currentPage=1`).then(
        (res) => res.data
      );
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
                  rules={[
                    { required: true, message: "First name is required!" },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last name"
                  name="lastName"
                  style={{ fontWeight: "500" }}
                  rules={[
                    { required: true, message: "Last name is required!" },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email"
                  name="email"
                  style={{ fontWeight: "500" }}
                  rules={[
                    { required: true, message: "Email is required!" },
                    { type: "email", message: "Email is not valid!" },
                  ]}
                >
                  <Input disabled={isEditMode && true} size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {!isEditMode && (
            <Card title="Security info" bordered={false}>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label="Password"
                    name="password"
                    style={{ fontWeight: "500" }}
                    rules={[
                      { required: true, message: "Password is required!" },
                    ]}
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
          )}

          <Card title="Role & Tenant info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  style={{ fontWeight: "500" }}
                  rules={[{ required: true, message: "Role is required!" }]}
                >
                  <Select
                    id="selectBoxInUserForm"
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
                    {restaurants?.data.map((tenant: Tenant) => (
                      <Select.Option value={tenant.id} key={tenant.id}>
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
