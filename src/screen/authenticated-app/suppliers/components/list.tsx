import styled from "@emotion/styled";
import { Button, Table, TablePaginationConfig, TableProps } from "antd";
import { ErrorBox, Row } from "components/lib";
import { Supplier, SuppliersSearchParams } from "types/supplier";
import { useNavigate } from "react-router-dom";

interface ListProps extends TableProps<Supplier> {
  error: Error | unknown;
  params: Partial<SuppliersSearchParams>;
  setParams: (params: Partial<SuppliersSearchParams>) => void;
}

export const List = ({ error, params, setParams, ...restProps }: ListProps) => {
  const navigate = useNavigate();
  const setPagination = (pagination: TablePaginationConfig) =>
    setParams({
      ...params,
      page: pagination.current,
      per_page: pagination.pageSize,
    });
  const link = (id: string) => navigate(`/supplier/goods_list?id=${id}`);

  return (
    <Container>
      <Header between={true}>
        <h3>供应商列表</h3>
      </Header>
      <ErrorBox error={error} />
      <Table
        rowKey={"id"}
        columns={[
          {
            title: "编号",
            dataIndex: "id",
            width: "8rem",
          },
          {
            title: "公司名称",
            dataIndex: "name",
          },
          {
            title: "联系电话",
            dataIndex: "phone",
          },
          {
            title: "操作",
            render: (value, supplier) => (
              <Button type="link" onClick={() => link(supplier.id)}>
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
