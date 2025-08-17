import bcrypt from 'bcryptjs';
import { createClient } from './supabase/server';

export interface User {
  id: string;
  email: string;
  username: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// 비밀번호 해싱
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// 사용자 생성
export async function createUser(userData: CreateUserData): Promise<User> {
  try {
    const supabase = await createClient();
    
    console.log('Supabase client created successfully');
    console.log('Checking email:', userData.email);
    
    // 이메일 중복 확인
    const { data: existingEmail, error: emailError } = await supabase
      .from('users')
      .select('email')
      .eq('email', userData.email)
      .single();

    console.log('Email check result:', { existingEmail, emailError });

    if (emailError && emailError.code !== 'PGRST116') {
      console.error('Email check error:', emailError);
      throw new Error(`이메일 확인 중 오류가 발생했습니다: ${emailError.message}`);
    }

    if (existingEmail) {
      throw new Error('이미 사용 중인 이메일입니다.');
    }

    // 사용자명 중복 확인
    const { data: existingUsername, error: usernameError } = await supabase
      .from('users')
      .select('username')
      .eq('username', userData.username)
      .single();

    if (usernameError && usernameError.code !== 'PGRST116') {
      throw new Error('사용자명 확인 중 오류가 발생했습니다.');
    }

    if (existingUsername) {
      throw new Error('이미 사용 중인 사용자명입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(userData.password);

    // 사용자 생성
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: userData.email,
        username: userData.username,
        password_hash: hashedPassword,
      })
      .select()
      .single();

    if (createError) {
      console.error('Create user error:', createError);
      throw new Error('사용자 생성 중 오류가 발생했습니다.');
    }

    return newUser;
  } catch (error) {
    console.error('CreateUser function error:', error);
    throw error;
  }
}

// 사용자 로그인
export async function authenticateUser(loginData: LoginData): Promise<User> {
  const supabase = await createClient();

  // 이메일로 사용자 조회
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('email', loginData.email)
    .single();

  if (fetchError) {
    console.error('Fetch user error:', fetchError);
    
    // PGRST116는 "결과가 없음"을 의미
    if (fetchError.code === 'PGRST116') {
      throw new Error('등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.');
    }
    
    throw new Error('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }

  if (!user) {
    throw new Error('등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.');
  }

  // 비밀번호 검증
  const isValidPassword = await verifyPassword(loginData.password, user.password_hash);
  
  if (!isValidPassword) {
    throw new Error('비밀번호가 올바르지 않습니다. 다시 확인해주세요.');
  }

  return user;
}

// 사용자 ID로 사용자 조회
export async function getUserById(id: string): Promise<User | null> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

// 이메일로 사용자 조회
export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}
