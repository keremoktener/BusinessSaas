import React, {useEffect, useState} from "react";
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel, GridToolbar,
} from "@mui/x-data-grid";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, IconButton,
    TextField

} from "@mui/material";

import {useDispatch} from "react-redux";
import {AppDispatch, useAppSelector} from "../../store";
import {
    fetchFindAllActivities,
} from "../../store/feature/crmSlice.tsx";
import {useTranslation} from "react-i18next";
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, {Dayjs} from "dayjs";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ActivityPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');
    const [code, setCode] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState<Dayjs | null>(dayjs());

    const dispatch = useDispatch<AppDispatch>();
    const activities = useAppSelector((state) => state.crmSlice.activitiesList);


    const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
    const {t} = useTranslation();

    useEffect(() => {
        dispatch(fetchFindAllActivities({
            page: 0,
            size: 500,
            searchText: searchText,
        }));
    }, [dispatch,searchText]);


    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
    }


    const columns: GridColDef[] = [

        {field: "code", headerName: t("crmService.code"), flex: 1.5, headerAlign: "center"},
        {field: "type", headerName: t("crmService.type"), flex: 1.5, headerAlign: "center"},
        {field: "message", headerName: t("crmService.notes"), flex: 1.5, headerAlign: "center"},
        {field: "date", headerName: t("crmService.date"), flex: 1.5, headerAlign: "center"},
        {
            field: "details", headerName: t("crmService.details"), flex: 1.5, headerAlign: "center", renderCell: (params) => (
                <IconButton >
                    <VisibilityIcon />
                </IconButton>
            ),
        },


    ];


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div style={{height: "auto"}}>

                <TextField
                    label={t("crmService.search-by-code")}
                    variant="outlined"
                    onChange={(event) => {
                        setSearchText(event.target.value);
                    }}
                    value={searchText}
                    style={{marginBottom: "1%", marginTop: "1%"}}
                    fullWidth
                    inputProps={{maxLength: 50}}
                />


                <DataGrid
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    rows={activities}
                    getRowId={(row) => row.uuid}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 1, pageSize: 5},
                        }
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    autoHeight={true}
                    sx={{
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "rgba(224, 224, 224, 1)",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            textAlign: "center",
                            fontWeight: "bold",
                        },
                        "& .MuiDataGrid-cell": {
                            textAlign: "center",
                        },

                    }}
                    localeText={{
                        toolbarColumns: t("dataGrid.toolbarColumns"),
                        toolbarColumnsLabel: t("dataGrid.toolbarColumnsLabel"),
                        toolbarFilters: t("dataGrid.toolbarFilters"),
                        toolbarFiltersLabel: t("dataGrid.toolbarFiltersLabel"),
                        toolbarDensity: t("dataGrid.toolbarDensity"),
                        toolbarDensityLabel: t("dataGrid.toolbarDensityLabel"),
                        toolbarDensityStandard: t("dataGrid.toolbarDensityStandard"),
                        toolbarDensityComfortable: t("dataGrid.toolbarDensityComfortable"),
                        columnsManagementSearchTitle: t("dataGrid.columnsManagementSearchTitle"),
                        columnsManagementShowHideAllText: t("dataGrid.columnsManagementShowHideAllText"),
                        toolbarDensityCompact: t("dataGrid.toolbarDensityCompact"),
                        toolbarExport: t("dataGrid.toolbarExport"),
                        toolbarExportLabel: t("dataGrid.toolbarExportLabel"),
                        toolbarExportCSV: t("dataGrid.toolbarExportCSV"),
                        toolbarExportPrint: t("dataGrid.toolbarExportPrint"),
                        noRowsLabel: t("dataGrid.noRowsLabel"),
                        noResultsOverlayLabel: t("dataGrid.noResultsOverlayLabel"),
                        footerRowSelected: (count) =>
                            count !== 1
                                ? `${count.toLocaleString()} ${t("dataGrid.footerRowSelected")}`
                                : `${count.toLocaleString()} ${t("dataGrid.footerRowSelected")}`,
                        footerTotalRows: t("dataGrid.footerTotalRows"),
                        columnMenuLabel: t("dataGrid.columnMenuLabel"),
                        columnMenuShowColumns: t("dataGrid.columnMenuShowColumns"),
                        columnMenuFilter: t("dataGrid.columnMenuFilter"),
                        columnMenuHideColumn: t("dataGrid.columnMenuHideColumn"),
                        columnMenuUnsort: t("dataGrid.columnMenuUnsort"),
                        columnMenuSortAsc: t("dataGrid.columnMenuSortAsc"),
                        columnMenuSortDesc: t("dataGrid.columnMenuSortDesc"),
                        MuiTablePagination: {
                            labelRowsPerPage: t("dataGrid.labelRowsPerPage")
                        }
                    }}

                />
                <Grid container spacing={2} sx={{
                    flexGrow: 1,
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                    marginTop: '2%',
                    marginBottom: '2%'
                }}>

                </Grid>


            </div>
        </LocalizationProvider>
    );

}
export default ActivityPage;