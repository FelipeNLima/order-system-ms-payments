import { randomUUID } from 'crypto';
import { prismaMock } from '../../test/singleton';
import { OrdersPayments } from '../Domain/Interfaces/orders';
import {
  createPayment,
  getPaymentsById,
  getPaymentsByOrderId,
  updatePayment,
} from './mock/functions';

describe('Unit Test Payments', () => {
  it('should Create new payments ', async () => {
    const dto: OrdersPayments = {
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
          quantity: 1,
          unit_measure: 'unit',
          total_amount: 1 * 5,
        },
      ],
    };

    const results = {
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      orderID: 1,
      status: 'PENDING',
    };

    prismaMock.payments.create.mockResolvedValue(results);

    await expect(createPayment(dto)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      orderID: 1,
      status: 'PENDING',
    });
  });

  it('should Update payments status', async () => {
    const payments = {
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      orderID: 1,
      status: 'PAID',
    };

    prismaMock.payments.update.mockResolvedValue(payments);

    await expect(updatePayment(payments)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      orderID: 1,
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      status: 'PAID',
    });
  });

  it('should Get payments by id', async () => {
    const id = 1;

    prismaMock.payments.findUnique.mockResolvedValue({
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      orderID: 1,
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      status: 'PAID',
    });

    await expect(getPaymentsById(id)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      orderID: 1,
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      status: 'PAID',
    });
  });

  it('should Get payments by orderID', async () => {
    const orderID = 1;

    prismaMock.payments.findFirst.mockResolvedValue({
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      orderID: 1,
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      status: 'PAID',
    });

    await expect(getPaymentsByOrderId(orderID)).resolves.toEqual({
      id: 1,
      createdAt: new Date('2024-10-17T22:38:38.430Z'),
      updatedAt: new Date('2024-10-17T22:38:38.430Z'),
      inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
      orderID: 1,
      qrCode:
        '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
      salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
      status: 'PAID',
    });
  });
});
