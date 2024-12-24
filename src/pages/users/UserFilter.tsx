import { Card, Col, Form, Input, Row, Select } from "antd";

type UserFilterProps = {
  children?: React.ReactNode;
};

const UserFilter = ({ children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={14}>
          <Row gutter={20}>
            <Col span={10}>
              <Form.Item name="q">
                <Input.Search placeholder="Search" allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="role">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select role"
                >
                  <Select.Option value="admin">Admin</Select.Option>
                  <Select.Option value="manager">Manager</Select.Option>
                  <Select.Option value="customer">Customer</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {/* //-============================================== */}
            {/* <Col span={7}>
              <Select
                style={{ width: "100%" }}
                allowClear={true}
                placeholder="Status"
                onChange={(selectedItem) =>
                  onFilterChange("statusFilter", selectedItem)
                }
              >
                <Select.Option value="ban">Ban</Select.Option>
                <Select.Option value="active">Active</Select.Option>
              </Select>
            </Col> */}
            {/* //-============================================== */}
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
          {/* Here we pass component as children from another component */}
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default UserFilter;
