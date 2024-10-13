import { Card, Col, Input, Row } from "antd";

type RestaurantsFilterProps = {
  children?: React.ReactNode;
  onFilterChange: (filterValue: string) => void;
};

const RestaurantsFilter = ({
  onFilterChange,
  children,
}: RestaurantsFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        {/* style={{ border: "1px red solid" }} */}
        <Col span={8} style={{ paddingLeft: "10px" }}>
          <Input.Search
            placeholder="Search"
            allowClear={true}
            onChange={(e) => onFilterChange(e.target.value)}
          />
        </Col>
        <Col style={{ paddingRight: "30px" }}>{children}</Col>
      </Row>
    </Card>
  );
};

export default RestaurantsFilter;
