import cds, { db, Request, Service } from '@sap/cds';
import { Customers, Product, Products, SalesOrderHeaders, SalesOrdersItem, SalesOrdersItems } from '@models/sales';
//import { Console, log } from 'console';
import { customerController } from './factories/services/controllers/customer';
import { salesOrderHeaderController } from './factories/services/controllers/sales-order-header';
import { FullRequestParams } from './protocols';

export default (service: Service) => { 
      service.before('READ', '*', (request: Request) => {
        console.log(JSON.stringify(request.user))
        if (!request.user.is('admin')) {
        return request.reject(403, 'Não autorizado');
        }
    });
    service.before(['WRITE', 'DELETE'], '*', (request: Request) => {
        if (!request.user.is('admin')) {
        return request.reject(403, 'Não autorizado a escrita/deleção');
        }
    });
    service.after('READ', 'Customers', (customersList: Customers, request) =>  {
        (request as unknown as FullRequestParams<Customers>).results = customerController.afterRead(customersList);
        //results.forEach(customer => {
          //  if (!customer.email?.includes('@')) {
           //     customer.email = `${customer.email}@gmail.com`
            //}
        //})

    });
    service.before('CREATE', 'SalesOrderHeaders', async (request: Request) => {
         const result = await salesOrderHeaderController.beforeCreate(request.data);
         if (result.hasError) {
            return request.reject(400, result.error?.message as string);
         }
        request.data.totalAmount = result.totalAmount;
        
    });
    service.after('CREATE', 'SalesOrderHeaders', async (SalesOrderHeaders: SalesOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(SalesOrderHeaders, request.user);
   
        
     
    });
  
 
}