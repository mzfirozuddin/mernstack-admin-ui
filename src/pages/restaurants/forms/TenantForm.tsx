import { Card, Col, Form, Input, Row, Space } from "antd";

const TenantForm = () => {
  return (
    <div>
      <Row>
        <Col span={24}>
          <Space direction="vertical" size="large">
            <Card title="Tenant info" bordered={false}>
              <Row gutter={20}>
                <Col span={24} style={{ height: "100px" }}>
                  <Form.Item
                    layout="vertical"
                    label="Tenant Name: "
                    name="name"
                    style={{
                      fontWeight: "500",
                    }}
                    rules={[
                      { required: true, message: "Tenant name is required!" },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={24} style={{ height: "100px" }}>
                  <Form.Item
                    layout="vertical"
                    label="Tenant Address: "
                    name="address"
                    style={{
                      fontWeight: "500",
                    }}
                    rules={[
                      {
                        required: true,
                        message: "Tenant address is required!",
                      },
                    ]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default TenantForm;
