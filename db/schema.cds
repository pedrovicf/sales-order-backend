using { managed } from '@sap/cds/common';

namespace  sales;

entity SalesOrdersHeaders: managed {
    key id: UUID;
    customer: Association to Customers;
    totalAmount: Decimal(15,2);
    items: Composition of many SalesOrdersItem on items.header = $self;
}
entity SalesOrdersItem {
    key id: UUID;
    header: Association to SalesOrdersHeaders;
    product: Association to Products;
    quantity: Integer;
    price: Decimal(15,2);

}
entity Customers {
    key id: UUID;
    firstName: String(20);
    lastName: String(100);
    email: String(255);
}
entity Products {
    key id: UUID;
    name: String(255);
    price: Decimal(15,2);
    stock: Integer;
}