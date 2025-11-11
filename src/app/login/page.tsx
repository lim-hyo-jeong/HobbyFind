'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
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
        toast({
          title: '로그인 성공',
          description: '환영합니다!',
        });
        router.push('/');
        router.refresh();
      } else {
        const errorMsg = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
        toast({
          title: '로그인 실패',
          description: errorMsg,
          variant: 'destructive',
        });
      }
    } catch (error) {
      const errorMsg = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
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
                                placeholder="비밀번호를 입력하세요"
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

                    <Button
                      type="submit"
                      className="w-full bg-brand-red hover:bg-brand-red/90"
                      disabled={isLoading}
                    >
                      {isLoading ? '로그인 중...' : '로그인'}
                    </Button>
                  </form>
                </Form>
                
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
