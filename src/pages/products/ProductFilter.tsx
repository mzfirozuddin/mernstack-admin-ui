import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";

type ProductFilterProps = {
  children?: React.ReactNode;
};

const ProductFilter = ({ children }: ProductFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
              <Form.Item name="q">
                <Input.Search placeholder="Search" allowClear={true} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="category">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select category"
                >
                  <Select.Option value="pizza">Pizza</Select.Option>
                  <Select.Option value="beverages">Beverages</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item name="restaurant">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select restaurant"
                >
                  <Select.Option value="pizza-hub">Pizza Hub</Select.Option>
                  <Select.Option value="beverage">Softy Corner</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Space>
                <Switch defaultChecked onChange={() => {}} />
                <Typography.Text>Show only published</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col
          span={8}
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

export default ProductFilter;
