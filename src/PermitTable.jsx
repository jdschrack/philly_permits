import { useEffect, useState } from "react";

const PermitTable = () => {
  const [limit, setLimit] = useState(1000);
  const [offset, setOffset] = useState(0);
  const [rawQuery, setRawQuery] = useState("");
  const nextPage = () => {
    setOffset(offset + limit);
    getData();
  };

  const prevPage = () => {
    if (offset !== 0) {
      setOffset(offset - limit);
      getData();
    }
  };

  const [columns, setColumns] = useState([]);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [csvData, setCsvData] = useState("");
  const getData = () => {
    let url = new URL("https://phl.carto.com/api/v2/sql");

    let query = `select * from permits order by cartodb_id desc limit ${limit} offset ${offset}`;

    fetch(`${url}?q=${encodeURIComponent(query)}`).then((resp) => {
      resp.json().then((respData) => {
        let dataColumns = Object.keys(respData.rows[0]).map((x) => x);
        setColumns(dataColumns);
        setData(respData.rows);
        let csvHeaders = dataColumns.join("|");
        let csvBody = respData.rows
          .map((rd) =>
            Object.values(rd)
              .map((i, k) => i)
              .join("|")
          )
          .map((x) => `"${x.replace(/(\r\n)+/g, "")}"\n`);
        setCsvData(`${csvHeaders}\n${csvBody.join("")}`);
      });
    });
  };

  const submitQuery = () => {
    let url = new URL("https://phl.carto.com/api/v2/sql");

    fetch(`${url}?q=${encodeURIComponent(rawQuery)}`).then((resp) => {
      resp.json().then((respData) => {
        let dataColumns = Object.keys(respData.rows[0]).map((x) => x);
        setColumns(dataColumns);
        setData(respData.rows);
        let csvHeaders = dataColumns.join("|");
        let csvBody = respData.rows
          .map((rd) =>
            Object.values(rd)
              .map((i, k) => i)
              .join("|")
          )
          .map((x) => `"${x.replace(/(\r\n)+/g, "")}"\n`);
        setCsvData(`${csvHeaders}\n${csvBody.join("")}`);
      });
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <textarea
        style={{ width: "100vw", padding: "8px", margin: "12px 0" }}
        value={rawQuery}
        onChange={(e) => setRawQuery(e.target.value)}
      ></textarea>
      <button onClick={() => submitQuery()}>Run Query</button>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            borderRadius: "8px",
            padding: "16px 24px",
            cursor: "pointer",
            color: "#414142",
            border: "1px solid #414142"
          }}
          onClick={() => prevPage()}
        >
          {"<"}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            padding: "0 16px"
          }}
        >
          Page: {offset / limit + 1} of {Math.round(recordCount / limit)}
          <br />
          Records: {data?.length}
          <br />
          Total: {recordCount}
        </div>
        <div
          style={{
            borderRadius: "8px",
            padding: "16px 24px",
            cursor: "pointer",
            color: "#414142",
            border: "1px solid #414142"
          }}
          onClick={() => nextPage()}
        >
          {">"}
        </div>
      </div>
      <div style={{display: "flex", justifyContent: "center", alignItems: "center" width: "100vw", height: "auto"}}>
      <table style={{ paddingTop: "24px" }}>
        <thead>
          <tr>
            {columns.map((col, idx) => {
              return <th key={idx}>{col}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            return (
              <tr key={idx}>
                {Object.values(row).map((key, value) => {
                  return <td key={value}>{key}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default PermitTable;
