import { useQuery } from "@tanstack/react-query";
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
import { getCategories, getRestaurants } from "../../http/api";
import { Category, Tenant } from "../../types";

type ProductFilterProps = {
  children?: React.ReactNode;
};

const ProductFilter = ({ children }: ProductFilterProps) => {
  //: Fetching restaurants
  const { data: restaurants } = useQuery({
    queryKey: ["restaurants"],
    queryFn: () => {
      return getRestaurants(`perPage=100&currentPage=1`).then(
        (res) => res.data
      );
    },
  });
  // console.log("Restaurants", restaurants);

  //: Fetching categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => {
      return getCategories();
    },
  });
  // console.log("Categories", categories?.data);

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
                  {categories?.data.map((category: Category) => {
                    return (
                      <Select.Option key={category._id} value={category._id}>
                        {category.name}
                      </Select.Option>
                    );
                  })}
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
                  {restaurants?.data.map((restaurant: Tenant) => {
                    return (
                      <Select.Option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </Select.Option>
                    );
                  })}
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
