import { categories } from '@/data/categories';
import { products } from '@/data/products';
import type { ProductRepository } from './productRepository';

/** Repository backed by the local TypeScript data files. */
export const localProductRepository: ProductRepository = {
  async listProducts() {
    return products;
  },

  async listFeaturedProducts(limit) {
    return products.filter((product) => product.featured).slice(0, limit);
  },

  async findProductBySlug(slug) {
    return products.find((product) => product.slug === slug);
  },

  async listRelatedProducts(product, limit = 3) {
    const others = products.filter((candidate) => candidate.id !== product.id);
    const sameCategory = others.filter(
      (candidate) => candidate.category.id === product.category.id,
    );
    const rest = others.filter((candidate) => candidate.category.id !== product.category.id);
    return [...sameCategory, ...rest].slice(0, limit);
  },

  async listCategories() {
    return categories;
  },

  async findCategory(id) {
    return categories.find((category) => category.id === id);
  },
};
