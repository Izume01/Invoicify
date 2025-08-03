-- AlterTable
ALTER TABLE "User" ADD COLUMN     "IsonBoardingDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onBoardingId" INTEGER;

-- CreateTable
CREATE TABLE "OnBoarding" (
    "id" SERIAL NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT NOT NULL,
    "option3" TEXT NOT NULL,
    "option4" TEXT NOT NULL,

    CONSTRAINT "OnBoarding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_onBoardingId_fkey" FOREIGN KEY ("onBoardingId") REFERENCES "OnBoarding"("id") ON DELETE SET NULL ON UPDATE CASCADE;
