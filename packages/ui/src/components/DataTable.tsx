/**
 * @file packages/ui/src/components/DataTable.tsx
 * @description Standardized high-performance institutional quantitative data table.
 */

import type { HTMLAttributes, Key, ReactNode } from "react";
import { cn, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@yuva-devlab/ui";

/**
 * Column definition for DataTable.
 */
export interface Column<T> {
  /** Column header title or node */
  readonly header: ReactNode;
  /** Value or element accessor for the row */
  readonly accessor: (item: T) => ReactNode;
  /** Custom CSS class names applied to the column cells */
  readonly className?: string;
  /** Custom CSS class names applied to the header cell */
  readonly headerClassName?: string;
}

/**
 * Props for the DataTable component.
 */
export interface DataTableProps<T> extends HTMLAttributes<HTMLDivElement> {
  /** Dataset items to render */
  readonly data: readonly T[];
  /** Column schema configuration */
  readonly columns: readonly Column<T>[];
  /** Unique key generator for rows */
  readonly rowKey: (item: T) => Key;
  /** Optional row click handler */
  readonly onRowClick?: (item: T) => void;
  /** Empty state message or custom element */
  readonly emptyMessage?: ReactNode;
  /** Custom class name applied to table element */
  readonly tableClassName?: string;
}

/**
 * High-density quantitative financial table with accessible markup.
 *
 * @param props - Data, columns, row keys, and interaction handlers.
 * @returns Rendered JSX DataTable element.
 */
export function DataTable<T>({
  data,
  columns,
  rowKey,
  onRowClick,
  emptyMessage = "No quantitative records match current filters.",
  tableClassName,
  className,
  ...rest
}: DataTableProps<T>) {
  return (
    <div className={cn("quant-table-container", className)} {...rest}>
      <Table className={cn("quant-table", tableClassName)}>
        <TableHeader>
          <TableRow>
            {columns.map((col, idx) => (
              <TableHead
                key={idx}
                scope="col"
                className={cn("quant-th", col.headerClassName ?? col.className)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="quant-table-empty" aria-live="polite">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow
                key={rowKey(item)}
                className={cn(onRowClick ? "table-row-hover table-row-interactive" : "")}
                onClick={() => onRowClick?.(item)}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick(item);
                        }
                      }
                    : undefined
                }
              >
                {columns.map((col, idx) => (
                  <TableCell key={idx} className={cn("quant-td", col.className)}>
                    {col.accessor(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
