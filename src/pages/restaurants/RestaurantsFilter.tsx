import { Card, Col, Form, Input, Row } from "antd";

type RestaurantsFilterProps = {
  children?: React.ReactNode;
};

const RestaurantsFilter = ({ children }: RestaurantsFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        {/* style={{ border: "1px red solid" }} */}
        <Col span={8} style={{ paddingLeft: "10px" }}>
          <Form.Item name="q">
            <Input.Search placeholder="Search" allowClear={true} />
          </Form.Item>
        </Col>
        <Col style={{ paddingRight: "30px" }}>{children}</Col>
      </Row>
    </Card>
  );
};

export default RestaurantsFilter;
