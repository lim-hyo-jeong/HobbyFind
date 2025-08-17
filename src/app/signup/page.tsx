'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Topbar } from '@/components/layout/topbar';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
      const errorMsg = '모든 필드를 입력해주세요.';
      setErrorMessage(errorMsg);
      toast({
        title: '입력 오류',
        description: errorMsg,
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = '비밀번호가 일치하지 않습니다.';
      setErrorMessage(errorMsg);
      toast({
        title: '비밀번호 불일치',
        description: errorMsg,
        variant: 'destructive',
      });
      return false;
    }

    if (formData.password.length < 6) {
      const errorMsg = '비밀번호는 6자 이상이어야 합니다.';
      setErrorMessage(errorMsg);
      toast({
        title: '비밀번호 오류',
        description: errorMsg,
        variant: 'destructive',
      });
      return false;
    }

    if (formData.username.length < 2) {
      const errorMsg = '사용자명은 2자 이상이어야 합니다.';
      setErrorMessage(errorMsg);
      toast({
        title: '사용자명 오류',
        description: errorMsg,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrorMessage('');

    console.log('Signup attempt for email:', formData.email);

    try {
      console.log('Sending signup request...');
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Signup response data:', data);

      if (!response.ok) {
        const errorMsg = data.message || '회원가입 중 오류가 발생했습니다.';
        console.error('Signup failed:', { status: response.status, error: errorMsg });
        setErrorMessage(errorMsg);
        
        // 에러 토스트 표시
        toast({
          title: '회원가입 실패',
          description: errorMsg,
          variant: 'destructive',
        });
        return; // throw 대신 return으로 변경
      }

      toast({
        title: '회원가입 성공',
        description: '회원가입이 완료되었습니다. 자동으로 로그인됩니다.',
      });

      // 자동 로그인 처리
      console.log('Attempting auto-login for:', formData.email);
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log('Auto-login result:', signInResult);

      if (signInResult?.error) {
        console.error('Auto-login error:', signInResult.error);
        toast({
          title: '자동 로그인 실패',
          description: '회원가입은 완료되었지만 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.',
          variant: 'destructive',
        });
        router.push('/login');
      } else if (signInResult?.ok) {
        console.log('Auto-login successful');
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });
        router.push('/');
        router.refresh();
      } else {
        console.error('Unexpected auto-login result:', signInResult);
        toast({
          title: '자동 로그인 실패',
          description: '회원가입은 완료되었지만 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.',
          variant: 'destructive',
        });
        router.push('/login');
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
      setErrorMessage(errorMsg);
      toast({
        title: '회원가입 실패',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Topbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-neutral-dark">
                  회원가입
                </CardTitle>
                <CardDescription>
                  새로운 계정을 만들어 취미를 북마크하고 관리하세요
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="이메일을 입력하세요"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">사용자명</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="사용자명을 입력하세요"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력하세요 (6자 이상)"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 다시 입력하세요"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  


                  {/* 에러 메시지 표시 */}
                  {errorMessage && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full bg-brand-red hover:bg-brand-red/90"
                    disabled={isLoading}
                  >
                    {isLoading ? '가입 중...' : '회원가입'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center space-y-4">
                  {/* 로그인 링크를 더 눈에 띄게 */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 mb-2">
                      이미 계정이 있으신가요?
                    </p>
                    <Link 
                      href="/login" 
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-lg font-medium transition-colors"
                    >
                      로그인하기
                    </Link>
                  </div>
                  
                  <Link 
                    href="/" 
                    className="text-sm text-gray-500 hover:text-gray-700 block"
                  >
                    홈으로 돌아가기
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
