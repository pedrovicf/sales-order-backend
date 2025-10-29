import { Product } from "@models/sales";
import { ProductModel, ProductProps } from "srv/models/products"

export interface ProductRepository {
    findByIds(ids: ProductProps['id'][]): Promise<ProductModel[] | null>;
    updateStock(product: ProductModel): Promise<void>; 
}