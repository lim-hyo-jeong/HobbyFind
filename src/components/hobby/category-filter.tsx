'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  enableNavigation?: boolean;
}

const categories = [
  { id: 'all', name: '전체' },
  { id: 'sports', name: '운동형' },
  { id: 'intelligence', name: '지능형' },
  { id: 'art', name: '예술형' },
];

export function CategoryFilter({ selectedCategory, onCategoryChange, enableNavigation = false }: CategoryFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleCategoryClick = (categoryId: string) => {
    if (enableNavigation) {
      if (categoryId === 'all') {
        // 홈페이지로 이동
        router.push('/');
      } else {
        // 카테고리 페이지로 이동
        router.push(`/category/${categoryId}`);
      }
    } else {
      // 로컬 상태만 변경
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryClick(category.id)}
          className={cn(
            'rounded-full px-4 py-2 transition-all duration-200',
            selectedCategory === category.id
              ? 'bg-brand-red text-white border-brand-red hover:bg-brand-red/90'
              : 'border-border-gray text-neutral-dark hover:bg-neutral-light'
          )}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
