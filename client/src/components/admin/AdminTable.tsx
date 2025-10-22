import React from "react";

export type Column<T> = {
  header: string;
  accessor?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
};

interface AdminTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  rowKey?: (item: T, index: number) => string | number;
  className?: string;
}

export function AdminTable<T>({
  title,
  data,
  columns,
  rowKey = (_, index) => index,
  className = "",
}: AdminTableProps<T>) {
  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <p className="card-title">{title}</p>
      </div>
      <div className="card-body p-0">
        <div className="relative h-auto w-full overflow-auto rounded-none [scrollbar-width:_thin]">
          <table className="table table-fixed w-full min-w-[700px] border-collapse">
            <thead className="table-header">
              <tr className="table-row">
                {columns.map((col, i) => (
                  <th key={i} className={`table-head ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="table-body">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr key={rowKey(item, rowIndex)} className="table-row">
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`table-cell ${col.className || ""}`}
                      >
                        {col.render
                          ? col.render(item, rowIndex)
                          : (item[col.accessor as keyof T] as React.ReactNode) ??
                            ""}
                      </td>
                    ))}
                  </tr>  
                ))   
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
