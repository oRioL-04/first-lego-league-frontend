import type { AuthStrategy } from "@/lib/authProvider";
import { Record } from "@/types/record";
import { User } from "@/types/user";
import { fetchHalCollection, fetchHalResource, createHalResource } from "./halClient";

export class RecordService {
    constructor(private readonly authStrategy: AuthStrategy) {
    }

    async getRecords(): Promise<Record[]> {
        return fetchHalCollection<Record>('/records', this.authStrategy, 'records');
    }

    async getRecordById(id: string): Promise<Record> {
        const recordId = encodeURIComponent(id);
        return fetchHalResource<Record>(`/records/${recordId}`, this.authStrategy);
    }

    async getRecordsByOwnedBy(owner: User): Promise<Record[]> {
        const ownerUri = encodeURIComponent(owner.uri ?? '');
        return fetchHalCollection<Record>(
            `/records/search/findByOwnedBy?user=${ownerUri}`, 
            this.authStrategy, 
            'records'
        );
    }

    async createRecord(record: Record): Promise<Record> {
        return createHalResource<Record>('/records', record, this.authStrategy, 'record');
    }

    async getRecordRelation<T>(record: Record, relation: string): Promise<T> {
        return fetchHalResource<T>(record.link(relation).href, this.authStrategy);
    }
}
