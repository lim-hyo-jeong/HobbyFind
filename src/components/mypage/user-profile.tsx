'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar } from 'lucide-react';

interface UserProfileProps {
  user: any;
  bookmarkCount?: number;
}

export function UserProfile({ user, bookmarkCount = 0 }: UserProfileProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-brand-red text-white text-xl font-semibold">
              {user?.name ? getInitials(user.name) : user?.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <h2 className="text-xl font-semibold text-neutral-dark">
                {user?.name || '사용자'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-2 mb-1">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{user?.email}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                가입일: {user?.createdAt ? formatDate(user.createdAt) : '정보 없음'}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-brand-red">
              {bookmarkCount}
            </div>
            <div className="text-sm text-gray-600">북마크</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
