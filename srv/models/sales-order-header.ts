import { SalesOrderItemModel } from "./sales-order-item";

type SalesOrderHeaderProps = {
    id: string;
    customerId: string;
    totalAmount: number;
    items: SalesOrderItemModel[];
}

type SalesOrderHeaderPropsWithoutTotalAmount = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];

};

type CreationPayloadValidationResults = {
    hasError: boolean;
    error?: Error;
};

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) {}

    public static create(props: SalesOrderHeaderPropsWithoutTotalAmount): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel({
        ...props,
        id: crypto.randomUUID(),
        totalAmount: 0
        });
    }

    public get id() {
        return this.props.id;
    }
    public get customerId() {
        return this.props.customerId;
    }

    public get TotalAmount() {
        return this.props.totalAmount;
    }

public get items() {
    return this.props.items;

    }

    public set totalAmount(amount: number) {
        this.totalAmount = amount;

    }

    public validateCreationPayload(params: CreationPayload): CreationPayloadValidationResults {
        const customerValidationResult = this.validateCustomerOnCreation(params.customer_id);
        if (customerValidationResult.hasError) {
            return customerValidationResult;
        }
        const itemsValidationResult = this.validateItemsOnCreation(this.items);
        if (itemsValidationResult.hasError){
            return itemsValidationResult;
        }
        return { 
            hasError: false
        }
    }

    private validateCustomerOnCreation(customerId: CreationPayload[`customer_id`]): CreationPayloadValidationResults {
            if (!customerId) {
            return {
                hasError: true,
                error: new Error('Customer inválido')
            };
        }
        return {
            hasError: false
        }
    }

    private validateItemsOnCreation(items: SalesOrderHeaderProps['items']): CreationPayloadValidationResults {
                if (!items || items?.length === 0) {
            return {
                hasError: true,
                error: new Error('itens inválidos')
            };
        }
        const itemsErros: string[] = [];
        items.forEach(item => {
            const validationResult = item.validateCreationPayload({ product_id: item.productId });
            if (validationResult.hasError) {
                itemsErros.push(validationResult.error?.message as string);

            }
        });
        if(itemsErros.length > 0) {
            const messages = itemsErros.join(`\n -`);
            return {
                hasError: true,
                error: new Error(messages)
                
            }
        }
        return {
            hasError: true
            }
    }

    public calculateTotalAmount(): number {
       
        this.totalAmount = 0;
        this.items.forEach(item => {
            this.totalAmount += (item.price as number) * (item.quantity as number);
        });
        return this.totalAmount;
    }

    public calculateDiscount(): number {
        this.totalAmount = this.calculateTotalAmount();
         if (this.totalAmount > 30000) {
            const discount = this.totalAmount * (10/100);
            this.totalAmount = this.totalAmount - discount;
            }
            return this.totalAmount;
    }
}