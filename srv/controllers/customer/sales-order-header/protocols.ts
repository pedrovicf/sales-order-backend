import { User } from '@sap/cds';
import { SalesOrderHeader, SalesOrderHeaders } from '@models/sales';

export type CreationPayloadValidationResults = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
};

export interface SalesOrderHeaderController {
    beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResults>;
    afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void>;
}
