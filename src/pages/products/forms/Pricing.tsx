import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { ICategory } from "../../../types";

type PricingProps = {
  selectedCategory: string;
};

const Pricing = ({ selectedCategory }: PricingProps) => {
  const category: ICategory | null = selectedCategory
    ? JSON.parse(selectedCategory)
    : null;

  if (!category) {
    return null;
  }

  return (
    <Card
      title={<Typography.Text>Product Price</Typography.Text>}
      bordered={false}
    >
      {
        //: When we use Object.entries() then it provide an array [key, value]
        Object.entries(category.priceConfiguration).map(
          ([configurationKey, configurationValue]) => {
            return (
              <div key={configurationKey}>
                <Space
                  direction="vertical"
                  size="large"
                  style={{ width: "100%" }}
                >
                  <Typography.Text>{`${configurationKey} (${configurationValue.priceType})`}</Typography.Text>

                  <Row gutter={20}>
                    {configurationValue.availableOptions.map(
                      (option: string) => {
                        // console.log("Option", option);
                        return (
                          <Col span={8} key={option}>
                            <Form.Item
                              label={option}
                              name={[
                                "priceConfiguration",
                                JSON.stringify({
                                  configurationKey: configurationKey,
                                  priceType: configurationValue.priceType,
                                }),
                                option,
                              ]}
                            >
                              <InputNumber addonAfter="₹" />
                            </Form.Item>
                          </Col>
                        );
                      }
                    )}
                  </Row>
                </Space>
              </div>
            );
          }
        )
      }
    </Card>
  );
};

export default Pricing;
