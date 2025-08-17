import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { removeBookmark } from '@/lib/bookmark-utils';
import { z } from 'zod';

const removeBookmarkSchema = z.object({
  hobbyId: z.string().min(1, '취미 ID가 필요합니다.'),
});

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { hobbyId } = removeBookmarkSchema.parse(body);

    await removeBookmark(session.user.id, hobbyId);
    
    return NextResponse.json({
      success: true,
      message: '북마크에서 제거되었습니다.',
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false,
          message: '잘못된 요청입니다.',
          errors: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: error instanceof Error ? error.message : '북마크를 제거할 수 없습니다.' 
      },
      { status: 500 }
    );
  }
}
