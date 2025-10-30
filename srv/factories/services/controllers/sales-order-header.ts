import { SalesOrderHeaderController } from '@/controllers/customer/sales-order-header/protocols';
import { SalesOrderHeaderControllerImpl } from '@/controllers/customer/sales-order-header/implementation';
import { salesOrderHeaderService } from '@/factories/services/sales-order-header';

export const makeSalesOrderHeaderController = (): SalesOrderHeaderController => {
    return new SalesOrderHeaderControllerImpl(salesOrderHeaderService);
};

export const salesOrderHeaderController = makeSalesOrderHeaderController();
