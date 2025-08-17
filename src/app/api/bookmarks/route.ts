import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBookmarkedHobbiesWithDetails } from '@/lib/bookmark-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const bookmarkedHobbies = await getBookmarkedHobbiesWithDetails(session.user.id);
    
    return NextResponse.json({
      success: true,
      data: bookmarkedHobbies,
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : '북마크 목록을 불러올 수 없습니다.' 
      },
      { status: 500 }
    );
  }
}
