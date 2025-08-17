import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBookmarked } from '@/lib/bookmark-utils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const hobbyId = searchParams.get('hobbyId');

    if (!hobbyId) {
      return NextResponse.json(
        { message: '취미 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const bookmarked = await isBookmarked(session.user.id, hobbyId);
    
    return NextResponse.json({
      success: true,
      isBookmarked: bookmarked,
    });
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : '북마크 상태를 확인할 수 없습니다.' 
      },
      { status: 500 }
    );
  }
}
