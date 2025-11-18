-- Sample image URLs for diseases (for testing)
-- Run this to add sample images to existing diseases

UPDATE public."Diseases"
SET "ImageUrl" = CASE 
  WHEN "Slug" = 'cam-cum' THEN 
    'https://images.unsplash.com/photo-1584308666744-24d5f15714ae?w=500&h=400&fit=crop'
  WHEN "Slug" = 'sot-xuat-huyet' THEN 
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop'
  ELSE "ImageUrl"
END
WHERE "ImageUrl" IS NULL;

-- Alternative: Use placeholder images for demo
-- UPDATE public."Diseases"
-- SET "ImageUrl" = 'https://via.placeholder.com/500x400?text=' || "Name"
-- WHERE "ImageUrl" IS NULL;

-- Check results
SELECT "Id", "Name", "Slug", "ImageUrl" FROM public."Diseases" LIMIT 10;
