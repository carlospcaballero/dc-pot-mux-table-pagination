import {
  useState,
  useEffect,
} from "react";
import {
  Table,
  Pagination
} from "@awesomecomponents/mux/core/components"
import axios from "axios";

const fetchUrl = "https://jsonplaceholder.typicode.com/comments";

export const DataTable = () => {
  const [tableData, setTableData] = useState([]);
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
      const { data } = await axios.get(fetchUrl);
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

  return (<>
    {
      tableData?.length > 0 &&
      (
        <Table
          id="dataTable"
          header={tableHeader}
          emptyTableMessage={emptyTableMessage}
          rows={tableData}
        />
      )
    }
    { tableData.length === 0 && <span>Spinner</span>}
  </>);
};
