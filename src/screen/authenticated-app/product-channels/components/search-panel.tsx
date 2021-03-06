import { useState } from "react";
import { Button, Divider, Input, Select } from "antd";
import { Row } from "components/lib";
import styled from "@emotion/styled";
import type { ChannelOption, ChannelsSearchParams } from "types/product";
import type { SupplierOption } from "types/supplier";
import { useExportChannels } from "service/product";

export interface SearchPanelProps {
  channelOptions: ChannelOption[] | undefined;
  supplierOptions: SupplierOption[];
  params: Partial<ChannelsSearchParams>;
  setParams: (params: Partial<ChannelsSearchParams>) => void;
}

export const SearchPanel = ({
  channelOptions,
  supplierOptions,
  params,
  setParams,
}: SearchPanelProps) => {
  const defaultParams = {
    goods_name: undefined,
    goods_code: "",
    supplier_id: undefined,
  } as Partial<ChannelsSearchParams>;

  const [temporaryParams, setTemporaryParams] =
    useState<Partial<ChannelsSearchParams>>(params);
  const exportChannels = useExportChannels();

  const setGoodsName = (goods_name: string) =>
    setTemporaryParams({ ...temporaryParams, goods_name });
  const clearGoodsName = () =>
    setTemporaryParams({ ...temporaryParams, goods_name: undefined });

  const setGoodsCode = (evt: any) => {
    // onInputClear
    if (!evt.target.value && evt.type !== "change") {
      setTemporaryParams({
        ...temporaryParams,
        goods_code: "",
      });
      return;
    }

    setTemporaryParams({
      ...temporaryParams,
      goods_code: evt.target.value,
    });
  };

  const setSupplier = (supplier_id: number) =>
    setTemporaryParams({ ...temporaryParams, supplier_id });
  const clearSupplier = () =>
    setTemporaryParams({ ...temporaryParams, supplier_id: undefined });

  const clear = () => {
    setParams({ ...params, ...defaultParams });
    setTemporaryParams({ ...temporaryParams, ...defaultParams });
  };

  return (
    <Container marginBottom={1.6} between={true}>
      <Row gap={true}>
        <Row>
          <div>产品名称：</div>
          <Select
            style={{ width: "20rem" }}
            value={temporaryParams.goods_name}
            allowClear={true}
            onSelect={setGoodsName}
            onClear={clearGoodsName}
            showSearch
            filterOption={(input, option) =>
              (option!.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            placeholder="请选择产品"
          >
            {channelOptions?.map(({ id, name }) => (
              <Select.Option key={id} value={name}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Row>
        <Row>
          <div>产品编码：</div>
          <Input
            style={{ width: "20rem" }}
            value={temporaryParams.goods_code}
            onChange={setGoodsCode}
            placeholder="请输入产品编码"
            allowClear={true}
          />
        </Row>
        <Row>
          <div>供应商：</div>
          <Select
            style={{ width: "20rem" }}
            value={temporaryParams.supplier_id}
            allowClear={true}
            onSelect={setSupplier}
            onClear={clearSupplier}
            showSearch
            filterOption={(input, option) =>
              (option!.children as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            placeholder="请选择供应商"
          >
            {supplierOptions.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Row>
      </Row>
      <Row gap={true}>
        <Button onClick={clear}>重置</Button>
        {params.is_removed === "0" ? (
          <>
            <Button
              type={"primary"}
              onClick={() => setParams({ ...params, ...temporaryParams })}
            >
              查询
            </Button>
            <Divider
              style={{ height: "3rem", marginLeft: 0 }}
              type={"vertical"}
            />
            <Button
              style={{ marginRight: 0 }}
              type={"primary"}
              onClick={() => exportChannels(params)}
            >
              导出
            </Button>
          </>
        ) : (
          <Button
            type={"primary"}
            style={{ marginRight: 0 }}
            onClick={() => setParams({ ...params, ...temporaryParams })}
          >
            查询
          </Button>
        )}
      </Row>
    </Container>
  );
};

const Container = styled(Row)`
  padding: 2.4rem;
  background: #fff;
`;
