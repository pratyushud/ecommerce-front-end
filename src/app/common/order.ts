export class Order {
    constructor(
        public totalPrice: number,
        public totalQuantity: number,
        public id: number | undefined = undefined,
        public orderTrackingNumber: string = '',
        public dateCreated: Date | undefined = undefined,
        public status: string = ''
    ) {}
}
