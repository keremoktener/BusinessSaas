export interface IInvoice{
    id: number;
    buyerTcNo: string;
    buyerEmail: string;
    buyerPhone: string;
    productId: number;
    productName: string;
    quantity: number;
    invoiceDate: Date;
    totalAmount: number;
    price: number;
}