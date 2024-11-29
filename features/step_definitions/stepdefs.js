const { Given, When, Then } = require('@cucumber/cucumber')
const { deepStrictEqual } = require('assert');
const { randomUUID } = require('crypto');

const answerPayment = {
  id: 1,
  createdAt: new Date('2024-10-17T22:38:38.430Z'),
  updatedAt: new Date('2024-10-17T22:38:38.430Z'),
  salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
  inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
  qrCode:
    '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
  orderID: 1,
  amount: 10,
  status: 'PENDING',
}

function createPayments(order) {
  if (order) {
    return {
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      orderID: 1,
      amount: 10,
      status: 'PENDING',
    }
  }
}

Given('created a order', function () {
  this.order = {
    salesOrderID: randomUUID(),
    customerID: '1',
    orderID: 1,
    amount: 10,
    items: [
      {
        sku_number: '100000',
        category: 'marketplace',
        title: 'x-burger',
        unit_price: 5,
        quantity: 2,
        unit_measure: 'unit',
        total_amount: 2 * 5,
      },
    ],
  }; 
});

When('creating a payment', function () {
  this.payment = createPayments(this.order)
});

Then('return payment made', function () {
  deepStrictEqual(this.payment, answerPayment)
});