'use client';
import { getDelayClass } from '@/utils';
import { DiscoverCard } from '@/components/';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { DiscoverLinks } from '@/lib/data';

export function Discover() {
  return (
    <Card className='fade-in-from-bottom mx-4 text-center w-auto'>
      <CardContent className='flex justify-center gap-4'>
        {DiscoverLinks.map((card, index) => (
          <DiscoverCard
            key={`${card.title}-${index}`}
            title={card.title}
            icon={card.icon}
            description={card.description}
            image={card.image}
            link={card.link}
            isOpen={card.isOpen}
            className={`fade-in-from-bottom aspect-video w-full lg:w-1/4
            ${getDelayClass(index)}`}
          />
        ))}
      </CardContent>
    </Card>
  );
}
