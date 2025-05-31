'use client'


import { useReportStore } from "@/stores/reportStore"; // Importing the store
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ExternalLink, Filter, Search, SortAsc, SortDesc, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Checkbox, CheckboxGroup, IconButton, Input, InputGroup, Table } from "rsuite";
import { Cell, HeaderCell } from "rsuite-table";
import Column from "rsuite/esm/Table/TableColumn";
import { StatusTag } from "../common/tag";
import { debounce } from 'lodash';


export function LaporanTable() {
    const router = useRouter();
    const { reports, fetchReports, filters, setFilters } = useReportStore();  // Using the store

    // State for sorting
    const [sortColumn, setSortColumn] = useState<string>(filters.sortColumn);
    const [sortType, setSortType] = useState<'asc' | 'desc' | undefined>(filters.sortType);
    const [loading, setLoading] = useState<boolean>(false);

    // State for search and filter
    const [searchQuery, setSearchQuery] = useState<string>(filters.searchQuery);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string[]>(filters.statusFilter);

    useEffect(() => {
        // Fetch reports based on filters and sorting
        const applyFilters = async () => {
            setLoading(true);
            try {
                await fetchReports();
            } catch (error) {
                console.error("error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        }
        applyFilters();
    }, [searchQuery, statusFilter, sortColumn, sortType, fetchReports]);

    const handleSortColumn = async (sortColumn: string, sortType: 'asc' | 'desc' | undefined) => {
        setSortColumn(sortColumn);
        setSortType(sortType || 'asc');

        await setFilters({ sortColumn, sortType: sortType || 'asc' });
    };

    const debouncedSetFilters = debounce((query) => {
        setFilters({ searchQuery: query });
        setLoading(true);
    }, 300);

    const handleSearchChange = (value: string) => {
        const sanitizedValue = value.replace(/[^\w\s]/gi, '');
        setSearchQuery(sanitizedValue); // Update UI immediately
        debouncedSetFilters(sanitizedValue); // Debounce the API call
    };

    const routingId = (id: string) => {
        router.push(`/admin/report/${id}`);
    };

    return (
        <LayoutGroup>
            <div className="w-full">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex sm:justify-between  sm:flex-row flex-col sm:gap-0 gap-4 items-start">
                        <h2 className="text-xl font-semibold">Laporan Masuk</h2>
                        <div className="flex items-center gap-2">
                            <InputGroup className="w-64">
                                <Input
                                    placeholder="Cari laporan..."
                                    value={searchQuery}
                                    onChange={(value) => {
                                        handleSearchChange(value);
                                    }}
                                />
                                <InputGroup.Addon
                                    className="bg-[#E6FFFA] cursor-pointer hover:bg-[#D1FAE5]"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setLoading(true);
                                    }}
                                >
                                    {searchQuery ? (
                                        <X size={16} className="text-white" />
                                    ) : (
                                        <Search size={16} className="text-white" />
                                    )}
                                </InputGroup.Addon>
                            </InputGroup>
                            {/* Tombol Filter */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <IconButton
                                    icon={<Filter size={16} />}
                                    appearance={showFilters ? "primary" : "subtle"}
                                    color={showFilters ? "green" : undefined}
                                    onClick={() => setShowFilters(!showFilters)}
                                />
                            </motion.div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                layout
                                key="filter-panel"
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="p-3 bg-white rounded-md border border-[#E6FFFA] shadow-md origin-top"
                            >
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-sm text-[#3CB371] font-medium mb-2"
                                >
                                    Filter Status:
                                </motion.h3>
                                <CheckboxGroup
                                    inline
                                    name="statusFilter"
                                    value={statusFilter}
                                    onChange={(value) => {
                                        setStatusFilter(value.map(item => String(item)));
                                        setLoading(true);
                                        setFilters({ statusFilter: value.map(item => String(item)) });
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <Checkbox value="new">
                                            <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                                                Baru
                                            </span>
                                        </Checkbox>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Checkbox value="in_progress">
                                            <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full text-xs">
                                                Diproses
                                            </span>
                                        </Checkbox>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.25 }}
                                    >
                                        <Checkbox value="completed">
                                            <span className="text-[#047857] bg-[#D1FAE5] px-2 py-0.5 rounded-full text-xs">
                                                Selesai
                                            </span>
                                        </Checkbox>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Checkbox value="rejected">
                                            <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-xs">
                                                Ditolak
                                            </span>
                                        </Checkbox>
                                    </motion.div>
                                </CheckboxGroup>
                                {statusFilter.length > 0 && (
                                    <motion.div
                                        className="mt-2 flex items-center justify-end"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.35 }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button
                                                size="sm"
                                                appearance="link"
                                                onClick={() => {
                                                    setStatusFilter([]);
                                                    setLoading(true);
                                                    setFilters({ statusFilter: [] });
                                                }}
                                                className="text-[#6B7280] hover:text-[#3CB371]"
                                            >
                                                Reset Filter
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Table Displaying Reports */}
                <Table
                    data={reports}
                    autoHeight
                    hover={true}
                    rowClassName={"list"}
                    loading={loading}
                    sortColumn={sortColumn}
                    sortType={sortType}
                    onSortColumn={handleSortColumn}
                    className="custom-sortable-table"
                >
                    <Column align="left" flexGrow={2} sortable>
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">ID Laporan</h3>
                        </HeaderCell>
                        <Cell dataKey="id" />
                    </Column>

                    <Column align="left" flexGrow={2} sortable>
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">Pelapor</h3>
                        </HeaderCell>
                        <Cell dataKey="reporter_full_name">
                            {(rowData) => rowData.reporter_full_name || 'Anonymous'}
                        </Cell>
                    </Column>

                    <Column align="left" flexGrow={3} sortable>
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">Tanggal</h3>
                        </HeaderCell>
                        <Cell dataKey="created_at">
                            {(rowData) => {
                                const date = new Date(rowData.created_at);
                                return date.toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                });
                            }}
                        </Cell>
                    </Column>

                    <Column align="center" flexGrow={2} sortable>
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">Status</h3>
                        </HeaderCell>
                        <Cell dataKey="status">
                            {(rowData) => <StatusTag status={rowData.status} />}
                        </Cell>
                    </Column>

                    <Column flexGrow={1} align="center" >
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">Aksi</h3>
                        </HeaderCell>
                        <Cell dataKey="id">
                            {(rowdata) => {
                                const id = rowdata.id;
                                return (
                                    <button
                                        onClick={() => routingId(id)}
                                        className="flex items-center justify-center text-green-600 hover:text-green-800 cursor-pointer"
                                    >
                                        <ExternalLink size={16} className="mr-1" />
                                        <span>Detail</span>
                                    </button>
                                )
                            }}
                        </Cell>
                    </Column>
                </Table>
            </div>
        </LayoutGroup >
    );
}
