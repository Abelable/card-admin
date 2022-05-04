import styled from "@emotion/styled";
import { Button, Table, TablePaginationConfig, TableProps } from "antd";
import { ErrorBox, Row } from "components/lib";
import { Agent, AgentsSearchParams } from "types/agent";
import { useNavigate } from "react-router-dom";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useAgentModal } from "../util";

interface ListProps extends TableProps<Agent> {
  error: Error | unknown;
  params: Partial<AgentsSearchParams>;
  setParams: (params: Partial<AgentsSearchParams>) => void;
}

export const List = ({ error, params, setParams, ...restProps }: ListProps) => {
  const navigate = useNavigate();
  const setPagination = (pagination: TablePaginationConfig) =>
    setParams({
      ...params,
      page: pagination.current,
      per_page: pagination.pageSize,
    });
  const { open } = useAgentModal();

  const link = (id: number) => navigate(`/agents/goods_list?id=${id}`);

  return (
    <Container>
      <Header between={true}>
        <h3>代理商列表</h3>
        <Button onClick={open} type={"primary"} icon={<PlusOutlined />}>
          新增
        </Button>
      </Header>
      <ErrorBox error={error} />
      <Table
        rowKey={"id"}
        columns={[
          {
            title: "编号",
            dataIndex: "id",
            width: "8rem",
            sorter: (a, b) => Number(a.id) - Number(b.id),
          },
          {
            title: "代理商店铺名",
            dataIndex: "store",
            render: (value, agent) => (
              <Edit>
                <span>{value}</span>
                <EditOutlined
                  style={{ marginLeft: ".4rem", color: "#1890ff" }}
                />
              </Edit>
            ),
          },
          {
            title: "渠道id",
            dataIndex: "channel_id",
          },
          {
            title: "公司名称",
            dataIndex: "company",
          },
          {
            title: "店铺负责人",
            dataIndex: "contact",
          },
          {
            title: "联系电话",
            dataIndex: "phone",
          },
          {
            title: "邮箱",
            dataIndex: "email",
          },
          {
            title: "激活状态回传的有效天数（订单创建时起）",
            dataIndex: "activation_days",
            render: (value, agent) => (
              <Edit>
                <span>{value || 0}天</span>
                <EditOutlined
                  style={{ marginLeft: ".4rem", color: "#1890ff" }}
                />
              </Edit>
            ),
          },
          {
            title: "充值金额回传的有效天数（订单创建时起）",
            dataIndex: "activation_days",
            render: (value, agent) => (
              <Edit>
                <span>{value || 0}天</span>
                <EditOutlined
                  style={{ marginLeft: ".4rem", color: "#1890ff" }}
                />
              </Edit>
            ),
          },
          {
            title: "操作",
            render: (value, agent) => (
              <Button type="link" onClick={() => link(agent.id)}>
                查看产品
              </Button>
            ),
            width: "20rem",
          },
        ]}
        onChange={setPagination}
        {...restProps}
      />
    </Container>
  );
};

const Container = styled.div`
  padding: 2.4rem;
  background: #fff;
`;

const Header = styled(Row)`
  margin-bottom: 2.4rem;
`;

const Edit = styled(Row)`
  cursor: pointer;
`;
