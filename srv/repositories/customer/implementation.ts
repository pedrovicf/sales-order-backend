// --- CORREÇÃO APLICADA AQUI ---
import cds, { SELECT } from '@sap/cds';
// OU se o seu @sap/cds não expuser SELECT diretamente:
// import cds from '@sap/cds';
// import { SELECT } from '@sap/cds/ql';
// Se a primeira opção funcionar (como geralmente é o caso), use-a.
// ------------------------------

import { CustomerRepository } from '@/repositories/customer/protocols';
import { CustomerModel, CustomerProps } from '@/models/customer';

export class CustomerRepositoryImpl implements CustomerRepository {
    public async findById(id: CustomerProps['id']): Promise<CustomerModel | null> {
        // A linha abaixo agora reconhecerá 'SELECT'
        const customerQuery = SELECT.one.from('sales.Customers').where({ id });
        // Uso de cds.run() está correto
        const dbcustomer = await cds.run(customerQuery);
        if (!dbcustomer) {
            return null;
        }
        return CustomerModel.with({
            id: dbcustomer?.id as string,
            firstName: dbcustomer?.firstName as string,
            lastName: dbcustomer?.lastName as string,
            email: dbcustomer?.email as string
        });
    }
}
