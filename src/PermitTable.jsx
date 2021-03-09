import { useEffect, useState } from "react";

const PermitTable = () => {
  const [rawQuery, setRawQuery] = useState("");

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  const submitQuery = () => {
    let url = new URL("https://phl.carto.com/api/v2/sql");

    fetch(`${url}?q=${encodeURIComponent(rawQuery)}`).then((resp) => {
      resp.json().then((respData) => {
        let dataColumns = Object.keys(respData.rows[0]).map((x) => x);
        setColumns(dataColumns);
        setData(respData.rows);
      });
    });
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      margin: "32px",
      backgroundColor: "#fff",
      padding: "16px",
      borderRadius: "16px",
      height: "90vh",
      alignItems: "stretch",
      boxShadow:
        "0px 4px 5px rgba(0, 0, 0, 0.08), 0px 0.500862px 0.626078px rgba(0, 0, 0, 0.04)",
    },
    tableContainer: {
      display: "flex",
      flex: "1 1 auto",
      overflow: "auto",
      flexDirection: "column",
    },
    searchContainer: {
      display: "flex",
      flexDirection: "column",
      flex: "0 1 auto",
    },
    button: {
      padding: "8px 16px",
      backgroundColor: "#414142",
      color: "white",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchContainer}>
        <textarea
          style={{ padding: "8px", margin: "12px" }}
          value={rawQuery}
          onChange={(e) => setRawQuery(e.target.value)}
        ></textarea>
        <button style={styles.button} onClick={() => submitQuery()}>
          Run Query
        </button>
      </div>
      <div>
        <h3>Results</h3>
      </div>
      <div style={styles.tableContainer}>
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
                    return (
                      <td
                        key={value}
                        style={!key ? { color: "#cfcfcf" } : { color: "black" }}
                      >
                        {key ?? "[null]"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermitTable;
