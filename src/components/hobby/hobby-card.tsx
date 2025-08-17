'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface HobbyCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'sports' | 'intelligence' | 'art';
  isBookmarked?: boolean;
  onBookmarkToggle?: (id: string, isBookmarked: boolean) => void;
}

export function HobbyCard({
  id,
  title,
  description,
  imageUrl,
  category,
  isBookmarked = false,
  onBookmarkToggle,
}: HobbyCardProps) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  // 북마크 상태 초기화
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch(`/api/bookmarks/check?hobbyId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setBookmarked(data.isBookmarked);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [id, session?.user?.id]);

  const handleBookmarkClick = async () => {
    if (!session) {
      toast({
        title: '로그인이 필요합니다',
        description: '북마크 기능을 사용하려면 로그인해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/bookmarks/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hobbyId: id }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarked(data.isBookmarked);
        onBookmarkToggle?.(id, data.isBookmarked);
        
        toast({
          title: data.isBookmarked ? '북마크 추가됨' : '북마크 해제됨',
          description: data.message,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast({
        title: '오류가 발생했습니다',
        description: error instanceof Error ? error.message : '북마크 상태를 변경할 수 없습니다. 다시 시도해주세요.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
            {getCategoryName(category)}
          </span>
        </div>
        {session && (
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 w-8 h-8 p-0 rounded-full transition-colors ${
              bookmarked 
                ? 'bg-brand-gold text-neutral-dark hover:bg-brand-gold/90' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
            onClick={handleBookmarkClick}
            disabled={isLoading}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </Button>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-neutral-dark mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
