import shopApi from '../shopApi';

describe("shopApi", () => {
  it('should return list of products', async () => {
    const { data } = await shopApi.getProducts();
    const { products } = data;
    const expectedObject = {
      id: expect.anything(),
      title: expect.anything(),
      price: expect.anything(),
      image: expect.anything(),
    };

    expect(products).toBeDefined();
    expect(products).toBeInstanceOf(Array);

    expect(products[0]).toEqual(expect.objectContaining(expectedObject));

  });

  it('creates an order', async () => {
    const products = {
      productIds: [4,],
      quantityById: {
        4: 2,
      },
    };

    const response = await shopApi.createOrder(products);

    expect(response.data.status).toBe('NEW');
    expect(response.data.orderNumber).toBeDefined();

    expect(response.data).toMatchObject({
      status: 'NEW',
      orderNumber: expect.any(Number),
      products,
    });

  });

  it('updated delivery method', async () => {
    const products = {
      productIds: [4,],
      quantityById: {
        4: 2,
      },
    };
    const response = await shopApi.createOrder(products);
    expect(response.data.status).toBe('NEW');
    expect(response.data.orderNumber).toBeDefined();
    expect(response.data).toMatchObject({
      status: 'NEW',
      orderNumber: expect.any(Number),
      products,
    });

    const method = {
      deliveryMethod: 'inpust',
    };

    const address = await shopApi.changeDeliveryMethod(response.data.orderNumber, method);

    expect(address.status).toBeDefined();
    expect(address.statusText).toBe('OK');
  });

  it('updated delivery address', async () => {
    const products = {
      productIds: [4,],
      quantityById: {
        4: 2,
      },
    };
    const response = await shopApi.createOrder(products);
    expect(response.data.status).toBe('NEW');
    expect(response.data.orderNumber).toBeDefined();
    expect(response.data).toMatchObject({
      status: 'NEW',
      orderNumber: expect.any(Number),
      products,
    });

    const orderAddress = {
      fullname: "John Doe",
      street: "Al. Wilanowska 5",
      city: "Warszawa",
      country: "PL",
    };

    const address = await shopApi.changeDeliveryAddress(response.data.orderNumber, orderAddress);

    expect(address.status).toBeDefined();
    expect(address.statusText).toBe('OK');
  });

  it('submit order', async () => {
    const products = {
      productIds: [4,],
      quantityById: {
        4: 2,
      },
    };
    const response = await shopApi.createOrder(products);
    expect(response.data.status).toBe('NEW');
    expect(response.data.orderNumber).toBeDefined();
    expect(response.data).toMatchObject({
      status: 'NEW',
      orderNumber: expect.any(Number),
      products,
    });

    const submited = await shopApi.createOrder(response.data.orderNumber);

    expect(submited.status).toBeDefined();
    expect(submited.statusText).toBe('OK');
  });

  it('should get order', async () => {
    const products = {
      productIds: [4,],
      quantityById: {
        4: 2,
      },
    };
    const response = await shopApi.createOrder(products);

    const submited = await shopApi.createOrder(response.data.orderNumber);

    const expectedOrderObj = {
      orderNumber: expect.anything(),
      products: expect.anything(),
      status: "NEW",
    };

    const order = await shopApi.getOrder(response.data.orderNumber);

    expect(order.status).toBeDefined();
    expect(order.statusText).toBe('OK');

    expect(order.data).toMatchObject(expectedOrderObj);
  })
});