'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { data: session, status } = useSession();
  
  return (
    <section className="bg-gradient-to-br from-neutral-light to-white py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">새로운 취미를 발견하세요</span>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-neutral-dark"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            당신만의
            <br />
            <span className="text-brand-red">특별한 취미</span>를 찾아보세요
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl mb-8 text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            운동형, 지능형, 예술형 취미 중에서 당신에게 맞는 취미를 발견하고,
            <br className="hidden md:block" />
            로그인하면 관심 있는 취미를 북마크하여 관리할 수 있습니다.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-brand-red hover:bg-brand-red/90 text-white px-8 py-3 text-lg rounded-full"
            >
              <Link href="#hobbies" className="flex items-center gap-2">
                취미 탐색하기
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            {status === 'loading' ? (
              <div className="w-32 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            ) : !session ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8 py-3 text-lg rounded-full"
              >
                <Link href="/signup">
                  회원가입
                </Link>
              </Button>
            ) : null}
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-red mb-1">18+</div>
              <div className="text-sm text-gray-600">다양한 취미</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-teal mb-1">3</div>
              <div className="text-sm text-gray-600">카테고리</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-gold mb-1">∞</div>
              <div className="text-sm text-gray-600">가능성</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
