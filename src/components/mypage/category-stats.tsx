'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Bookmark } from 'lucide-react';

interface CategoryStatsProps {
  stats: Record<string, number>;
  totalCount: number;
}

export function CategoryStats({ stats, totalCount }: CategoryStatsProps) {
  const categoryNames = {
    sports: '운동형',
    intelligence: '지능형',
    art: '예술형',
  };

  const categoryColors = {
    sports: 'bg-brand-red',
    intelligence: 'bg-brand-teal',
    art: 'bg-brand-gold',
  };

  const categoryIcons = {
    sports: '🏃‍♂️',
    intelligence: '🧠',
    art: '🎨',
  };

  const sortedCategories = Object.entries(stats).sort(([, a], [, b]) => b - a);

  const getPercentage = (count: number) => {
    return totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
  };

  const getMostPopularCategory = () => {
    if (sortedCategories.length === 0) return null;
    return sortedCategories[0];
  };

  const mostPopular = getMostPopularCategory();

  return (
    <div className="space-y-6">
      {/* 전체 통계 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-red" />
            전체 통계
          </CardTitle>
          <CardDescription>
            카테고리별 북마크 분포를 확인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-neutral-light rounded-lg">
              <div className="text-2xl font-bold text-brand-red">{totalCount}</div>
              <div className="text-sm text-gray-600">총 북마크</div>
            </div>
            <div className="text-center p-4 bg-neutral-light rounded-lg">
              <div className="text-2xl font-bold text-brand-teal">{Object.keys(stats).length}</div>
              <div className="text-sm text-gray-600">활성 카테고리</div>
            </div>
            <div className="text-center p-4 bg-neutral-light rounded-lg">
              <div className="text-2xl font-bold text-brand-gold">
                {mostPopular ? categoryNames[mostPopular[0] as keyof typeof categoryNames] : '-'}
              </div>
              <div className="text-sm text-gray-600">가장 인기</div>
            </div>
          </div>

          {/* 카테고리별 상세 통계 */}
          <div className="space-y-4">
            {sortedCategories.map(([category, count]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                    <span className="font-medium text-neutral-dark">
                      {categoryNames[category as keyof typeof categoryNames]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{count}개</span>
                    <span className="text-sm font-medium text-brand-red">
                      {getPercentage(count)}%
                    </span>
                  </div>
                </div>
                <Progress 
                  value={getPercentage(count)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 인사이트 카드 */}
      {mostPopular && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-gold" />
              인사이트
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">
                {categoryIcons[mostPopular[0] as keyof typeof categoryIcons]}
              </div>
              <div>
                <h3 className="font-semibold text-neutral-dark mb-1">
                  {categoryNames[mostPopular[0] as keyof typeof categoryNames]} 취미를 가장 좋아하시는군요!
                </h3>
                <p className="text-sm text-gray-600">
                  총 {totalCount}개 중 {mostPopular[1]}개({getPercentage(mostPopular[1])}%)가 {categoryNames[mostPopular[0] as keyof typeof categoryNames]} 카테고리입니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 빈 상태 */}
      {totalCount === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-dark mb-2">
              아직 북마크한 취미가 없습니다
            </h3>
            <p className="text-gray-600">
              취미를 북마크하면 여기서 통계를 확인할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
