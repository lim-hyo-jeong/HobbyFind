import { NextRequest, NextResponse } from 'next/server';
import { createUser, authenticateUser, CreateUserData } from '@/lib/auth-utils';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  username: z.string().min(2, '사용자명은 2자 이상이어야 합니다.').max(20, '사용자명은 20자 이하여야 합니다.'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다.'),
});

export async function POST(request: NextRequest) {
  try {
    console.log('Signup API called');
    const body = await request.json();
    console.log('Request body:', { email: body.email, username: body.username, password: body.password ? 'provided' : 'missing' });
    
    // 입력 데이터 검증
    const validatedData = signupSchema.parse(body);
    console.log('Data validation passed');
    
    // 사용자 생성
    console.log('Creating user...');
    const user = await createUser(validatedData as CreateUserData);
    console.log('User created successfully:', { id: user.id, email: user.email });
    
    // 비밀번호 제외하고 응답
    const { password_hash, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: '회원가입이 완료되었습니다.',
        user: userWithoutPassword,
        // 자동 로그인을 위한 사용자 정보 포함
        loginData: {
          email: user.email,
          password: validatedData.password, // 클라이언트에서 사용
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup API error:', error);
    
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json(
        { 
          message: '입력 데이터가 올바르지 않습니다.',
          errors: error.errors 
        },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    
    console.error('Unknown signup error:', error);
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
