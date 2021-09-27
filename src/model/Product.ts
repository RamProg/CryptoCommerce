import __products from "../data/products.json";

let products: any[] = __products;

export default class Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  constructor(title?: string, price?: number, thumbnail?: string) {
    this.id = this.generateId().toString();
    this.title = title ?? "";
    this.price = price ?? 0;
    this.thumbnail = thumbnail ?? "";
  }

  private generateId() {
    return products.length + 1;
  }

  getProducts = function () {
    return products;
  };

  getProduct(id: string): object | undefined {
    return products.find((e) => e.id === id);
  }
  save(product: Product): Product {
    products.push(product);
    return product;
  }
  update(id: string, title?: string, price?: number, thumbnail?: string) {
    const product: any = this.getProduct(id);
    if (product) {
      title && (product.title = title);
      price && (product.price = price);
      thumbnail && (product.thumbnail = thumbnail);
    }
    return product;
  }

  delete(id: string): object {
    let deleted = products.find((e) => e.id === id) ?? {};
    products = products.filter((e) => e.id !== id);
    return deleted;
  }
}
