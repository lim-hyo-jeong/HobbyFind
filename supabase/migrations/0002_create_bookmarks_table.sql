-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    hobby_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, hobby_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_hobby_id ON public.bookmarks(hobby_id);

-- Enable Row Level Security
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Comments
COMMENT ON TABLE public.bookmarks IS '사용자 북마크 테이블';
COMMENT ON COLUMN public.bookmarks.hobby_id IS '취미 ID (hobbies.ts의 id와 매칭)';

-- Drop existing per-user policies if present
DROP POLICY IF EXISTS "Users can view their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON public.bookmarks;
DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON public.bookmarks;

-- Create permissive policies (service role/key assumed)
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own bookmarks" ON public.bookmarks
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can delete their own bookmarks" ON public.bookmarks
    FOR DELETE USING (true);

-- Policy comments
COMMENT ON POLICY "Users can view their own bookmarks" ON public.bookmarks IS 'Next-Auth 사용자를 위한 정책 - 서비스 롤 키로 인증';
COMMENT ON POLICY "Users can insert their own bookmarks" ON public.bookmarks IS 'Next-Auth 사용자를 위한 정책 - 서비스 롤 키로 인증';
COMMENT ON POLICY "Users can delete their own bookmarks" ON public.bookmarks IS 'Next-Auth 사용자를 위한 정책 - 서비스 롤 키로 인증';