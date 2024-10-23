import prisma from '../../../test/client';
import { OrdersPayments } from '../../Domain/Interfaces/orders';
import { Payments } from '../../Domain/Interfaces/payments';

export async function getPaymentsById(id: number): Promise<Payments | null> {
  try {
    return await prisma.payments.findUnique({ where: { id } });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function getPaymentsByOrderId(
  orderID: number,
): Promise<Payments | null> {
  try {
    return await prisma.payments.findFirst({
      where: { orderID: orderID },
    });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function createPayment(
  order: OrdersPayments,
): Promise<Payments | undefined> {
  try {
    if (order) {
      const payments = {
        salesOrderID: '5ace7194-247b-4c4a-a7a5-1018cd092bb0',
        qrCode:
          '00020101021243650016COM.MERCADOLIBRE0201306366b800cf5-e752-4de0-b092-89378a84c6a55204000053039865802BR5911felipe lima6009SAO PAULO62070503***6304B5CA',
        inStoreOrderID: '6b800cf5-e752-4de0-b092-89378a84c6a5',
        orderID: 1,
      };

      const response = await prisma.payments.create({
        data: { ...payments },
      });

      return response;
    }
  } catch (error) {
    const message =
      error?.message || error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}

export async function updatePayment(payments: Payments): Promise<Payments> {
  try {
    return await prisma.payments.update({
      where: {
        id: payments.id,
      },
      data: {
        ...payments,
      },
    });
  } catch (error) {
    const message = error?.meta?.target || error?.meta?.details;
    throw new Error(message);
  }
}
