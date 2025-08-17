import { createClient } from './supabase/server';

export interface Bookmark {
  id: string;
  user_id: string;
  hobby_id: string;
  created_at: string;
}

export interface BookmarkedHobby {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'sports' | 'intelligence' | 'art';
  bookmarkedAt: string;
}

// 사용자의 북마크 목록 조회
export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user bookmarks:', error);
    throw new Error('북마크 목록을 불러올 수 없습니다.');
  }

  return data || [];
}

// 북마크 추가
export async function addBookmark(userId: string, hobbyId: string): Promise<Bookmark> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: userId,
      hobby_id: hobbyId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding bookmark:', error);
    if (error.code === '23505') { // Unique violation
      throw new Error('이미 북마크된 취미입니다.');
    }
    throw new Error('북마크를 추가할 수 없습니다.');
  }

  return data;
}

// 북마크 제거
export async function removeBookmark(userId: string, hobbyId: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('hobby_id', hobbyId);

  if (error) {
    console.error('Error removing bookmark:', error);
    throw new Error('북마크를 제거할 수 없습니다.');
  }
}

// 북마크 상태 확인
export async function isBookmarked(userId: string, hobbyId: string): Promise<boolean> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', userId)
    .eq('hobby_id', hobbyId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking bookmark status:', error);
    throw new Error('북마크 상태를 확인할 수 없습니다.');
  }

  return !!data;
}

// 북마크 토글 (추가/제거)
export async function toggleBookmark(userId: string, hobbyId: string): Promise<boolean> {
  const isCurrentlyBookmarked = await isBookmarked(userId, hobbyId);
  
  if (isCurrentlyBookmarked) {
    await removeBookmark(userId, hobbyId);
    return false;
  } else {
    await addBookmark(userId, hobbyId);
    return true;
  }
}

// 북마크된 취미 정보와 함께 조회
export async function getBookmarkedHobbiesWithDetails(userId: string): Promise<BookmarkedHobby[]> {
  const bookmarks = await getUserBookmarks(userId);
  
  // hobbies.ts에서 취미 데이터 가져오기
  const { hobbies } = await import('./data/hobbies');
  
  return bookmarks.map(bookmark => {
    const hobby = hobbies.find(h => h.id === bookmark.hobby_id);
    if (!hobby) {
      throw new Error(`취미 정보를 찾을 수 없습니다: ${bookmark.hobby_id}`);
    }
    
    return {
      id: hobby.id,
      title: hobby.title,
      description: hobby.description,
      imageUrl: hobby.imageUrl,
      category: hobby.category,
      bookmarkedAt: bookmark.created_at,
    };
  });
}

// 카테고리별 북마크 통계
export async function getBookmarkStats(userId: string): Promise<Record<string, number>> {
  const bookmarkedHobbies = await getBookmarkedHobbiesWithDetails(userId);
  
  return bookmarkedHobbies.reduce((acc, hobby) => {
    acc[hobby.category] = (acc[hobby.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
