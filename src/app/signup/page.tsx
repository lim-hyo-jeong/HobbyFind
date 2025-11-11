'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Topbar } from '@/components/layout/topbar';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  username: z.string()
    .min(2, '사용자명은 2자 이상이어야 합니다.')
    .max(20, '사용자명은 20자 이하여야 합니다.')
    .regex(/^[a-zA-Z0-9가-힣_]+$/, '사용자명은 영문, 숫자, 한글, 언더스코어만 사용할 수 있습니다.'),
  password: z.string()
    .min(6, '비밀번호는 6자 이상이어야 합니다.')
    .max(100, '비밀번호는 100자 이하여야 합니다.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData.message || '회원가입 중 오류가 발생했습니다.';
        toast({
          title: '회원가입 실패',
          description: errorMsg,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: '회원가입 성공',
        description: '회원가입이 완료되었습니다. 자동으로 로그인됩니다.',
      });

      // 자동 로그인 처리
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          title: '자동 로그인 실패',
          description: '회원가입은 완료되었지만 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.',
          variant: 'destructive',
        });
        router.push('/login');
      } else if (signInResult?.ok) {
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });
        router.push('/');
        router.refresh();
      } else {
        toast({
          title: '자동 로그인 실패',
          description: '회원가입은 완료되었지만 자동 로그인에 실패했습니다. 수동으로 로그인해주세요.',
          variant: 'destructive',
        });
        router.push('/login');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.';
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="이메일을 입력하세요"
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>사용자명</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                              <Input
                                {...field}
                                type="text"
                                placeholder="사용자명을 입력하세요"
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                              <Input
                                {...field}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="비밀번호를 입력하세요 (6자 이상)"
                                className="pl-10 pr-10"
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>비밀번호 확인</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                              <Input
                                {...field}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="비밀번호를 다시 입력하세요"
                                className="pl-10 pr-10"
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
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-brand-red hover:bg-brand-red/90"
                      disabled={isLoading}
                    >
                      {isLoading ? '가입 중...' : '회원가입'}
                    </Button>
                  </form>
                </Form>
                
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
