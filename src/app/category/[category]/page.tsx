'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Topbar } from '@/components/layout/topbar';
import { HobbyGrid } from '@/components/hobby/hobby-grid';
import { CategoryFilter } from '@/components/hobby/category-filter';
import { hobbies, getHobbiesByCategory } from '@/lib/data/hobbies';
import { Toaster } from '@/components/ui/toaster';
import { ArrowLeft, TrendingUp, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const categoryInfo = {
  sports: {
    name: '운동형',
    description: '체력을 기르고 건강을 유지하는 활동적인 취미들',
    icon: '🏃‍♂️',
    color: 'bg-brand-red',
    textColor: 'text-brand-red',
    bgGradient: 'from-red-50 to-orange-50',
  },
  intelligence: {
    name: '지능형',
    description: '두뇌를 자극하고 지식을 쌓는 지적 취미들',
    icon: '🧠',
    color: 'bg-brand-teal',
    textColor: 'text-brand-teal',
    bgGradient: 'from-teal-50 to-cyan-50',
  },
  art: {
    name: '예술형',
    description: '창의성을 발휘하고 아름다움을 창조하는 예술적 취미들',
    icon: '🎨',
    color: 'bg-brand-gold',
    textColor: 'text-brand-gold',
    bgGradient: 'from-yellow-50 to-orange-50',
  },
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category);
  const [filteredHobbies, setFilteredHobbies] = useState(getHobbiesByCategory(category));

  useEffect(() => {
    setSelectedCategory(category);
    setFilteredHobbies(getHobbiesByCategory(category));
  }, [category]);

  const handleBookmarkToggle = (id: string, isBookmarked: boolean) => {
    // 북마크 상태 변경 처리 (이미 HobbyCard에서 처리됨)
  };

  const handleCategoryChange = (newCategory: string | null) => {
    setSelectedCategory(newCategory);
    setFilteredHobbies(getHobbiesByCategory(newCategory));
  };

  // 유효하지 않은 카테고리인 경우
  if (!categoryInfo[category as keyof typeof categoryInfo]) {
    return (
      <div className="min-h-screen bg-neutral-light">
        <Topbar />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-neutral-dark mb-4">
              카테고리를 찾을 수 없습니다
            </h1>
            <Link href="/">
              <Button>홈으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const info = categoryInfo[category as keyof typeof categoryInfo];
  const categoryHobbies = getHobbiesByCategory(category);

  // 애니메이션 variants
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Topbar />
      
      {/* Hero Section */}
      <section className={`bg-gradient-to-br ${info.bgGradient} py-16 md:py-24`}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            variants={heroVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="mb-6" variants={itemVariants}>
              <Link href="/">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  홈으로 돌아가기
                </Button>
              </Link>
            </motion.div>
            
            <motion.div className="mb-6" variants={itemVariants}>
              <div className="text-6xl mb-4">{info.icon}</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-neutral-dark">
                {info.name} 취미
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                {info.description}
              </p>
            </motion.div>

            {/* 통계 카드 */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-8"
              variants={itemVariants}
            >
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-brand-red mb-1">
                    {categoryHobbies.length}
                  </div>
                  <div className="text-sm text-gray-600">총 취미</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-brand-teal mb-1">
                    인기
                  </div>
                  <div className="text-sm text-gray-600">카테고리</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-brand-gold mb-1">
                    다양
                  </div>
                  <div className="text-sm text-gray-600">활동</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
                {info.name} 취미 탐색
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {info.name} 카테고리의 다양한 취미들을 발견해보세요
              </p>
            </div>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              enableNavigation={true}
            />
          </section>

          {/* Hobby Grid */}
          <section>
            {filteredHobbies.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-dark mb-2">
                  해당 카테고리의 취미가 없습니다
                </h3>
                <p className="text-gray-500 mb-4">
                  다른 카테고리를 선택해보세요.
                </p>
                <Link href="/">
                  <Button variant="outline">전체 취미 보기</Button>
                </Link>
              </div>
            ) : (
              <HobbyGrid
                hobbies={filteredHobbies}
                selectedCategory={selectedCategory}
                onBookmarkToggle={handleBookmarkToggle}
              />
            )}
          </section>

          {/* 추천 섹션 */}
          <section className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark mb-4">
                {info.name} 취미 추천
              </h2>
              <p className="text-gray-600">
                이 카테고리에서 가장 인기 있는 취미들을 확인해보세요
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryHobbies.slice(0, 3).map((hobby) => (
                <Card key={hobby.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <img
                      src={hobby.imageUrl}
                      alt={hobby.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${info.color} text-white`}>
                        추천
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-neutral-dark mb-2">
                      {hobby.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {hobby.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
