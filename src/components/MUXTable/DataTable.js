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
const EMPTY_TABLE_MESSAGE = "No results found";
const TABLE_HEADER = [
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

export const DataTable = () => {
  const [tableData, setTableData] = useState([]);
  const [maxItemsPerPage, setMaxItemsPerPage] = useState(ITEMS_PER_PAGE[0]);
  const [pageNum, setPageNum] = useState(1);
  const lowerBoundItemNumber = ((pageNum - 1) * maxItemsPerPage);
  const upperBoundItemNumber = pageNum * maxItemsPerPage;

  const pageBoundsComputation = (itemCount) => {
    if (itemCount < tableData.length) {
      return itemCount;
    } else {
      return tableData.length;
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
            label: body,
          },
        }
      });
      setTableData(fetchData);
    })();
  }, []);

  const updateTableControls = (newValue) => {
    setMaxItemsPerPage(newValue);
  }

  return (<>
    {
      tableData?.length > 0 &&
      (
        <>
          <div className={styles.inputBar}>
            <Pagination
              currentItem={pageNum}
              currentItemAriaLabel="Current Page"
              id="pagination-datatable"
              navigationAriaLabel="Page Control"
              onChange={(value) => setPageNum(value)}
              totalItems={
                Math.ceil(
                  tableData.length / maxItemsPerPage
                )
              }
            />
            <Label>
              {
                `Displaying ${pageBoundsComputation(lowerBoundItemNumber) + 1} -
                ${pageBoundsComputation(upperBoundItemNumber)}
                of ${tableData.length} results`
              }
            </Label>
            <div className={styles.pageCountDropdown}>
              <Label>Rows per page:</Label>
              <Dropdown
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
                id="maxItemsDropdown"
                onChange={(value) => updateTableControls(value)}
                width="100px"
                value={maxItemsPerPage.toString()}
              />
            </div>

          </div>
          <Table
            emptyTableMessage={EMPTY_TABLE_MESSAGE}
            header={TABLE_HEADER}
            id="dataTable"
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
