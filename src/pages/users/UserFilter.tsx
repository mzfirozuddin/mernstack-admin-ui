import { Card, Col, Input, Row, Select } from "antd";

type UserFilterProps = {
  children?: React.ReactNode;
  onFilterChange: (filterName: string, filterValue: string) => void;
};

const UserFilter = ({ onFilterChange, children }: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={14}>
          <Row gutter={20}>
            <Col span={10}>
              <Input.Search
                placeholder="Search"
                allowClear={true}
                onChange={(e) => onFilterChange("searchFilter", e.target.value)}
              />
            </Col>
            <Col span={7}>
              <Select
                style={{ width: "100%" }}
                allowClear={true}
                placeholder="Select role"
                onChange={(selectedItem) =>
                  onFilterChange("roleFilter", selectedItem)
                }
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
                onChange={(selectedItem) =>
                  onFilterChange("statusFilter", selectedItem)
                }
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
          {/* Here we pass component as children from another component */}
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default UserFilter;
