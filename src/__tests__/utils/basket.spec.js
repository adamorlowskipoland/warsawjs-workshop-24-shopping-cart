import Basket from "../../utils/basket";

describe("basket", () => {
  const product1 = { name: "Product 1"};

  it('adds product to basket', () => {
    const b = new Basket();

    expect(b.products()).toHaveLength(0);

    b.add(product1);

    expect(b.products()).toHaveLength(1);

  });

  it('removes product', () => {
    const b = new Basket();
    b.add(product1);
    expect(b.products()).toHaveLength(1);
    b.remove(product1);
    expect(b.products()).toHaveLength(0);
  });

  it('should have product1', () => {
    const b = new Basket();

    expect(b.products()).toHaveLength(0);

    b.add(product1);

    expect(b.products()).toHaveLength(1);

    expect(b.hasProduct(product1)).toBeTruthy();

  });
});