import { SalesOrderHeader } from "@models/sales";

export type CreationPayloadValidationResults = {
    hasError: boolean;
    totalAmount?: number,
    error?: Error;
};

export interface SalesOrderHeaderService {
    beforeRead(params: SalesOrderHeader): Promise<CreationPayloadValidationResults>;
}