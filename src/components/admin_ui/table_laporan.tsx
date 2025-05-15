'use client'

import { useEffect, useState } from "react";
import { LaporanData, laporanDummyData } from "./dummy/laporan_dummy";
import { Card } from "../common/card";
import { Button, Checkbox, CheckboxGroup, IconButton, Input, InputGroup, Table } from "rsuite";
import { ExternalLink, Filter, Search, SortAsc, SortDesc, X } from "lucide-react";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import { Tag } from "../common/tag";

export function LaporanTable() {
    // State for sorting
    const [sortColumn, setSortColumn] = useState<string>('');
    const [sortType, setSortType] = useState<'asc' | 'desc' | undefined>('asc');
    const [loading, setLoading] = useState<boolean>(false);

    // State for search and filter
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    // Add useEffect to update table when any filter or sort changes
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, statusFilter, sortColumn, sortType]);

    // Get data with filters and sorting applied
    const getData = () => {
        // First filter the data
        let data = [...laporanDummyData];

        // Apply status filters
        if (statusFilter.length > 0) {
            data = data.filter(item => statusFilter.includes(item.status));
        }

        // Apply search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                String(item.id).toLowerCase().includes(query) ||
                item.pelapor.toLowerCase().includes(query) ||
                new Date(item.tanggal).toLocaleDateString('id-ID').toLowerCase().includes(query)
            );
        }

        // Then sort the filtered data
        if (sortColumn && sortType) {
            return data.sort((a, b) => {
                const aValue = a[sortColumn as keyof LaporanData];
                const bValue = b[sortColumn as keyof LaporanData];

                if (sortColumn === 'tanggal') {
                    // For date type
                    const aDate = aValue as Date;
                    const bDate = bValue as Date;

                    return sortType === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
                } else if (sortColumn === 'status') {
                    // Custom sort order for status: baru -> diproses -> selesai -> ditolak
                    const statusOrder = {
                        'baru': 1,
                        'diproses': 2,
                        'selesai': 3,
                        'ditolak': 4
                    };

                    const aStatus = statusOrder[aValue as keyof typeof statusOrder] || 999;
                    const bStatus = statusOrder[bValue as keyof typeof statusOrder] || 999;

                    return sortType === 'asc' ? aStatus - bStatus : bStatus - aStatus;
                } else if (typeof aValue === 'string' && typeof bValue === 'string') {
                    // For string type
                    return sortType === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                } else {
                    // For number or other types
                    const aNum = aValue as number;
                    const bNum = bValue as number;
                    return sortType === 'asc' ? aNum - bNum : bNum - aNum;
                }
            });
        }
        return data;
    };

    // Handle sort change
    const handleSortColumn = (sortColumn: string, sortType: 'asc' | 'desc' | undefined) => {
        setLoading(true);
        setTimeout(() => {
            setSortColumn(sortColumn);
            setSortType(sortType || 'asc'); // Default to 'asc' if sortType is undefined
            setLoading(false);
        }, 300);
    };

    // Direct sort functions for quick sorting
    const sortByDate = () => {
        setLoading(true);
        setTimeout(() => {
            if (sortColumn === 'tanggal' && sortType === 'asc') {
                setSortColumn('tanggal');
                setSortType('desc');
            } else {
                setSortColumn('tanggal');
                setSortType('asc');
            }
            setLoading(false);
        }, 200);
    };

    const sortByStatus = () => {
        setLoading(true);
        setTimeout(() => {
            if (sortColumn === 'status' && sortType === 'asc') {
                setSortColumn('status');
                setSortType('desc');
            } else {
                setSortColumn('status');
                setSortType('asc');
            }
            setLoading(false);
        }, 200);
    };

    return (
        <div className="w-full h-screen p-4 flex flex-col gap-5 flex-5/6 px-8 py-5 bg-[#F5FFFA]">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Laporan Masuk</h2>
                    <div className="flex items-center gap-2">
                        <InputGroup className="w-64">
                            <Input
                                placeholder="Cari laporan..."
                                value={searchQuery}
                                onChange={(value) => {
                                    setSearchQuery(value);
                                    setLoading(true);
                                    setTimeout(() => setLoading(false), 300);
                                }}
                            />
                            <InputGroup.Addon className="bg-[#E6FFFA] cursor-pointer">
                                {searchQuery ? (
                                    <X
                                        size={16}
                                        onClick={() => {
                                            setSearchQuery('');
                                            setLoading(true);
                                            setTimeout(() => setLoading(false), 300);
                                        }}
                                        className="text-red-500"
                                    />
                                ) : (
                                    <Search size={16} className="text-[#3CB371]" />
                                )}
                            </InputGroup.Addon>
                        </InputGroup>
                        <IconButton
                            icon={<Filter size={16} />}
                            appearance={showFilters ? "primary" : "subtle"}
                            color={showFilters ? "green" : undefined}
                            onClick={() => setShowFilters(!showFilters)}
                            className={showFilters ? "bg-[#3CB371]" : ""}
                        />
                    </div>
                </div>

                {showFilters && (
                    <div className="p-3 bg-[#F4F9F4] rounded-md border border-[#E6FFFA]">
                        <h3 className="text-sm text-[#3CB371] font-medium mb-2">Filter Status:</h3>
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
                            <Checkbox value="baru">
                                <span className="text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full text-xs">
                                    Baru
                                </span>
                            </Checkbox>
                            <Checkbox value="diproses">
                                <span className="text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full text-xs">
                                    Diproses
                                </span>
                            </Checkbox>
                            <Checkbox value="selesai">
                                <span className="text-[#047857] bg-[#D1FAE5] px-2 py-0.5 rounded-full text-xs">
                                    Selesai
                                </span>
                            </Checkbox>
                            <Checkbox value="ditolak">
                                <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-full text-xs">
                                    Ditolak
                                </span>
                            </Checkbox>
                        </CheckboxGroup>

                        {statusFilter.length > 0 && (
                            <div className="mt-2 flex items-center justify-end">
                                <Button
                                    size="sm"
                                    appearance="link"
                                    onClick={() => {
                                        setStatusFilter([]);
                                        setLoading(true);
                                        setTimeout(() => setLoading(false), 300);
                                    }}
                                    className="text-[#6B7280] hover:text-[#3CB371]"
                                >
                                    Reset Filter
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center">
                    <p className="text-sm text-[#6B7280] mr-2">Urutkan:</p>
                    <div className="flex space-x-2">
                        <Button
                            appearance="ghost"
                            onClick={sortByDate}
                            className={`text-sm py-1 px-3 rounded-md flex items-center gap-1.5 transition-colors ${sortColumn === 'tanggal'
                                ? 'bg-[#E6FFFA] text-[#3CB371] font-medium border border-[#3CB371]/30'
                                : 'bg-[#F4F9F4] text-[#6B7280] hover:bg-[#E6FFFA] hover:text-[#3CB371]'
                                }`}
                        >
                            <span>Tanggal</span>
                            {sortColumn === 'tanggal' ? (
                                sortType === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                            ) : null}
                        </Button>
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
                            <span>ID</span>
                            {sortColumn === 'id' ? (
                                sortType === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />
                            ) : null}
                        </Button>
                    </div>
                </div>
            </div>

            <Table
                fillHeight
                data={getData()}
                height={340}
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
                    <Cell dataKey="pelapor" />
                </Column>
                <Column width={200} flexGrow={1} align="left" sortable>
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Tanggal</h3>
                    </HeaderCell>
                    <Cell dataKey="tanggal">
                        {(rowData) => {
                            const date = new Date(rowData.tanggal);
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
                        {(rowData) => {
                            const status = rowData.status;
                            let color;
                            let statusText;
                            let bgColor;
                            let priorityOrder;

                            switch (status) {
                                case 'baru':
                                    color = 'text-blue-700';
                                    statusText = 'Baru';
                                    bgColor = "bg-blue-100";
                                    priorityOrder = 1;
                                    break;
                                case 'diproses':
                                    color = 'text-orange-700';
                                    statusText = 'Diproses';
                                    bgColor = "bg-orange-100";
                                    priorityOrder = 2;
                                    break;
                                case 'selesai':
                                    color = 'text-[#047857]';
                                    statusText = 'Selesai';
                                    bgColor = "bg-[#D1FAE5]";
                                    priorityOrder = 3;
                                    break;
                                case 'ditolak':
                                    color = 'text-red-700';
                                    statusText = 'Ditolak';
                                    bgColor = "bg-red-100";
                                    priorityOrder = 4;
                                    break;
                                default:
                                    color = 'text-gray-700';
                                    bgColor = "bg-gray-100";
                                    statusText = 'Tidak diketahui';
                                    priorityOrder = 999;
                            }
                            return (
                                <div className="flex items-center justify-center">
                                    <Tag color={color as any} bgColor={bgColor as any}>
                                        {statusText}
                                    </Tag>
                                </div>
                            );
                        }}
                    </Cell>
                </Column>
                <Column width={100} align="center" flexGrow={1}>
                    <HeaderCell style={{ backgroundColor: '#E6FFFA' }}>
                        <h3 className="text-[#6B7280] font-medium text-base">Aksi</h3>
                    </HeaderCell>
                    <Cell>
                        {() => (
                            <button
                                className="flex items-center justify-center text-green-600 hover:text-green-800 cursor-pointer"
                            >
                                <ExternalLink size={16} className="mr-1" />
                                <span>Detail</span>
                            </button>
                        )}
                    </Cell>
                </Column>
            </Table>
        </div>
    );
}