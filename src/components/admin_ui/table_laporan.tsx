'use client'

import { useReportStore } from "@/stores/reportStore"; // Importing the store
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Filter, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button, Checkbox, CheckboxGroup, IconButton, Input } from "rsuite";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    flexRender
} from '@tanstack/react-table';
import { Loading } from "../common/loading";
import { createReportColumns } from "./report_columns";

export function LaporanTable() {
    const router = useRouter();
    const { reports: rawReports, fetchReports, filters, setFilters } = useReportStore();  // Using the store

    // Transform reports to ensure the correct data structure
    const reports = useMemo(() => {
        return rawReports.map(report => {
            return {
                ...report,
                reporter_full_name: report.reporter_full_name || 'Anonymous'
            };
        });
    }, [rawReports]);

    // State for sorting with TanStack Table
    const [sorting, setSorting] = useState<SortingState>([
        { id: filters.sortColumn, desc: filters.sortType === 'desc' }
    ]);
    const [loading, setLoading] = useState<boolean>(false);

    // State for search and filter
    const [searchQuery, setSearchQuery] = useState<string>(filters.searchQuery);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string[]>(filters.statusFilter);

    // Effect to sync TanStack sorting state with reportStore filters
    useEffect(() => {
        if (sorting.length > 0) {
            const sortColumn = sorting[0].id;
            const sortType = sorting[0].desc ? 'desc' : 'asc';

            setFilters({ sortColumn, sortType });
        }
    }, [sorting, setFilters]);

    useEffect(() => {
        // Fetch reports based on filters and sorting
        let isMounted = true; // Track if component is mounted

        const applyFilters = async () => {
            if (isMounted) setLoading(true);
            try {
                await fetchReports();
            } catch (error) {
                console.error("error fetching reports:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        applyFilters();

        return () => {
            isMounted = false; // Prevent state updates after unmount
        };
    }, [filters.searchQuery, statusFilter, filters.sortColumn, filters.sortType, fetchReports]);// Use the reusable column definitions with a custom navigation handler
    const routingId = (id: string) => {
        router.push(`/admin/report/${id}`);
    };

    // Column definition for TanStack Table using the exported columns
    const columns = useMemo(() => createReportColumns(routingId), []);    // Create table instance
    const table = useReactTable({
        data: reports,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const handleSearchChange = (value: string) => {
        // Hapus sanitasi yang terlalu ketat agar karakter khusus seperti '-' pada ID bisa dicari
        setSearchQuery(value); // Update UI immediately
    }; const handleSearchSubmit = () => {
        setFilters({ searchQuery: searchQuery });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setFilters({ searchQuery: '' });
    };

    return (
        <LayoutGroup>
            <div className="w-full sm:h-full h-fit">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex sm:justify-between  sm:flex-row flex-col sm:gap-0 gap-4 items-start">
                        <h2 className="text-xl font-semibold">Laporan Masuk</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative w-fit">
                                <Input
                                    placeholder="Cari laporan..."
                                    value={searchQuery}
                                    onChange={(value) => {
                                        handleSearchChange(value);
                                    }}
                                    onPressEnter={handleSearchSubmit}
                                    className="pr-8"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute right-2 top-2"
                                    >
                                        <X size={16} className="text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>
                            <IconButton
                                icon={<Search size={16} />}
                                appearance="primary"
                                color="green"
                                onClick={handleSearchSubmit}
                                className="bg-[#E6FFFA] text-[#10B981] hover:bg-[#D1FAE5]"
                            />
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
                                className="p-3 w-[91vw] overflow-x-scroll bg-white rounded-md border border-[#E6FFFA] shadow-md origin-top"
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
                                        className="mt-2 flex items-center justify-start"
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
                <div className="w-[93vw] sm:w-full overflow-x-scroll sm:h-[75vh] h-[70vh] rounded-md border border-gray-200 bg-white">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#E6FFFA] text-[#6B7280] sticky top-0 z-10">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 font-medium text-base"
                                            style={{
                                                cursor: header.column.getCanSort() ? 'pointer' : 'default',
                                            }}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center gap-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}

                                                {/* Sorting indicators */}
                                                {header.column.getIsSorted() === 'asc' && (
                                                    <ChevronUp size={16} className="text-[#3CB371]" />
                                                )}
                                                {header.column.getIsSorted() === 'desc' && (
                                                    <ChevronDown size={16} className="text-[#3CB371]" />
                                                )}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="overflow-y-scroll">
                            {loading ? (
                                <tr>
                                    <td colSpan={table.getAllColumns().length} className="px-6 py-8  text-center text-gray-400">
                                        <Loading text="load data..." fullScreen={false} />
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <tr
                                        key={row.id}
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Empty state */}
                    {reports.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500">
                            Tidak ada laporan yang ditemukan
                        </div>
                    )}
                </div>
            </div>
        </LayoutGroup >
    );
}
