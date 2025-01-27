const DynamicTable = ({ data }) => {
    // Handle cases where data is null, undefined, or not an array
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <p>No data available : <pre>{JSON.stringify(data)}</pre></p>;
      }
  
    // Extract table headers from the JSON keys
    const headers = Object.keys(data[0]);
  
    return (
      <table style={{ border: "1px solid black", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} style={{ border: "1px solid black", padding: "8px" }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header} style={{ border: "1px solid black", padding: "8px" }}>
                  {row[header] !== undefined ? row[header] : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default DynamicTable;
  