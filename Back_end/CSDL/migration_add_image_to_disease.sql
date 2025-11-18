-- Migration: Add Image field to Diseases table
-- Date: 2025-11-18
-- Description: Add ImageUrl column to store disease featured image URLs from Cloudinary

ALTER TABLE public."Diseases" 
ADD COLUMN "ImageUrl" VARCHAR(500);

COMMENT ON COLUMN public."Diseases"."ImageUrl" IS 'Featured image URL for disease (stored in Cloudinary or external CDN)';

-- Update existing diseases with sample images (optional - for demo purposes)
UPDATE public."Diseases" 
SET "ImageUrl" = CASE 
  WHEN "Name" = 'Cảm cúm' THEN 'https://via.placeholder.com/500x400?text=Cam+Cum'
  WHEN "Name" = 'Sốt xuất huyết' THEN 'https://via.placeholder.com/500x400?text=Sot+Xuat+Huyet'
  ELSE NULL
END
WHERE "ImageUrl" IS NULL;

