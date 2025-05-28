'use client'

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { ExternalLink, Filter, Search, SortAsc, SortDesc, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Checkbox, CheckboxGroup, IconButton, Input, InputGroup, Table } from "rsuite";
import { Cell, HeaderCell } from "rsuite-table";
import Column from "rsuite/esm/Table/TableColumn";
import { StatusTag } from "../common/tag";

// import keperluan backend
import type { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Report {
    id: string;
    title: string;
    status: 'new' | 'in_progress' | 'completed' | 'rejected';
    created_at: string;
    reporter: {
        id: string;
        full_name: string;
    };
}

export function LaporanTable() {
    const router = useRouter();
    const supabase = createClientComponentClient<Database>();

    // State for sorting
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortType, setSortType] = useState<'asc' | 'desc' | undefined>('asc');
    const [loading, setLoading] = useState<boolean>(false);

    // State for search and filter
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    // State for reports
    const [reports, setReports] = useState<Report[]>([]);

    // Add useEffect to update table when any filter or sort changes
    useEffect(() => {
        async function fetchReports() {
            try {
                let query = supabase
                    .from('reports')
                    .select(`
                        id,
                        title,
                        status,
                        created_at,
                        reporter:users!reports_reporter_id_fkey (
                            id,
                            full_name
                        )
                    `);

                // Apply search query
                if (searchQuery.trim()) {
                    query = query
                        .filter('id::text', 'ilike', `%${searchQuery}%`)
                        .filter('reporter.full_name', 'ilike', `%${searchQuery}%`);
                }

                // Apply status filters
                if (statusFilter.length > 0) {
                    query = query.in('status', statusFilter);
                }

                // Apply sorting
                query = query.order(sortColumn || 'created_at', {
                    ascending: sortType === 'asc',
                    nullsFirst: false
                });

                const { data, error } = await query;

                if (error) {
                    throw new Error(error.message);
                }

                setReports(data as unknown as Report[]);
            } catch (error) {
                console.error('Error fetching reports:', error);
            } finally {
                setLoading(false);
            }
        }

        setLoading(true);
        const timer = setTimeout(() => {
            fetchReports();
        }, 300);

        return () => clearTimeout(timer);
    }, [supabase, searchQuery, statusFilter, sortColumn, sortType]);

    // Handle sort change
    const handleSortColumn = (sortColumn: string, sortType: 'asc' | 'desc' | undefined) => {
        setLoading(true);
        setSortColumn(sortColumn);
        setSortType(sortType || 'asc');
    };

    // Direct sort functions
    const sortByDate = () => {
        setLoading(true);
        if (sortColumn === 'created_at' && sortType === 'asc') {
            setSortType('desc');
        } else {
            setSortColumn('created_at');
            setSortType('asc');
        }
    };

    const sortByStatus = () => {
        setLoading(true);
        if (sortColumn === 'status' && sortType === 'asc') {
            setSortType('desc');
        } else {
            setSortColumn('status');
            setSortType('asc');
        }
    };

    // Handle routing by id
    const routingId = (id: string) => {
        router.push(`/admin/report/${id}`);
    };

    return (
        <LayoutGroup
        >
            <div>
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Laporan Masuk</h2>
                        <div className="flex items-center gap-2">
                            <InputGroup className="w-64">
                                <Input
                                    placeholder="Cari laporan..."
                                    value={searchQuery}
                                    onChange={(value) => {
                                        try {
                                            // Sanitasi input pencarian
                                            const sanitizedValue = value.replace(/[^\w\s]/gi, '');
                                            setSearchQuery(sanitizedValue);
                                            setLoading(true);
                                        } catch (error) {
                                            console.error('Error in search input:', error);
                                        }
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
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <IconButton
                                    icon={<Filter size={16} />}
                                    appearance={showFilters ? "primary" : "subtle"}
                                    color={showFilters ? "green" : undefined}
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={showFilters ? "bg-[#3CB371]" : ""}
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
                            >                        <motion.h3
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
                                        // Convert ValueType[] to string[]
                                        setStatusFilter(value.map(item => String(item)));
                                        setLoading(true);
                                        setTimeout(() => setLoading(false), 300);
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <Checkbox value="baru">
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
                                        <Checkbox value="diproses">
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
                                        <Checkbox value="selesai">
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
                                        <Checkbox value="ditolak">
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
                                                    setTimeout(() => setLoading(false), 300);
                                                }}
                                                className="text-[#6B7280] hover:text-[#3CB371]">Reset Filter</Button>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="flex items-center">
                        <p className="text-sm text-[#6B7280] mr-2">Urutkan:</p>
                        <div className="flex space-x-2">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    appearance="ghost"
                                    onClick={sortByDate}
                                    className={`text-sm py-1 px-3 rounded-md flex items-center gap-1.5 transition-colors ${sortColumn === 'tanggal'
                                        ? 'bg-[#E6FFFA] text-[#3CB371] font-medium border border-[#3CB371]/30'
                                        : 'bg-[#F4F9F4] text-[#6B7280] hover:bg-[#E6FFFA] hover:text-[#3CB371]'
                                        }`}
                                >
                                    <span>Tanggal Masuk</span>
                                    {sortColumn === 'tanggal' ? (
                                        sortType === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                    ) : null}
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    appearance="ghost"
                                    onClick={sortByStatus}
                                    className={`text-sm py-1 px-3 rounded-md flex items-center gap-1.5 transition-colors ${sortColumn === 'status'
                                        ? 'bg-[#E6FFFA] text-[#3CB371] font-medium border border-[#3CB371]/30'
                                        : 'bg-[#F4F9F4] text-[#6B7280] hover:bg-[#E6FFFA] hover:text-[#3CB371]'
                                        }`}
                                >
                                    <span>Status</span>
                                    {sortColumn === 'status' ? (
                                        sortType === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                    ) : null}
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    appearance="ghost"
                                    onClick={() => {
                                        setSortColumn('pelapor');
                                        setSortType(sortColumn === 'pelapor' && sortType === 'asc' ? 'desc' : 'asc');
                                    }}
                                    className={`text-sm py-1 px-3 rounded-md flex items-center gap-1.5 transition-colors ${sortColumn === 'pelapor'
                                        ? 'bg-[#E6FFFA] text-[#3CB371] font-medium border border-[#3CB371]/30'
                                        : 'bg-[#F4F9F4] text-[#6B7280] hover:bg-[#E6FFFA] hover:text-[#3CB371]'
                                        }`}
                                >
                                    <span>Pelapor</span>
                                    {sortColumn === 'pelapor' ? (
                                        sortType === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                    ) : null}
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                                <Button
                                    appearance="ghost"
                                    onClick={() => {
                                        setSortColumn('id');
                                        setSortType(sortColumn === 'id' && sortType === 'asc' ? 'desc' : 'asc');
                                    }}
                                    className={`text-sm py-1 px-3 rounded-md flex items-center gap-1.5 transition-colors ${sortColumn === 'id'
                                        ? 'bg-[#E6FFFA] text-[#3CB371] font-medium border border-[#3CB371]/30'
                                        : 'bg-[#F4F9F4] text-[#6B7280] hover:bg-[#E6FFFA] hover:text-[#3CB371]'
                                        }`}
                                >
                                    <span>ID</span>                            {sortColumn === 'id' ? (
                                        sortType === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                                    ) : null}
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <Table
                    data={reports}
                    height={700}
                    hover={true}
                    rowClassName={"hover:bg-[#F4F9F4]"}
                    loading={loading}
                    sortColumn={sortColumn}
                    sortType={sortType}
                    onSortColumn={handleSortColumn}
                    className="custom-sortable-table"
                >
                    <Column width={150} align="left" fixed sortable>
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">ID Laporan</h3>
                        </HeaderCell>
                        <Cell dataKey="id" />
                    </Column>

                    <Column width={200} flexGrow={2} align="left" sortable>
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">Pelapor</h3>
                        </HeaderCell>
                        <Cell>
                            {(rowData: Report) => rowData.reporter?.full_name || 'Anonymous'}
                        </Cell>
                    </Column>
                    <Column width={200} flexGrow={1} align="left" sortable>
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">Tanggal</h3>
                        </HeaderCell>
                        <Cell>
                            {(rowData: Report) => {
                                const date = new Date(rowData.created_at);
                                return date.toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                });
                            }}
                        </Cell>
                    </Column>
                    <Column width={120} flexGrow={1} align="center" sortable>
                        <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                            <h3 className="text-[#6B7280] font-medium text-base">Status</h3>
                        </HeaderCell>
                        <Cell dataKey="status">
                            {(rowData) => <StatusTag status={rowData.status} />}
                        </Cell>
                    </Column>
                    <Column width={100} align="center" flexGrow={1}>
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
        </LayoutGroup>
    );
}