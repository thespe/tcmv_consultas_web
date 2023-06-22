import React, { useMemo } from 'react';
import { useSortBy, useTable } from 'react-table';
import './styles.css'; // Import your custom CSS styles
const jsonData = require('./data.json');

// Obtener nombres de columnas
const getHeadings = (data) => {
  return [...new Set(data.flatMap((item) => Object.keys(item)))];
};

// Para solucionar "Objects are not valid as a React child (found: object with keys {hours})" - el resultado de calcular la diferencia entre horas en psql es un objeto
const formatTimeDifference = (timeObj) => {
  // si >1h
  if (timeObj && timeObj.hours !== undefined && timeObj.minutes !== undefined && timeObj.seconds !== undefined) {
    const hours = timeObj.hours.toString().padStart(2, '0');
    const minutes = timeObj.minutes.toString().padStart(2, '0');
    const seconds = timeObj.seconds.toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  // si >1min
  else if (timeObj && timeObj.minutes !== undefined && timeObj.seconds !== undefined) {
    const minutes = timeObj.minutes.toString().padStart(2, '0');
    const seconds = timeObj.seconds.toString().padStart(2, '0');
    return `00:${minutes}:${seconds}`;
  }
  // si <1min
  else if (timeObj && timeObj.seconds !== undefined) {
    const seconds = timeObj.seconds.toString().padStart(2, '0');
    return `00:00:${seconds}`;
  }
};

export default function DataTable() {
  const headings = useMemo(() => getHeadings(jsonData), []);
  const columns = useMemo(
    () =>
      headings.map((heading) => ({
        Header: heading,
        accessor: heading,
        Cell: ({ value }) =>
          heading.startsWith('Tiempo a origen') ? formatTimeDifference(value)
          : heading.startsWith('Diferencia') ? formatTimeDifference(value)
            : value || '',
      })),
    [headings]
  );

  const data = useMemo(() => jsonData.map((row, index) => ({ ...row, id: index + 1 })), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy);

  return (
    <div>
      <a href={require("./tabla.csv")} download="tabla.csv">Descargar CSV</a>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className='th'>
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? '🔽' : '🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, cellIndex) => {
                  if (row.cells[cellIndex].column.Header === "Hora de llegada (SAE)" || row.cells[cellIndex].column.Header === "Hora de salida (SAE)") {
                    const previousCellValue = rowIndex > 0 ? rows[rowIndex - 1].cells[cellIndex].value : null;
                    const isGreater = previousCellValue !== null && cell.value > previousCellValue;
                    return (<td {...cell.getCellProps()} className='td' style={{ backgroundColor: isGreater ? 'red' : null }}>{cell.render('Cell')}</td>
                    )
                  } else {
                    return (<td {...cell.getCellProps()} className='td'>{cell.render('Cell')}</td>
                    )
                  }
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}