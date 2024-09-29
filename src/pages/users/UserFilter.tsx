import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Select } from "antd";

const UserFilter = () => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={14}>
          <Row gutter={20}>
            <Col span={10}>
              <Input.Search placeholder="Search" />
            </Col>
            <Col span={7}>
              <Select
                style={{ width: "100%" }}
                allowClear={true}
                placeholder="Select role"
              >
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="customer">Customer</Select.Option>
              </Select>
            </Col>
            <Col span={7}>
              <Select
                style={{ width: "100%" }}
                allowClear={true}
                placeholder="Status"
              >
                <Select.Option value="ban">Ban</Select.Option>
                <Select.Option value="active">Active</Select.Option>
              </Select>
            </Col>
          </Row>
        </Col>
        <Col
          span={10}
          style={{
            display: "flex",
            justifyContent: "end",
            paddingRight: "30px",
          }}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            Add User
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default UserFilter;
