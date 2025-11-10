using { sales } from '../../db/schema';
using { db.types.SalesReportByDays } from '../../db/types';

@requires: 'authenticated-user'
//Entities
service MainService {
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders actions {
        function teste(parametro1: String) returns Boolean;
    };
    entity SalesOrderStatuses as projection on sales.SalesOrderStatuses;
    entity Customers as projection on sales.Customers;
    entity Products as projection on sales.Products;
    entity SalesOrderLogs   as projection on sales.SalesOrderLogs;


    
  
}


// Functions
    extend service MainService with {
    function getSalesReportByDays(days: SalesReportByDays.Params:days) returns array of SalesReportByDays.ExpectedResult;
}

// Actions