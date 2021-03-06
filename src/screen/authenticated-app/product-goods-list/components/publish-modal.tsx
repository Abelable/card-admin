import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Radio,
  Result,
  Row,
  Select,
  Space,
  Steps,
} from "antd";
import { useGoodsListQueryKey, usePublishModal } from "../util";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox } from "components/lib";
import { useAddGoods } from "service/product";
import { cleanObject } from "utils";
import { useState } from "react";
import { Uploader } from "components/uploader";
import { RichTextEditor } from "components/rich-text-editor";
import styled from "@emotion/styled";
import type { AgentOption } from "types/agent";
import type { GoodsForm, ProductOption } from "types/product";

export const PublishModal = ({
  productOptions,
  agentOptions,
}: {
  productOptions: ProductOption[] | undefined;
  agentOptions: AgentOption[];
}) => {
  const [form] = useForm();
  const [step, setStep] = useState(0);
  const [detail, setDetail] = useState("");
  const [remark, setRemark] = useState("");

  const normFile = (e: any) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  const { publishModalOpen, close } = usePublishModal();

  const { mutateAsync, error, isLoading } = useAddGoods(useGoodsListQueryKey());

  const [tempGoodsInfo, setTempGoodsInfo] = useState<Partial<GoodsForm>>();

  const next = () => {
    form.validateFields().then(() => {
      const { tags, img, ...rest } = form.getFieldsValue();
      const sale_point = tags ? tags.join() : "";
      const main_picture = img
        ? img[0].xhr
          ? JSON.parse(img[0].xhr.response).data.relative_url
          : img[0].url
        : "";

      setTempGoodsInfo({
        sale_point,
        main_picture,
        detail,
        remark,
        ...rest,
      });
      setStep(1);
    });
  };

  const submit = () => {
    form.validateFields().then(async () => {
      await mutateAsync(
        cleanObject({
          ...tempGoodsInfo,
          ...form.getFieldsValue(),
        })
      );
      setStep(2);
    });
  };

  const closeModal = () => {
    form.resetFields();
    setStep(0);
    setDetail("");
    setRemark("");
    close();
  };

  return (
    <Drawer
      title={"????????????"}
      width={"100rem"}
      forceRender={true}
      onClose={closeModal}
      visible={publishModalOpen}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        step === 0 ? (
          <Button onClick={next} type="primary">
            ?????????
          </Button>
        ) : step === 1 ? (
          <Space>
            <Button onClick={() => setStep(0)}>?????????</Button>
            <Button onClick={submit} loading={isLoading} type="primary">
              ????????????
            </Button>
          </Space>
        ) : (
          <></>
        )
      }
    >
      <Steps current={step}>
        <Steps.Step title="?????????????????????" description="????????????????????????" />
        <Steps.Step title="?????????????????????" description="??????????????????????????????" />
        <Steps.Step title="????????????" description="????????????????????????" />
      </Steps>
      <Divider />
      <Wrap>
        <Form form={form} layout="vertical">
          <ErrorBox error={error} />
          {step === 0 ? (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="product_id"
                    label="??????????????????"
                    rules={[{ required: true, message: "?????????????????????" }]}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      placeholder="?????????????????????"
                    >
                      {productOptions?.map(({ id, name }) => (
                        <Select.Option key={id} value={id}>
                          {name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="????????????"
                    rules={[{ required: true, message: "?????????????????????" }]}
                    tooltip="????????????????????????????????????????????????????????????????????????19?????????????????????2GB??????"
                  >
                    <Input placeholder="?????????????????????" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="encoding"
                    label="????????????"
                    rules={[{ required: true, message: "?????????????????????" }]}
                  >
                    <Input placeholder="?????????????????????" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="tags"
                    label="????????????"
                    rules={[
                      {
                        type: "array",
                        max: 3,
                      },
                    ]}
                    tooltip="?????????3??????????????????????????????????????????????????????????????????"
                  >
                    <Select mode="tags" placeholder="?????????????????????????????????" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.product_id !== currentValues.product_id
                }
              >
                {({ getFieldValue }) => (
                  <Form.Item label="?????????????????????">
                    <Radio.Group
                      value={
                        productOptions?.find(
                          (item) => item.id === getFieldValue("product_id")
                        )?.is_required_idphoto
                      }
                      disabled
                    >
                      <Radio value={0}>????????????</Radio>
                      <Radio value={1}>????????????</Radio>
                    </Radio.Group>
                  </Form.Item>
                )}
              </Form.Item>
              <Form.Item
                name="img"
                label="????????????"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Uploader maxCount={1} />
              </Form.Item>
              <Form.Item label="????????????" required>
                <RichTextEditor content={detail} setContent={setDetail} />
              </Form.Item>
              <Form.Item label="????????????">
                <RichTextEditor content={remark} setContent={setRemark} />
              </Form.Item>
            </>
          ) : step === 1 ? (
            <>
              <Form.Item
                name="visible_status"
                label="?????????????????????"
                rules={[{ required: true, message: "??????????????????????????????" }]}
              >
                <Radio.Group>
                  <Radio value={1}>???????????????</Radio>
                  <Radio value={2}>?????????????????????</Radio>
                  <Radio value={3}>?????????????????????</Radio>
                  <Radio value={4}>????????????????????????</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.visible_status !== currentValues.visible_status
                }
              >
                {({ getFieldValue }) =>
                  [3, 4].includes(getFieldValue("visible_status")) && (
                    <Form.Item
                      name="agent_ids"
                      label="???????????????"
                      rules={[{ required: true, message: "??????????????????" }]}
                    >
                      <Select mode="tags" placeholder="??????????????????">
                        {agentOptions.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )
                }
              </Form.Item>
            </>
          ) : (
            <Result status="success" title="????????????" />
          )}
        </Form>
      </Wrap>
    </Drawer>
  );
};

const Wrap = styled.div`
  margin: 0 auto;
  width: 680px;
`;
