import type { Metadata } from 'next';

const categoryInfo = {
  sports: {
    name: '운동형',
    description: '체력을 기르고 건강을 유지하는 활동적인 취미들을 발견하세요',
  },
  intelligence: {
    name: '지능형',
    description: '두뇌를 자극하고 지식을 쌓는 지적 취미들을 탐색하세요',
  },
  art: {
    name: '예술형',
    description: '창의성을 발휘하고 아름다움을 창조하는 예술적 취미들을 만나보세요',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const info = categoryInfo[category as keyof typeof categoryInfo];

  if (!info) {
    return {
      title: '카테고리를 찾을 수 없습니다 - HobbyFind',
      description: '요청하신 카테고리를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${info.name} 취미 - HobbyFind`,
    description: info.description,
    keywords: `${info.name}, 취미, 취미 추천, ${info.name} 취미, HobbyFind`,
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

