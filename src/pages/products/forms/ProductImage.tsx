import { PlusOutlined } from "@ant-design/icons";
import { Form, message, Space, Typography, Upload, UploadProps } from "antd";
import { useState } from "react";

const ProductImage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  //: Configure the antD Upload componet for upload-manually
  const uploadConfig: UploadProps = {
    name: "file",
    multiple: false,
    showUploadList: false,
    beforeUpload: (file) => {
      //: We can write file validation logic here
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpgOrPng) {
        // console.log("You can only upload JPG/PNG file!");
        messageApi.error("You can only upload JPG/PNG file!");
      }

      //: Get image url
      setImageUrl(URL.createObjectURL(file));

      //: TODO: Image size validation

      return false; // Here returning flase, means do nothing before upolad.
    },
  };

  return (
    <>
      <Form.Item
        label=""
        name="image"
        style={{ fontWeight: "500" }}
        rules={[
          {
            required: true,
            message: "Please upload a product image!",
          },
        ]}
      >
        <Upload listType="picture-card" {...uploadConfig}>
          {/* //: "contextHolder" is for antD messageAPI */}
          {contextHolder}
          {imageUrl ? (
            <img src={imageUrl} alt="Product Image" style={{ width: "100%" }} />
          ) : (
            <Space direction="vertical">
              <PlusOutlined />
              <Typography.Text>Upload</Typography.Text>
            </Space>
          )}
        </Upload>
      </Form.Item>
    </>
  );
};

export default ProductImage;
