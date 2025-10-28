import { SalesOrderHeaderControllerImpl } from "srv/controllers/customer/sales-order-header/implementation";
import { SalesOrderHeaderController } from "srv/controllers/customer/sales-order-header/protocols";
import { salesOrderHeaderService } from "../sales-order-header";


export const makeSalesOrderHeaderController = (): SalesOrderHeaderController => {
    
    return new SalesOrderHeaderControllerImpl(salesOrderHeaderService);
}

export const salesOrderHeaderController = makeSalesOrderHeaderController();