'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/layout/topbar';
import { BookmarkedHobbyGrid } from '@/components/mypage/bookmarked-hobby-grid';
import { CategoryStats } from '@/components/mypage/category-stats';
import { UserProfile } from '@/components/mypage/user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, BarChart3, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { BookmarkedHobby } from '@/lib/bookmark-utils';

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [bookmarkedHobbies, setBookmarkedHobbies] = useState<BookmarkedHobby[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);

  // 북마크 데이터 로드
  const loadBookmarkData = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const [bookmarksResponse, statsResponse] = await Promise.all([
        fetch('/api/bookmarks'),
        fetch('/api/bookmarks/stats'),
      ]);

      if (bookmarksResponse.ok) {
        const bookmarksData = await bookmarksResponse.json();
        setBookmarkedHobbies(bookmarksData.data);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data.stats);
        setTotalCount(statsData.data.totalCount);
      }
    } catch (error) {
      console.error('Error loading bookmark data:', error);
      toast({
        title: '데이터 로드 실패',
        description: '북마크 데이터를 불러올 수 없습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 상태 확인 및 데이터 로드
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      toast({
        title: '로그인이 필요합니다',
        description: '마이페이지를 이용하려면 로그인해주세요.',
        variant: 'destructive',
      });
      router.push('/login');
    } else {
      loadBookmarkData();
    }
  }, [session, status, router, toast]);

  // 로딩 중이거나 로그인하지 않은 경우
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-light">
        <Topbar />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // 리다이렉트 중
  }

  const handleBookmarkRemove = async (hobbyId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookmarks/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hobbyId }),
      });

      if (response.ok) {
        setBookmarkedHobbies(prev => prev.filter(hobby => hobby.id !== hobbyId));
        setTotalCount(prev => prev - 1);
        
        // 통계 업데이트
        const updatedStats = { ...stats };
        const removedHobby = bookmarkedHobbies.find(h => h.id === hobbyId);
        if (removedHobby) {
          updatedStats[removedHobby.category] = Math.max(0, (updatedStats[removedHobby.category] || 0) - 1);
          setStats(updatedStats);
        }
        
        toast({
          title: '북마크 제거됨',
          description: '북마크에서 제거했습니다.',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      toast({
        title: '오류가 발생했습니다',
        description: error instanceof Error ? error.message : '북마크를 제거할 수 없습니다. 다시 시도해주세요.',
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
          {/* 헤더 섹션 */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-2">
              마이페이지
            </h1>
            <p className="text-lg text-gray-600">
              {session.user?.name || session.user?.email}님의 취미 북마크를 관리하세요
            </p>
          </div>

          {/* 사용자 프로필 카드 */}
          <div className="mb-8">
            <UserProfile user={session.user} bookmarkCount={totalCount} />
          </div>

          {/* 탭 네비게이션 */}
          <Tabs defaultValue="bookmarks" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto">
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                북마크 ({bookmarkedHobbies.length})
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                통계
              </TabsTrigger>
            </TabsList>

            {/* 북마크 탭 */}
            <TabsContent value="bookmarks" className="space-y-6">
              {bookmarkedHobbies.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-neutral-dark mb-2">
                      아직 북마크한 취미가 없습니다
                    </h3>
                    <p className="text-gray-600 mb-4">
                      관심 있는 취미를 북마크하면 여기서 확인할 수 있습니다.
                    </p>
                    <button
                      onClick={() => router.push('/')}
                      className="bg-brand-red hover:bg-brand-red/90 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      취미 탐색하기
                    </button>
                  </CardContent>
                </Card>
              ) : (
                <BookmarkedHobbyGrid
                  hobbies={bookmarkedHobbies}
                  onBookmarkRemove={handleBookmarkRemove}
                  isLoading={isLoading}
                />
              )}
            </TabsContent>

            {/* 통계 탭 */}
            <TabsContent value="stats" className="space-y-6">
              <CategoryStats stats={stats} totalCount={totalCount} />
            </TabsContent>


          </Tabs>
        </div>
      </main>
    </div>
  );
}
