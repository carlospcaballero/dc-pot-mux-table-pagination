import {
  useState,
  useEffect,
} from "react";
import {
  Table,
  Pagination,
  Dropdown,
  Label,
} from "@awesomecomponents/mux/core/components"
import axios from "axios";
import styles from './Datatable.module.css';

const FETCH_URL = "https://jsonplaceholder.typicode.com/comments";
const ITEMS_PER_PAGE = [10, 25, 50, 75, 100];

export const DataTable = () => {
  const [tableData, setTableData] = useState([]);
  const [maxItemsPerPage, setMaxItemsPerPage] = useState(ITEMS_PER_PAGE[0]);
  const [pageNum, setPageNum] = useState(1);
  const emptyTableMessage = "No results found";
  const lowerBoundItemNumber = ((pageNum - 1) * maxItemsPerPage) ;
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
  const upperBoundItemNumber = () => {
    if ((pageNum * maxItemsPerPage) < tableData.length) {
      return (pageNum * maxItemsPerPage)
    } else {
      return tableData.length
    }
  }

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
    })();
  }, []);

  const updateTableControls = (newValue) => {
    setMaxItemsPerPage(newValue);
    setPageNum(1);
  }

  return (<>
    {
      tableData?.length > 0 &&
      (
        <>
          <div className={styles.inputBar}>
            <Pagination
              id="pagination-datatable"
              totalItems={Math.ceil(tableData.length / maxItemsPerPage)}
              currentItem={pageNum}
              onChange={(value) => setPageNum(value)}
              currentItemAriaLabel="Current Page"
              navigationAriaLabel="Page Control"
            />
            <Label>
              {
                `Displaying ${lowerBoundItemNumber + 1} -
                ${upperBoundItemNumber()} of ${tableData.length} results`
              }
            </Label>
            <Dropdown
              id="maxItemsDropdown"
              onChange={(value) => updateTableControls(value)}
              value={maxItemsPerPage.toString()}
              dropdownItems={
                ITEMS_PER_PAGE.map(
                  item => {
                    return {
                      label: item.toString(),
                      value: item.toString()
                    }
                  }
                )
              }
            />
          </div>


          <Table
            id="dataTable"
            header={tableHeader}
            emptyTableMessage={emptyTableMessage}
            rows={
              tableData.filter(
                (item, index) =>
                  (index >= lowerBoundItemNumber)
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
