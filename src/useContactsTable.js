import _ from "lodash";
import { Fragment, useState, useCallback, Component ,useTable, useHooks } from 'react';
import useApi from "./useApi";

export default function useContactsTable() {
  // Though this is a GET, use a POST & method override because the sorted and
  // filtered params are complex (arrays of objects) for easier parsing.
  const url =
    "https://filtering-sorting-paging-api--mrleebo.repl.co/?_method=GET";
  const [gridState, setGridState] = useState();
  const { results, loading, error, refetch, invalidate } = useApi(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(gridState)
  });

  // Debounce state changes to reduce the spam when filtering
  const onFetchData = useCallback(
    _.debounce(state => {
      const { page, pageSize, sorted, filtered } = state;
      setGridState({ page: page + 1, per: pageSize, sorted, filtered });
    }, 80)
  );

  return {
    gridState: {
      defaultPageSize: 10,
      data: _.get(results, "collection", []),
      pages: _.get(results, "meta.pages", 0),
      filterable: true,
      manual: true,
      onFetchData,
      loading
    },
    error,
    refetch,
    invalidate
  };
}




import React from "react";
import ReactDOM from "react-dom";
import { Fragment, useState, useEffect, Component ,useTable, useHooks } from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
import useContactsTable from "./useContactsTable";

function App(){

const App = useHooks(() => {
  const { gridState, error, refetch, invalidate } = useContactsTable();

  if (error) {
    return (
      <p>
        <span role="img" aria-label="Problem">
          🔧
        </span>{" "}
        Something broke... <button onClick={refetch}>Retry</button>
      </p>
    );
  }

  const columns = [
    {
      accessor: "avatar",
      maxWidth: 50,
      filterable: false,
      sortable: false,
      Cell: props => (
        <div style={{ textAlign: "center" }}>
          <img src={props.value} width={25} alt="" />
        </div>
      )
    },
    { Header: "Name", accessor: "name", maxWidth: 100 },
    { Header: "Email", accessor: "email" },
    { Header: "Website", accessor: "website" },
    { Header: "Specialty", accessor: "specialty" }
  ];

  return (
    <>
      <p>
        Example of using hooks to manage the state of a complex data grid,
        including filters, paging, &amp; multi-column sorting.
      </p>
      <p>
        Searches are cached, so returning to a previous page or set of filters
        will not trigger another request, unless you Refresh or Invalidate the
        Cache using the buttons below.
      </p>
      <button title="Refreshes the current page" onClick={refetch}>
        Refresh
      </button>{" "}
      <button
        title="Clears the cache, forcing every page to refresh"
        onClick={invalidate}
      >
        Invalidate Cache
      </button>
      <div style={{ paddingTop: 10 }}>
        <Table columns={columns} {...gridState} />
      </div>
      <p style={{ textAlign: "center" }}>
        <em>Tip: Shift+click the headers to sort on multiple columns!</em>
      </p>
    </>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
}

/*import "react-table-6/react-table.css" 
import React, { Fragment, useState, useEffect, Component ,useTable } from 'react';
import axios from 'axios';
import {COLUMNS}  from './table'
function App(){
  const [data, setData] = useState([]);
  const columns = React.UseMemo(() => COLUMNS,[] )
 

  const tableInstance = useTable({ columns, data })
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance
  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
        {// Loop over the header rows
        headerGroups.map(headerGroup => (
          // Apply the header row props
          <tr {...headerGroup.getHeaderGroupProps()}>
            {// Loop over the headers in each row
            headerGroup.headers.map(column => (
              // Apply the header cell props
              <th {...column.getHeaderProps()}>
                {// Render the header
                column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      { Apply the table body props }
      <tbody {...getTableBodyProps()}>
        {// Loop over the table rows
        rows.map(row => {
          // Prepare the row for display
          prepareRow(row)
          return (
            // Apply the row props
            <tr {...row.getRowProps()}>
              {// Loop over the rows cells
              row.cells.map(cell => {
                // Apply the cell props
                return (
                  <td {...cell.getCellProps()}>
                    {// Render the cell contents
                    cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>

     /* <div>
          <ul>
              {data.map(item => (
                  <li key={item.id}>
                      <p>{item.name}</p>
                  </li>
              ))}
          </ul>
      </div>
    )
}
    export default App;*/