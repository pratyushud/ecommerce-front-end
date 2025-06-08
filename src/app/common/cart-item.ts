export class CartItem {
    constructor(public id: number,
                public name: string,
                public description: string,
                public imageUrl: string,
                public unitPrice: number,
                public quantity: number ) {}
}
