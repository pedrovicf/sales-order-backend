import { CustomerModel } from 'srv/models/customer';
import { CustomerRepository } from 'srv/repositories/customer/protocols';
import { LoggedUserModel } from 'srv/models/logged-user';
import { ProductModel } from 'srv/models/products';
import { ProductRepository } from '../../repositories/product/protocols';
import { SalesOrderHeaderModel } from '../../models/sales-order-header';
import { SalesOrderItemModel } from '../../models/sales-order-item';
import { SalesOrderLogModel } from 'srv/models/sales-order-log';
import { SalesOrderLogRepository } from 'srv/repositories/sales-order-log/protocols';
import { User } from '@sap/cds';
import { CreationPayloadValidationResults, SalesOrderHeaderService } from './protocols';
import { SalesOrderHeader, SalesOrderHeaders, SalesOrdersItem } from '@models/sales';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository
    ) {}

    // =========================================================================
    // MÉTODO beforeCreate (OTIMIZADO) - RESOLVE O ERRO max-lines-per-function
    // =========================================================================
    public async beforeCreate(params: SalesOrderHeader): Promise<CreationPayloadValidationResults> {
        const products = await this.getProductsByIds(params);
        if (this._validateProducts(products)) {
            return this._validateProducts(products)!;
        }

        const items = this.getSalesOrderItems(params, products!);
        const header = this.getSalesOrderHeader(params, items);

        const customer = await this.getCustomerById(params);
        if (this._validateCustomer(customer)) {
            return this._validateCustomer(customer)!;
        }

        const headerValidationResult = header.validateCreationPayload({ customer_id: customer!.id });
        if (headerValidationResult.hasError) {
            return headerValidationResult;
        }

        return {
            hasError: false,
            totalAmount: header.calculateDiscount()
        };
    }
    // =========================================================================

    public async afterCreate(params: SalesOrderHeaders, loggedUser: User): Promise<void> {
        const headersAsArray = Array.isArray(params) ? params : ([params] as SalesOrderHeaders);
        const logs: SalesOrderLogModel[] = [];
        for (const header of headersAsArray) {
            const products = (await this.getProductsByIds(header)) as ProductModel[];
            const items = this.getSalesOrderItems(header, products);
            const salesOrderHeader = this.getExistingSalesOrderHeader(header, items);
            const productsData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const foundProduct = productsData.find((productsData) => productsData.id === product.id);
                product.sell(foundProduct?.quantity as number);
                await this.productRepository.updateStock(product);
            }
            const user = this.getLoggedUser(loggedUser);
            const log = this.getSalesOrderLog(salesOrderHeader, user);
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }

    // =========================================================================
    // MÉTODOS PRIVADOS DE VALIDAÇÃO (Extraídos do beforeCreate)
    // =========================================================================

    private _validateProducts(products: ProductModel[] | null): CreationPayloadValidationResults | null {
        if (!products) {
            return {
                hasError: true,
                error: new Error('Nenhum produto da lista de itens foi encontrado.')
            };
        }
        return null;
    }

    private _validateCustomer(customer: CustomerModel | null): CreationPayloadValidationResults | null {
        if (!customer) {
            return {
                hasError: true,
                error: new Error('Customer não encontrado')
            };
        }
        return null;
    }

    // =========================================================================
    // OUTROS MÉTODOS PRIVADOS JÁ EXISTENTES
    // =========================================================================

    private async getProductsByIds(params: SalesOrderHeader): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((item: SalesOrdersItem) => item.product_id) as string[];
        return this.productRepository.findByIds(productsIds);
    }

    private getSalesOrderItems(params: SalesOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        return params.items?.map((item) =>
            SalesOrderItemModel.create({
                price: item.price as number,
                productId: item.product_id as string,
                quantity: item.quantity as number,
                products
            })
        ) as SalesOrderItemModel[];
    }
    private getSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getExistingSalesOrderHeader(params: SalesOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }

    private getCustomerById(params: SalesOrderHeader): Promise<CustomerModel | null> {
        const costumerId = params.customer_id as string;
        return this.customerRepository.findById(costumerId);
    }

    private getLoggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]
            }
        });
    }

    private getSalesOrderLog(salesOrderHeader: SalesOrderHeaderModel, user: LoggedUserModel): SalesOrderLogModel {
        return SalesOrderLogModel.create({
            headerId: salesOrderHeader.id,
            orderData: salesOrderHeader.toStringifiedObject(),
            userData: user.toStringifiedObject()
        });
    }
}
