'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Topbar } from '@/components/layout/topbar';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    console.log('Login attempt for email:', email);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('SignIn result:', result);

      if (result?.error) {
        console.error('Login error:', result.error);
        setErrorMessage(result.error);
        
        // 구체적인 에러 메시지에 따라 다른 토스트 메시지 표시
        if (result.error.includes('등록되지 않은 이메일')) {
          toast({
            title: '회원가입이 필요합니다',
            description: '등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.',
            variant: 'destructive',
          });
        } else if (result.error.includes('비밀번호가 올바르지 않습니다')) {
          toast({
            title: '비밀번호 오류',
            description: '비밀번호가 올바르지 않습니다. 다시 확인해주세요.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: '로그인 실패',
            description: result.error,
            variant: 'destructive',
          });
        }
      } else if (result?.ok) {
        console.log('Login successful');
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });
        router.push('/');
        router.refresh();
      } else {
        console.error('Unexpected login result:', result);
        const errorMsg = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
        setErrorMessage(errorMsg);
        toast({
          title: '로그인 실패',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login exception:', error);
      const errorMsg = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
      setErrorMessage(errorMsg);
      toast({
        title: '오류 발생',
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
                  로그인
                </CardTitle>
                <CardDescription>
                  계정에 로그인하여 취미를 북마크하고 관리하세요
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    {isLoading ? '로그인 중...' : '로그인'}
                  </Button>
                </form>
                
                <div className="mt-6 text-center space-y-4">
                  {/* 회원가입 링크를 더 눈에 띄게 */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                      아직 계정이 없으신가요?
                    </p>
                    <Link 
                      href="/signup" 
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-brand-red hover:bg-brand-red/90 text-white rounded-lg font-medium transition-colors"
                    >
                      회원가입하기
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
