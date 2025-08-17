'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface BookmarkedHobby {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'sports' | 'intelligence' | 'art';
  bookmarkedAt: string;
}

interface BookmarkedHobbyGridProps {
  hobbies: BookmarkedHobby[];
  onBookmarkRemove: (hobbyId: string) => void;
  isLoading: boolean;
}

export function BookmarkedHobbyGrid({ hobbies, onBookmarkRemove, isLoading }: BookmarkedHobbyGridProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sports':
        return 'bg-brand-red text-white';
      case 'intelligence':
        return 'bg-brand-teal text-white';
      case 'art':
        return 'bg-brand-gold text-neutral-dark';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'sports':
        return '운동형';
      case 'intelligence':
        return '지능형';
      case 'art':
        return '예술형';
      default:
        return '기타';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy년 M월 d일', { locale: ko });
    } catch {
      return dateString;
    }
  };

  if (hobbies.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-dark mb-2">
          북마크한 취미가 없습니다
        </h3>
        <p className="text-gray-600">
          관심 있는 취미를 북마크하면 여기서 확인할 수 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hobbies.map((hobby) => (
        <Card key={hobby.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="relative">
            <img
              src={hobby.imageUrl}
              alt={hobby.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(hobby.category)}`}>
                {getCategoryName(hobby.category)}
              </span>
            </div>
            <div className="absolute top-3 right-3 flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full bg-brand-gold text-neutral-dark hover:bg-brand-gold/90"
                disabled
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 rounded-full bg-white/80 text-red-500 hover:bg-red-50"
                onClick={() => onBookmarkRemove(hobby.id)}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>북마크: {formatDate(hobby.bookmarkedAt)}</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-dark mb-2 line-clamp-2">
              {hobby.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {hobby.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
