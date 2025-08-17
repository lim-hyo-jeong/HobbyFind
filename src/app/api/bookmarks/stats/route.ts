import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getBookmarkStats, getBookmarkedHobbiesWithDetails } from '@/lib/bookmark-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const [stats, bookmarkedHobbies] = await Promise.all([
      getBookmarkStats(session.user.id),
      getBookmarkedHobbiesWithDetails(session.user.id),
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        totalCount: bookmarkedHobbies.length,
        categoryCount: Object.keys(stats).length,
      },
    });
  } catch (error) {
    console.error('Error fetching bookmark stats:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : '북마크 통계를 불러올 수 없습니다.' 
      },
      { status: 500 }
    );
  }
}
