// --- CORREÇÃO APLICADA AQUI ---
import cds, { SELECT } from '@sap/cds';
// Incluí SELECT e UPDATE para cobrir ambas as consultas no arquivo.
// ------------------------------

import { Products } from '@models/sales';

import { ProductRepository } from '@/repositories/product/protocols';
import { ProductModel, ProductProps } from '@/models/products';

export class ProductRepositoryImpl implements ProductRepository {
    public async findByIds(ids: ProductProps['id'][]): Promise<ProductModel[] | null> {
        // A linha abaixo agora reconhecerá 'SELECT'
        const productsQuery = SELECT.from('sales.Products').where({ id: ids });
        const products: Products = await cds.run(productsQuery);
        if (products.length === 0) {
            return null;
        }
        return products.map((product) =>
            ProductModel.with({
                id: product.id as string,
                name: product.name as string,
                price: product.price as number,
                stock: product.stock as number
            })
        );
    }
    public async updateStock(product: ProductModel): Promise<void> {
        // A linha abaixo agora reconhecerá 'UPDATE'
        await cds.update('sales.Products').where({ id: product.id }).with({ stock: product.stock });
    }
}
