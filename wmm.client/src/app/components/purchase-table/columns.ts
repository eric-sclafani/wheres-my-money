import { Purchase } from '../../models/purchase';

export interface Column {
    columnDef: string;
    header: string;
    type?: string;
    cell: (row: Purchase) => string;
}

const stringify = (item: any) => `${item}`;
export const columns: Column[] = [
    {
        columnDef: 'delete',
        header: '',
        cell: (elem: Purchase) => '',
    },
    {
        columnDef: 'date',
        header: 'Date',
        type: 'date',
        cell: (elem: Purchase) => stringify(elem.date),
    },
    {
        columnDef: 'description',
        header: 'Description',
        cell: (elem: Purchase) => stringify(elem.description),
    },
    {
        columnDef: 'vendor',
        header: 'Vendor',
        cell: (elem: Purchase) => stringify(elem.vendor),
    },
    {
        columnDef: 'tag',
        header: 'Tag',
        cell: (elem: Purchase) => stringify(elem.tag),
    },
    {
        columnDef: 'type',
        header: 'Type',
        cell: (elem: Purchase) => stringify(elem.type),
    },
    {
        columnDef: 'amount',
        header: 'Amount',
        type: 'price',
        cell: (elem: Purchase) => stringify(elem.amount),
    },
    {
        columnDef: 'balance',
        header: 'Balance',
        type: 'price',
        cell: (elem: Purchase) => stringify(elem.balance),
    },
];
