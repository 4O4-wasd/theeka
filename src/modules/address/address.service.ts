import { AddressRepository } from "./address.repository";
import type {
    CreateAddressSchemaType,
    FindAddressSchemaType,
    UpdateAddressSchemaType,
} from "./address.schema";

export class AddressService {
    private repository: AddressRepository;

    constructor() {
        this.repository = new AddressRepository();
    }

    async findAll(userId: string) {
        return await this.repository.findAll(userId);
    }

    async find(data: FindAddressSchemaType) {
        return await this.repository.find(data.id, data.userId);
    }

    async create(data: CreateAddressSchemaType) {
        return await this.repository.create(data);
    }

    async update(data: UpdateAddressSchemaType) {
        return await this.repository.update(data);
    }
}
