import { FullRequestParams } from './protocols';
import { customerController } from './factories/services/controllers/customer';
import { salesOrderHeaderController } from './factories/services/controllers/sales-order-header';
import { Customers, SalesOrderHeaders } from '@models/sales';
import { Request, Service, User } from '@sap/cds';


// 1. HANDLERS DE AUTORIZAÇÃO
function handleAuth(service: Service) {
    // Handler 1: READ
    service.before('READ', '*', (request: Request) => {
        console.log(JSON.stringify(request.user));
        if (!request.user.is('admin')) {
            return request.reject(403, 'Não autorizado');
        }
    });
    // Handler 2: WRITE / DELETE
    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) {
            return request.reject(403, 'Não autorizado a escrita/deleção');
        }
    });
}

// 2. HANDLERS DE CLIENTES
function handleCustomerHooks(service: Service) {
    service.after('READ', 'Customers', (customersList: Customers, request: Request) => {
        (request as unknown as FullRequestParams<Customers>).results = customerController.afterRead(customersList);
    });
}

// 3. HANDLERS DE PEDIDOS DE VENDA
function handleSalesOrderHooks(service: Service) {
    // Handler 1: BEFORE CREATE
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
        const result = await salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasError) {
            return request.reject(400, result.error?.message as string);
        }
        request.data.totalAmount = result.totalAmount;
    });
    
    // Handler 2: AFTER CREATE
    service.after('CREATE', 'SalesOrderHeaders', async (SalesOrderHeaders: SalesOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(SalesOrderHeaders, request.user as User);
    });
}


// FUNÇÃO PRINCIPAL (AGORA COM POUCAS LINHAS)
export default (service: Service) => { 
    handleAuth(service);
    handleCustomerHooks(service);
    handleSalesOrderHooks(service);
};
