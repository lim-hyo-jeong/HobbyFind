'use client';

import { HobbyCard } from './hobby-card';

interface Hobby {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'sports' | 'intelligence' | 'art';
}

interface HobbyGridProps {
  hobbies: Hobby[];
  selectedCategory: string;
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void;
}

export function HobbyGrid({ hobbies, selectedCategory, onBookmarkToggle }: HobbyGridProps) {
  const filteredHobbies = selectedCategory === 'all'
    ? hobbies
    : hobbies.filter((hobby) => hobby.category === selectedCategory);

  if (filteredHobbies.length === 0) {
    return (
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
          {selectedCategory !== 'all' ? '해당 카테고리의 취미가 없습니다' : '취미를 찾을 수 없습니다'}
        </h3>
        <p className="text-gray-500">
          {selectedCategory !== 'all'
            ? '다른 카테고리를 선택해보세요.' 
            : '잠시 후 다시 시도해주세요.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredHobbies.map((hobby) => (
        <HobbyCard
          key={hobby.id}
          {...hobby}
          onBookmarkToggle={onBookmarkToggle}
        />
      ))}
    </div>
  );
}
