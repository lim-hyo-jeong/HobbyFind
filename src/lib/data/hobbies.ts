export interface Hobby {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'sports' | 'intelligence' | 'art';
}

export const hobbies: Hobby[] = [
  // 운동형 취미
  {
    id: 'running',
    title: '조깅/러닝',
    description: '가장 접근하기 쉬운 유산소 운동으로, 체력 향상과 스트레스 해소에 효과적입니다.',
    imageUrl: '/thumbnails/running.jpg',
    category: 'sports',
  },
  {
    id: 'yoga',
    title: '요가',
    description: '신체의 유연성과 균형감각을 향상시키며, 마음의 평화를 찾을 수 있는 운동입니다.',
    imageUrl: '/thumbnails/yoga.jpg',
    category: 'sports',
  },
  {
    id: 'swimming',
    title: '수영',
    description: '전신 운동으로 근력과 심폐지구력을 동시에 향상시키는 효과적인 운동입니다.',
    imageUrl: '/thumbnails/swimming.jpg',
    category: 'sports',
  },
  {
    id: 'cycling',
    title: '자전거',
    description: '야외에서 즐길 수 있는 유산소 운동으로, 관광과 운동을 동시에 즐길 수 있습니다.',
    imageUrl: '/thumbnails/cycling.jpg',
    category: 'sports',
  },
  {
    id: 'climbing',
    title: '클라이밍',
    description: '전신 근력을 사용하는 운동으로, 문제 해결 능력과 집중력을 향상시킵니다.',
    imageUrl: '/thumbnails/climbing.jpg',
    category: 'sports',
  },
  {
    id: 'dance',
    title: '댄스',
    description: '음악에 맞춰 춤을 추며 즐거움을 느끼고, 리듬감과 표현력을 기를 수 있습니다.',
    imageUrl: '/thumbnails/dance.jpg',
    category: 'sports',
  },

  // 지능형 취미
  {
    id: 'reading',
    title: '독서',
    description: '다양한 지식과 경험을 쌓을 수 있으며, 상상력과 사고력을 향상시킵니다.',
    imageUrl: '/thumbnails/reading.jpg',
    category: 'intelligence',
  },
  {
    id: 'puzzle',
    title: '퍼즐',
    description: '논리적 사고와 문제 해결 능력을 향상시키며, 집중력을 기를 수 있습니다.',
    imageUrl: '/thumbnails/puzzle.jpg',
    category: 'intelligence',
  },
  {
    id: 'chess',
    title: '체스',
    description: '전략적 사고와 예측 능력을 향상시키는 고전적인 두뇌 게임입니다.',
    imageUrl: '/thumbnails/chess.jpg',
    category: 'intelligence',
  },
  {
    id: 'programming',
    title: '프로그래밍',
    description: '논리적 사고와 창의적 문제 해결 능력을 기를 수 있는 기술적 취미입니다.',
    imageUrl: '/thumbnails/programming.jpg',
    category: 'intelligence',
  },
  {
    id: 'language',
    title: '외국어 학습',
    description: '새로운 언어를 배우며 문화적 지식을 넓히고, 뇌의 인지 능력을 향상시킵니다.',
    imageUrl: '/thumbnails/foreign_language_learning.jpg',
    category: 'intelligence',
  },
  {
    id: 'photography',
    title: '사진 촬영',
    description: '예술적 감각과 기술적 지식을 결합하여 아름다운 순간을 기록할 수 있습니다.',
    imageUrl: '/thumbnails/photography.jpg',
    category: 'intelligence',
  },

  // 예술형 취미
  {
    id: 'painting',
    title: '그림 그리기',
    description: '창의적 표현과 감정 해소를 통해 예술적 감각을 기를 수 있습니다.',
    imageUrl: '/thumbnails/drawing.jpg',
    category: 'art',
  },
  {
    id: 'music',
    title: '악기 연주',
    description: '음악적 감각을 기르고, 집중력과 손의 협응력을 향상시킬 수 있습니다.',
    imageUrl: '/thumbnails/instrument_playing.jpg',
    category: 'art',
  },
  {
    id: 'cooking',
    title: '요리',
    description: '창의적 조합과 정확한 기술이 필요한 예술적 활동으로, 성취감을 느낄 수 있습니다.',
    imageUrl: '/thumbnails/cooking.jpg',
    category: 'art',
  },
  {
    id: 'calligraphy',
    title: '서예',
    description: '한글의 아름다움을 표현하며, 집중력과 인내심을 기를 수 있습니다.',
    imageUrl: '/thumbnails/calligraphy.jpg',
    category: 'art',
  },
  {
    id: 'pottery',
    title: '도자기 만들기',
    description: '흙을 다루며 창작의 즐거움을 느끼고, 손의 섬세함을 기를 수 있습니다.',
    imageUrl: '/thumbnails/pottery.jpg',
    category: 'art',
  },
  {
    id: 'gardening',
    title: '정원 가꾸기',
    description: '자연과 함께하며 생명의 소중함을 느끼고, 아름다운 공간을 창조할 수 있습니다.',
    imageUrl: '/thumbnails/gardening.jpg',
    category: 'art',
  },
];

export const getHobbiesByCategory = (category: string | null): Hobby[] => {
  if (!category) return hobbies;
  return hobbies.filter((hobby) => hobby.category === category);
};

export const getHobbyById = (id: string): Hobby | undefined => {
  return hobbies.find((hobby) => hobby.id === id);
};
