import styled from "@emotion/styled";
import { Cascader, Col, Form, Input, message, Modal, Row, Spin } from "antd";
import { useForm } from "antd/lib/form/Form";
import useDeepCompareEffect from "use-deep-compare-effect";
import { useEditDeliver } from "service/order";
import { useInfoModal, useOrderDeliversQueryKey } from "../util";
import type { RegionOption } from "types/common";

export const InfoModal = ({
  regionOptions,
}: {
  regionOptions: RegionOption[] | undefined;
}) => {
  const [form] = useForm();
  const {
    infoModalOpen,
    editingDeliver,
    close,
    isLoading: initLoading,
  } = useInfoModal();
  const { mutateAsync, isLoading } = useEditDeliver(useOrderDeliversQueryKey());

  useDeepCompareEffect(() => {
    if (editingDeliver) {
      const { province_id, city_id, area_id, ...rest } = editingDeliver;
      form.setFieldsValue({
        address_region: [province_id, city_id, area_id],
        ...rest,
      });
    }
  }, [editingDeliver, form]);

  const confirm = () => {
    form.validateFields().then(async () => {
      const { address_region, ...rest } = form.getFieldsValue();
      try {
        await mutateAsync({
          ...editingDeliver,
          province_id: address_region[0],
          city_id: address_region[1],
          area_id: address_region[2],
          street_id: undefined,
          ...rest,
        });
        closeModal();
      } catch (error: any) {
        message.error(error.message);
      }
    });
  };

  const closeModal = () => {
    form.resetFields();
    close();
  };

  return (
    <Modal
      title={"修改订单信息"}
      visible={infoModalOpen}
      confirmLoading={isLoading}
      onOk={confirm}
      onCancel={closeModal}
    >
      {initLoading ? (
        <Loading>
          <Spin size={"large"} />
        </Loading>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="receiver"
            label="收货人姓名"
            rules={[{ required: true, message: "请输入收货人姓名" }]}
          >
            <Input placeholder="请输入收货人姓名" />
          </Form.Item>
          <Form.Item
            name="buyer"
            label="身份证姓名"
            rules={[{ required: true, message: "请输入身份证姓名" }]}
          >
            <Input placeholder="请输入身份证姓名" />
          </Form.Item>
          <Form.Item
            name="idcard"
            label="身份证号"
            rules={[{ required: true, message: "请输入身份证号" }]}
          >
            <Input placeholder="请输入身份证号" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[{ required: true, message: "请输入联系电话" }]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="address_region"
            label="收货地址"
            rules={[{ required: true, message: "请选择收货地址" }]}
          >
            <Cascader
              fieldNames={{ label: "name", value: "id" }}
              options={regionOptions as any}
              placeholder="请选择收货地址"
            />
          </Form.Item>
          <Form.Item label="手动填写" tooltip="没找到？手动填写">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="province" style={{ marginBottom: 0 }}>
                  <Input placeholder="省" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="city" style={{ marginBottom: 0 }}>
                  <Input placeholder="市" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="area" style={{ marginBottom: 0 }}>
                  <Input placeholder="区" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            name="detail_address"
            label="详细地址"
            rules={[{ required: true, message: "请输入详细地址" }]}
          >
            <Input.TextArea rows={4} placeholder="请输入详细地址" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

const Loading = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
