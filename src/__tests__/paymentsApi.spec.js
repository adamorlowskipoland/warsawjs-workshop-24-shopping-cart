import nock from "nock";
import paymentsApi from "../paymentsApi";

describe("paymentsApi", () => {
  it("authorizes the client", async () => {
    nock('http://payments.local')
      .post('/auth/token', { username: 'test', password: 'test', })
      .reply(200, {
        token: '123TOKEN',
      });

    const token = await paymentsApi.authorizeClient('test', 'test');
    expect(token).toBe('123TOKEN');
  });

  it("throws an error when credentials are wrong", () => {
    nock('http://payments.local')
      .post('/auth/token', { username: 'test', password: 'test', })
      .reply(401);

    return paymentsApi
      .authorizeClient("test", "test")
      .catch(e => expect(e.message).toMatch("Unauthorized"));
  });

  it("processes card payment", async () => {
    nock('http://payments.local')
      .post('/auth/token', { username: 'test', password: 'test', })
      .reply(200, {
        token: '123TOKEN',
      });

    const token = await paymentsApi.authorizeClient('test', 'test');

    expect(token).toBe('123TOKEN');

    const card = {
      number: "4111111111111111",
      securityCode: "950",
      expMonth: "07",
      expYear: "21",
      owner: "John Doe"
    };

    const amount = 950;

    const reqBody = { token, amount: amount * 100, card };

    nock('http://payments.local')
      .post('/payments/payment', reqBody)
      .reply(200, {
        transactionId: 'TX123',
      });

    const transaction = await paymentsApi.processPayment(token, card, amount);

    expect(transaction).toBeDefined();
    expect(transaction).toBe('TX123');
  });

  it("checks if transaction is completed", async () => {
    nock('http://payments.local')
      .post('/auth/token', { username: 'test', password: 'test', })
      .reply(200, {
        token: '123TOKEN',
      });

    const token = await paymentsApi.authorizeClient('test', 'test');

    expect(token).toBe('123TOKEN');

    const card = {
      number: "4111111111111111",
      securityCode: "950",
      expMonth: "07",
      expYear: "21",
      owner: "John Doe"
    };

    const amount = 950;

    const reqBody = { token, amount: amount * 100, card };

    nock('http://payments.local')
      .post('/payments/payment', reqBody)
      .reply(200, {
        transactionId: 'TX123',
      });

    const transaction = await paymentsApi.processPayment(token, card, amount);

    expect(transaction).toBeDefined();
    expect(transaction).toBe('TX123');



    nock('http://payments.local')
      .get(`/payments/payment/${transaction}?token=${token}`)
      .reply(200, {
        status: 'COMPLETED',
      });


    const paymentStatus = await paymentsApi.isPaymentCompleted(token, transaction,);

    expect(paymentStatus).toBeDefined();
    expect(paymentStatus).toBeTruthy();

  });
});
