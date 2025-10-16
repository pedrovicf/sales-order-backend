using {sales} from '../db/schema';

service MainService {
    entity SalesOrdersHeaders as projection on sales.SalesOrdersHeaders;

}