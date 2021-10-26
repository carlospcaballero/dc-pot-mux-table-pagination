import {
  useState,
  useEffect,
} from "react";
import {
  Table,
  Pagination,
  Dropdown
} from "@awesomecomponents/mux/core/components"
import axios from "axios";

const FETCH_URL = "https://jsonplaceholder.typicode.com/comments";
const ITEMS_PER_PAGE = [10, 25, 50, 75, 100];

export const DataTable = () => {
  const [tableData, setTableData] = useState([]);
  const [maxItemsPerPage, setMaxItemsPerPage] = useState(ITEMS_PER_PAGE[0]);
  const [pageNum, setPageNum] = useState(1);
  const emptyTableMessage = "No results found";
  const tableHeader = [
    {
      id: "commentId",
      label: "Comment ID"
    },
    {
      id: "commentFrom",
      label: "From"
    },
    {
      id: "commentTitle",
      label: "Comment Title"
    },
    {
      id: "commentText",
      label: "Comment Text"
    },
  ];

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(FETCH_URL);
      const fetchData = data.map(comment => {
        const { id, name, email, body } = comment;
        return {
          commentId: {
            label: id,
          },
          commentFrom: {
            label: email,
          },
          commentTitle: {
            label: name,
          },
          commentText: {
            label: body
          }
        }
      });
      setTableData(fetchData);
      setPageNum(1);
    })();
  }, []);

  return (<>
    {
      tableData?.length > 0 &&
      (
        <>
          <Pagination
            totalItems={tableData.length / maxItemsPerPage}
            currentItem={pageNum}
            onChange={setPageNum}
          />
          <Dropdown
            onChange={setMaxItemsPerPage}
            value={maxItemsPerPage}
            dropdownItems={
              ITEMS_PER_PAGE.map(
                item => {
                  return {
                    label: item,
                    value: item
                  }
                }
              )
            }
          />
          <Table
            id="dataTable"
            header={tableHeader}
            emptyTableMessage={emptyTableMessage}
            rows={
              tableData.filter(
                (item, index) =>
                  (index >= ((pageNum - 1) * maxItemsPerPage))
                    && (index < (pageNum * maxItemsPerPage))
              )
            }
          />
        </>
      )
    }
    { tableData.length === 0 && <span>Spinner</span>}
  </>);
};
