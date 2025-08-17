'use client';

import { useState } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { HeroSection } from '@/components/layout/hero-section';
import { CategoryFilter } from '@/components/hobby/category-filter';
import { HobbyGrid } from '@/components/hobby/hobby-grid';
import { hobbies } from '@/lib/data/hobbies';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleBookmarkToggle = (id: string, isBookmarked: boolean) => {
    // TODO: 북마크 상태를 전역 상태나 API로 관리
    console.log(`Bookmark ${id}: ${isBookmarked}`);
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Topbar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Main Content */}
      <main id="hobbies" className="py-16">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-4">
                카테고리별 취미 탐색
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                관심 있는 카테고리를 선택하여 다양한 취미를 발견해보세요
              </p>
            </div>
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </section>

          {/* Hobby Grid */}
          <section>
            <HobbyGrid
              hobbies={hobbies}
              selectedCategory={selectedCategory}
              onBookmarkToggle={handleBookmarkToggle}
            />
          </section>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
