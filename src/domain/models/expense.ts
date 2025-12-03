export interface Expenses {
    id: number;
    title?: string;
  categoryId?: number;
    amount?: number;
    date: string;
    note?:string;
    createdAt: string;
}