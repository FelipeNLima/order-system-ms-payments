/*
  Warnings:

  - A unique constraint covering the columns `[salesOrderID]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderID]` on the table `Payments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Payments_salesOrderID_key` ON `Payments`(`salesOrderID`);

-- CreateIndex
CREATE UNIQUE INDEX `Payments_orderID_key` ON `Payments`(`orderID`);
