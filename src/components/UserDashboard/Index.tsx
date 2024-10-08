import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  InputRef,
  message,
  Popconfirm,
  Space,
  Table,
} from "antd";
import type { ColumnsType, ColumnType } from "antd/lib/table";
import type { FilterConfirmProps } from "antd/lib/table/interface";
import React, { useContext, useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { UserContext } from "../../contexts/UserContext";
import { s3DeleteFile } from "../../services/awsService";

import { DataType, FileType } from "@/types/types";
import { Container } from "./styles";

type DataIndex = keyof DataType;

export function UserDashboard() {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const { urlBackendApi, session } = useContext(UserContext);

  const [data, setData] = useState<DataType[]>([]);

  useEffect(() => {
    console.log(`UseEffect do dashboard de usuario`);
    const { email } = session;
    console.log(email);

    console.log(`${urlBackendApi}/file/user/${email}`);

    const aux = async () => {
      const responsefiles = await fetch(`${urlBackendApi}/file/user/${email}`);

      const files = await responsefiles.json();
      console.log(`Aqui estão os files do site`);
      console.log(files);

      const fileList = files.map((file: FileType) => {
        return {
          key: file.id,
          icon: <SearchOutlined />,
          title: file.title,
          name: file.name,
          size: file.size / 1000,
        };
      });
      setData(fileList);
    };
    aux();
  }, [session, urlBackendApi]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = async (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const handleDelete = async (key: React.Key) => {
    const deleteFile = data.filter((item) => item.key === key);
    console.log(deleteFile[0].title);

    const deletedFile = await s3DeleteFile(deleteFile[0].name, urlBackendApi);
    console.log(deletedFile);
    if (deletedFile.id) {
      message.success("Arquivo apagado com sucesso", 10);
      const fileList = data.filter((file) => {
        return file.name != deleteFile[0].name;
      });
      setData(fileList);
    } else {
      message.success("Erro ao apagar o arquivo", 10);
    }
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          allowClear
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          //style={{ marginBottom: 8, display: 'block' }}
          style={{
            marginBottom: 8,
            display: "block",
            width: "300",
            padding: "10px",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={async () => {
              clearFilters && (await handleReset(clearFilters));
              confirm({ closeDropdown: true });
              setSearchedColumn(dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      return (
        record[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()) ?? false
      );
    },

    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<DataType> = [
    {
      title: "Tipo",
      dataIndex: "icon",
      key: "icon",
      width: "5%",
      align: "center",
    },
    {
      title: "Titulo",
      dataIndex: "title",
      key: "title",
      width: "30%",
      ...getColumnSearchProps("title"),
    },

    {
      title: "Nome do Arquivo",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
    },

    {
      title: "Tamanho",
      dataIndex: "size",
      key: "size",
      width: "15%",
      sorter: (a, b) => a.size - b.size,
      sortDirections: ["descend", "ascend"],
      render: (_, { size }) => <>{size} kb</>,
    },
    {
      title: "Apagar",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (_, record: { key: React.Key; title: string }) =>
        data.length >= 1 ? (
          <Popconfirm
            title="Confirma apagar o arquivo?"
            placement="topRight"
            onConfirm={() => {
              handleDelete(record.key);
            }}
            okText="Sim"
            cancelText="Cancelar"
          >
            <Button type="link" size="small">
              Apagar
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <Container>
      <Table className="tableData" columns={columns} dataSource={data} />
    </Container>
  );
}
