using {sales} from '../db/schema';

service MainService {
    entity SalesOrdersHeaders as projection on sales.SalesOrdersHeaders;
    entity Customers as projection on sales.Customers;
    entity Products as projection on sales.Products;

}