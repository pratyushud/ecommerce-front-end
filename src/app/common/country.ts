export class Country {
    id: number;
    description: string;
    code: string;
    
    constructor(id: number, description: string, code: string) {
        this.id = id;
        this.description = description;
        this.code = code;
    }
}