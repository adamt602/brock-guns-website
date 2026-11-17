import type { Category, Product } from '@/types/product';
import { localProductRepository } from './localProducts';

/**
 * The only door between the UI and inventory data.
 *
 * Pages call these methods and pass the results to components as typed props;
 * components never know where the data came from. The methods are async so a
 * future implementation can call an API or database without changing a single
 * page or component.
 */
export interface ProductRepository {
  listProducts(): Promise<Product[]>;
  listFeaturedProducts(limit?: number): Promise<Product[]>;
  findProductBySlug(slug: string): Promise<Product | undefined>;
  /** Other products to show beside `product`, same category first. */
  listRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
  listCategories(): Promise<Category[]>;
  findCategory(id: string): Promise<Category | undefined>;
}

/**
 * The active data source. To move to a backend, write another object that
 * satisfies `ProductRepository` (for example `apiProductRepository`) and
 * assign it here.
 */
export const productRepository: ProductRepository = localProductRepository;
