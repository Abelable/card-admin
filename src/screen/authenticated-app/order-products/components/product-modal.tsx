import { Form, Modal, Select, Button, Input, Alert } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox } from "components/lib";
import { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import styled from "@emotion/styled";
import { useHttp } from "service/http";
import { useAddProduct, useEditProduct } from "service/order";
import { useProductsQueryKey, useProductModal } from "../util";
import type { Product } from "types/order";
import type { SupplierOption } from "types/supplier";

export const ProductModal = ({
  supplierOptions,
  products,
}: {
  supplierOptions: SupplierOption[];
  products: Product[];
}) => {
  const client = useHttp();
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [form] = useForm();
  const { productModalOpen, editingProductId, close } = useProductModal();
  const product =
    products?.find((item) => item.id === Number(editingProductId)) || undefined;
  const useMutationProduct = editingProductId ? useEditProduct : useAddProduct;
  const { mutateAsync, isLoading, error } = useMutationProduct(
    useProductsQueryKey()
  );

  useDeepCompareEffect(() => {
    if (product) {
      const { supplier_id, product_encoding, supplier_product_encoding } =
        product;
      form.setFieldsValue({
        supplier_id,
        product_encoding,
        supplier_product_encoding,
      });
    }
  }, [product, form]);

  const test = () => {
    form.validateFields().then(async () => {
      try {
        const res = await client("/api/v1/admin/supplier-product/check", {
          data: form.getFieldsValue(),
          method: "POST",
        });
        setSuccessMsg(res.message);
      } catch (error: any) {
        setErrMsg(error.message);
      }
    });
  };

  const confirm = () => {
    form.validateFields().then(async () => {
      await mutateAsync({
        id: editingProductId || "",
        ...form.getFieldsValue(),
      });
      closeModal();
    });
  };

  const closeModal = () => {
    form.resetFields();
    setSuccessMsg("");
    setErrMsg("");
    close();
  };

  return (
    <Modal
      title={editingProductId ? "????????????????????????" : "????????????????????????"}
      onCancel={closeModal}
      visible={productModalOpen}
      confirmLoading={isLoading}
      footer={
        <>
          <Button onClick={closeModal}>??????</Button>
          <Button type={"primary"} onClick={() => confirm()}>
            ??????
          </Button>
        </>
      }
    >
      <ErrorBox error={error} />
      <Form form={form} layout="vertical">
        <Form.Item
          name="supplier_id"
          label="?????????"
          rules={[{ required: true, message: "??????????????????" }]}
        >
          <Select placeholder="??????????????????">
            {supplierOptions.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="product_encoding"
          label="????????????"
          rules={[{ required: true, message: "?????????????????????" }]}
        >
          <Input placeholder="?????????????????????" />
        </Form.Item>
        <Form.Item
          name="supplier_product_encoding"
          label="????????????"
          rules={[{ required: true, message: "?????????????????????" }]}
        >
          <Input placeholder="?????????????????????" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={test}>
            ??????
          </Button>
          {successMsg && <Tips message={successMsg} type="success" />}
          {errMsg && <Tips message={errMsg} type="error" />}
        </Form.Item>
        {editingProductId ? (
          <Form.Item name="trigger_mark" label="??????????????????">
            <Input placeholder="???????????????????????????" />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

const Tips = styled(Alert)`
  margin-top: 1.2rem;
`;
