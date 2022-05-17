import { toNumber } from "utils";
import { useChannels, useDownedChannels } from "service/product";
import { useChannelsSearchParams, useDownedChannelsSearchParams } from "./util";

import { SearchPanel } from "./components/search-panel";
import { List } from "./components/list";
import styled from "@emotion/styled";
import { useState } from "react";
import { Menu, MenuProps } from "antd";
import { DownedList } from "./components/downed-list";
import { DownedSearchPanel } from "./components/downed-search-panel";
import { ChannelModal } from "./components/channel-modal";
import { useOperatorOptions } from "service/common";
import { useSupplierOptions } from "service/supplier";

const modeOptions = [
  { name: "手动生产", value: 0 },
  { name: "自动生产", value: 1 },
];

export const ProductChannels = () => {
  const [type, setType] = useState("0");
  const operatorOptions = useOperatorOptions();
  const supplierOptions = useSupplierOptions();
  const [params, setParams] = useChannelsSearchParams();
  const [downedParams, setDownedParams] = useDownedChannelsSearchParams();
  const { data, isLoading, error } = useChannels(params);
  const {
    data: downedData,
    isLoading: downedLoading,
    error: downedError,
  } = useDownedChannels(downedParams);

  const items: MenuProps["items"] = [
    {
      label: <span onClick={() => setType("0")}>产品渠道中心</span>,
      key: "0",
    },
    {
      label: <span onClick={() => setType("1")}>已下架的产品</span>,
      key: "1",
    },
  ];

  return (
    <Container>
      <TypeMenu>
        <Menu mode="horizontal" selectedKeys={[type]} items={items} />
      </TypeMenu>
      <Main>
        {type === "0" ? (
          <>
            <SearchPanel
              supplierOptions={supplierOptions}
              params={params}
              setParams={setParams}
            />
            <List
              error={error}
              operatorOptions={operatorOptions}
              modeOptions={modeOptions}
              params={params}
              setParams={setParams}
              dataSource={data?.data}
              loading={isLoading}
              pagination={{
                current: toNumber(data?.meta.pagination.current_page),
                pageSize: toNumber(data?.meta.pagination.per_page),
                total: toNumber(data?.meta.pagination.total),
              }}
            />
          </>
        ) : (
          <>
            <DownedSearchPanel
              supplierOptions={supplierOptions}
              params={downedParams}
              setParams={setDownedParams}
            />
            <DownedList
              error={downedError}
              operatorOptions={operatorOptions}
              modeOptions={modeOptions}
              params={downedParams}
              setParams={setDownedParams}
              dataSource={downedData?.data}
              loading={downedLoading}
              pagination={{
                current: toNumber(downedData?.meta.pagination.current_page),
                pageSize: toNumber(downedData?.meta.pagination.per_page),
                total: toNumber(downedData?.meta.pagination.total),
              }}
            />
          </>
        )}
      </Main>
      <ChannelModal
        operatorOptions={operatorOptions}
        supplierOptions={supplierOptions}
      />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: 100%;
`;

const TypeMenu = styled.div`
  background: #fff;
`;

const Main = styled.div`
  padding: 2.4rem;
  height: 100%;
  overflow: scroll;
`;
