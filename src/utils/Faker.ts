import * as faker from "faker";

export default (qty: number) => {
  const result: object[] = [];
  for (let i = 0; i < qty; i++) {
    result.push({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      pic: faker.image.imageUrl(),
    });
  }
  return result;
};
