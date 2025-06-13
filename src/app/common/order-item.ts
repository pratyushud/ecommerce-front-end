export class OrderItem {
    constructor(
        public quantity: number,
        public unitPrice: number,
        public productId: number,
        public imageUrl: string
    ) {}
}
