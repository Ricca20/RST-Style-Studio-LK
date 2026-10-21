-- The redesigned site uses lime as its accent. Move studios still on the old
-- default purple to the new default; custom colours are left unchanged.
ALTER TABLE "StudioSettings" ALTER COLUMN "accentColor" SET DEFAULT '#d4ff3a';
UPDATE "StudioSettings" SET "accentColor" = '#d4ff3a' WHERE "accentColor" IS NULL OR lower("accentColor") = '#9d2bee';
