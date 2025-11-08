-- =============================================
-- 12. BẢNG DISEASES (Bách khoa toàn thư bệnh)
-- =============================================
CREATE TABLE IF NOT EXISTS public."Diseases" (
    "Id" BIGSERIAL PRIMARY KEY,
    "Name" VARCHAR(255) NOT NULL,
    "Slug" VARCHAR(255) NOT NULL UNIQUE,
    "Overview" TEXT,
    "Symptoms" TEXT,
    "Causes" TEXT,
    "Treatment" TEXT,
    "Prevention" TEXT,
    "Category" VARCHAR(100),
    "CreatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    "UpdatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Index cho tìm kiếm
CREATE INDEX IF NOT EXISTS idx_diseases_name ON public."Diseases" ("Name");
CREATE INDEX IF NOT EXISTS idx_diseases_slug ON public."Diseases" ("Slug");
CREATE INDEX IF NOT EXISTS idx_diseases_category ON public."Diseases" (LOWER("Category"));

-- Trigger cho UpdatedAt
CREATE OR REPLACE FUNCTION update_diseases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."UpdatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_diseases_updated_at ON public."Diseases";
CREATE TRIGGER update_diseases_updated_at 
    BEFORE UPDATE ON public."Diseases"
    FOR EACH ROW 
    EXECUTE FUNCTION update_diseases_updated_at();

COMMENT ON TABLE public."Diseases" IS 'Bách khoa toàn thư tra cứu thông tin bệnh';
