-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SegmentedImage" (
    "id" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "SegmentedImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "segmentedImageId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SegmentedImage_id_key" ON "SegmentedImage"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SegmentedImage_imageId_key" ON "SegmentedImage"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "Report"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Report_segmentedImageId_key" ON "Report"("segmentedImageId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SegmentedImage" ADD CONSTRAINT "SegmentedImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_segmentedImageId_fkey" FOREIGN KEY ("segmentedImageId") REFERENCES "SegmentedImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
