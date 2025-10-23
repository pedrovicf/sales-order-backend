import { Request } from "@sap/cds";

export type FullRequestParams<ExpectedRsults> = Request & {
results: ExpectedRsults; 
}