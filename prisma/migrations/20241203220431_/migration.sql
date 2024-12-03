-- CreateTable
CREATE TABLE `Payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `salesOrderID` VARCHAR(191) NOT NULL,
    `inStoreOrderID` VARCHAR(191) NOT NULL,
    `qrCode` VARCHAR(191) NOT NULL,
    `orderID` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `Payments_salesOrderID_key`(`salesOrderID`),
    UNIQUE INDEX `Payments_qrCode_key`(`qrCode`),
    UNIQUE INDEX `Payments_orderID_key`(`orderID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
