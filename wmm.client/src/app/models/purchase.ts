export interface Purchase {
    id: number;
    date: string;
    description: string | null;
    vendor: string | null;
    tag: string | null;
    type: string | null;
    amount: number;
}
