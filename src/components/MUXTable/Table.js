import { useState, useEffect } from "react";
import axios from "axios";

const fetchUrl = "https://jsonplaceholder.typicode.com/comments";

export const Table = () => {
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    console.log("inside useEffect");
    (async () => {
      console.log("inside async");
      const { data } = await axios.get(fetchUrl);

      console.log(data);
      console.log("after await");
      setTableData(data);
    })();

    console.log("after IIFE");
  }, []);

  return <>{tableData}</>;
};
