import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { IFeedback } from '../../model/UtilityService/IFeedback';
import { fetchAllFeedbacks, fetchFeedbackReport } from '../../store/feature/utilitySlice';
import {
    DataGrid,
    GridColDef,
    GridRowSelectionModel,
} from "@mui/x-data-grid";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from "@mui/material";
import { useTranslation } from 'react-i18next';
import { IFeedbackReport } from '../../model/UtilityService/IFeedbackReport';

const FeedbackPage = () => {
    const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const [feedbackList, setFeedbackList] = useState<IFeedback[]>([]);
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState<IFeedback | null>(null);
    const [feedbackReport, setFeedbackReport] = useState<IFeedbackReport | null>(null);
    const [openReportModal, setOpenReportModal] = useState(false);

    const { t } = useTranslation();

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'description', headerName: t("utility.feedbackDetailDescription"), width: 300 },
        { field: 'rating', headerName: t("utility.feedbackDetailRating"), width: 150 },
    ];

    const fetchDataset = () => {
        setLoading(true);
        dispatch(fetchAllFeedbacks({ page: 0, size: 100, searchText }))
            .unwrap()
            .then((data) => {
                setFeedbackList(data.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchReport = () => {
        setLoading(true);
        dispatch(fetchFeedbackReport())
            .unwrap()
            .then((data) => {
                setFeedbackReport(data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDataset();
        fetchReport();
    }, [dispatch, searchText]);

    const handleRowSelection = (newSelectionModel: GridRowSelectionModel) => {
        setSelectedRowIds(newSelectionModel as number[]);
        if (newSelectionModel.length > 0) {
            const selectedId = newSelectionModel[0] as number;
            const feedbackItem = feedbackList.find(item => item.id === selectedId);
            setSelectedFeedback(feedbackItem || null);
            handleOpenFeedbackModal();
        } else {
            setSelectedFeedback(null);
        }
    };

    const handleOpenFeedbackModal = () => {
        setOpenFeedbackModal(true);
    };

    const handleOpenReportModal = () => {
        setOpenReportModal(true);
    };

    return (
        <div>
            <TextField
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("utility.search")}
                variant="outlined"
                style={{ marginTop: '20px', marginBottom: '20px', marginLeft: '10px' }}
             
            />
            <Button variant="contained" onClick={handleOpenReportModal}  style={{ marginTop: '20px', marginBottom: '20px',marginLeft: '10px' }}>
                {t("utility.Show Feedback Report")}
            </Button>
            <DataGrid
                rows={feedbackList}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 1, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick={true}
                onRowSelectionModelChange={handleRowSelection}
                rowSelectionModel={selectedRowIds}
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
            <Dialog open={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)}>
                <DialogTitle>{t("utility.feedbackDetailTitle")}</DialogTitle>
                <DialogContent>
                    {selectedFeedback && (
                        <>
                            <div><strong>ID:</strong> {selectedFeedback.id}</div>
                            <div><strong>{t("utility.feedbackDetailDescription")}:</strong> {selectedFeedback.description}</div>
                            <div><strong>{t("utility.feedbackDetailRating")}:</strong> {selectedFeedback.rating}</div>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenFeedbackModal(false)}>{t("utility.feedbackDetailCloseButton")}</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog open={openReportModal} onClose={() => setOpenReportModal(false)}>
                <DialogTitle>{t("utility.Feedback Report")}</DialogTitle>
                <DialogContent>
                    {feedbackReport ? (
                        <div>
                            <p><strong>{t("utility.Total Feedbacks")}:</strong> {feedbackReport.totalFeedbacks}</p>
                            <p><strong>{t("utility.Average Rating")}:</strong> {feedbackReport.averageRating}</p>
                           
                        </div>
                    ) : (
                        <p>{t("utility.No report data available")}</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReportModal(false)}>{t("utility.feedbackDetailCloseButton")}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FeedbackPage;

