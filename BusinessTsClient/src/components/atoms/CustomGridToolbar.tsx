import {
    GridToolbarContainer,
    useGridApiContext,
} from '@mui/x-data-grid';
import { MenuItem, Menu, Button } from '@mui/material';
import { useState, useCallback } from 'react';
import GetAppIcon from '@mui/icons-material/GetApp';

/**
 * Custom toolbar component for the data grid that provides export options.
 * @returns {JSX.Element} The rendered toolbar component.
 */
export const CustomGridToolbar = () => {
    const apiRef = useGridApiContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Handles custom print logic, creating a printable version of the grid data.
    const handleCustomPrint = useCallback(() => {
        const columns = apiRef.current.getVisibleColumns();
        const rows = apiRef.current.getRowModels();

        const printWindow = window.open('', '', 'width=900,height=650');
        if (!printWindow) return;

        const printDocument = printWindow.document;
        printDocument.write('<html><head><title>Print DataGrid</title>');
        printDocument.write('<style>');
        printDocument.write(`
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid black;
          padding: 5px;
          text-align: left;
          font-size: 12px;
        }
        .page-break {
          page-break-before: always;
        }
      `);
        printDocument.write('</style></head><body>');

        const maxColumnsPerPage = 8; // Limit columns per printed page
        for (let i = 0; i < columns.length; i += maxColumnsPerPage) {
            printDocument.write('<table>');
            printDocument.write('<thead><tr>');
            columns.slice(i, i + maxColumnsPerPage).forEach((col) => {
                printDocument.write(`<th>${col.headerName || col.field}</th>`); // Write table headers
            });
            printDocument.write('</tr></thead><tbody>');

            rows.forEach((row) => {
                printDocument.write('<tr>');
                columns.slice(i, i + maxColumnsPerPage).forEach((col) => {
                    printDocument.write(`<td>${row[col.field]}</td>`); // Write table cells
                });
                printDocument.write('</tr>');
            });

            printDocument.write('</tbody></table>');

            // Insert page break if there are more columns to print
            if (i + maxColumnsPerPage < columns.length) {
                printDocument.write('<div class="page-break"></div>');
            }
        }

        printDocument.write('</body></html>');
        printDocument.close();

        printWindow.focus();
        printWindow.print();
    }, [apiRef]);

    // Opens the export menu.
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Closes the export menu.
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <GridToolbarContainer>
            <Button
                onClick={handleMenuOpen}
                aria-controls="custom-export-menu"
                aria-haspopup="true"
                startIcon={<GetAppIcon />}
            >
                Export
            </Button>
            <Menu
                id="custom-export-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { apiRef.current.exportDataAsCsv(); handleMenuClose(); }}>
                    Download as CSV
                </MenuItem>
                <MenuItem onClick={() => { handleCustomPrint(); handleMenuClose(); }}>
                    Print
                </MenuItem>
            </Menu>
        </GridToolbarContainer>
    );
};