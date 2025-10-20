import { Customer, Customers } from '@models/sales';

const customer: Customer = {
    email: 'pedro@numen.com',
    firstName: 'Pedro',
    lastName: 'Victor',
    id: '1234'
};

const customers: Customer[] = [customer] 

const funcao = (variavel: string) => console.log(variavel);

funcao('123');