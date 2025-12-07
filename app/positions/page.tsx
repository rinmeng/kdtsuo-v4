'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth, useToast } from '@/hooks';
import { supabase } from '@/lib';
import type { Position } from '@/types';
import { Clipboard, Edit, ExternalLink, Plus, Trash2, X } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui';
import * as PositionsActions from '@/components/PositionsActions';

const fallbackPositions: Position[] = [
  {
    label: 'Senior Executive Team',
    form_url: 'https://forms.gle/ufezb8Gut92E7pMeA',
    is_accepting_responses: true,
    description: 'Lead and manage club operations and strategic initiatives.',
  },
  {
    label: 'Junior Executive Team',
    form_url: 'https://forms.gle/ufezb8Gut92E7pMeA',
    is_accepting_responses: true,
    description: 'Support executive operations and gain leadership experience.',
  },
  {
    label: 'Dance Instructor',
    form_url: 'https://forms.gle/eciAuTKB63WLQzGg7',
    is_accepting_responses: true,
    description: 'Teach and choreograph dance routines for club members.',
  },
  {
    label: 'Performance Group',
    form_url: 'https://forms.gle/4CFzbsd3Xn1Lstns8',
    is_accepting_responses: true,
    description: 'Perform at various events and showcase your dance skills.',
  },
  {
    label: 'Cameraman',
    form_url: 'https://forms.gle/LpXTwzCNKjVZN3De9',
    is_accepting_responses: true,
    description: 'Capture club events and create engaging visual content.',
  },
];

export default function Positions() {
  const [positionsData, setPositionsData] = useState<Position[]>(fallbackPositions);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPositionFromDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Fetch error details:', error);
        throw error;
      }

      const positions = data && data.length > 0 ? data : fallbackPositions;
      setPositionsData(positions);
    } catch (error) {
      setPositionsData(fallbackPositions);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositionFromDatabase();
  }, [fetchPositionFromDatabase]);

  const handleCopyLink = (formUrl: string, label: string) => {
    navigator.clipboard.writeText(formUrl);
    toast.success(`Copied ${label} link to clipboard!`);
  };

  return (
    <div className='animate-fade-in overflow-x-hidden'>
      {/* Hero Section */}
      <div className='relative h-screen w-screen'>
        <Image
          className='object-cover brightness-[0.25]'
          src='/assets/img/stock/joinourteam.jpeg'
          alt='team'
          fill
          priority
        />

        <div
          className='relative flex h-full flex-col items-center justify-center space-y-4
            p-4 text-white'
        >
          <div>
            <h1
              className='text-lightblue-100 fade-in-from-bottom my-5 text-center text-3xl
                font-bold delay-75 lg:text-4xl'
            >
              Find out what position fits you!
            </h1>
            <p
              className='lg:paragraph fade-in-from-bottom max-w-screen-sm text-center
                text-xl delay-150'
            >
              We have a variety of positions available for you to join! Whether
              you&apos;re interested in dancing, videography, or graphic design, we have a
              spot for you.
            </p>
          </div>

          {/* Manage Positions Section - Admin Only */}
          {user && (
            <div
              className='fade-in-from-bottom flex justify-center gap-2 flex-wrap
                delay-200'
            >
              {/* Add Position Button */}
              <PositionsActions.AddEdit
                onPositionSaved={fetchPositionFromDatabase}
                trigger={
                  <Button variant='default'>
                    <Plus className='h-4 w-4' /> Add
                  </Button>
                }
              />

              {/* Edit Position Button */}
              <PositionsActions.AddEdit
                positions={positionsData}
                onPositionSaved={fetchPositionFromDatabase}
                trigger={
                  <Button variant='secondary'>
                    <Edit className='h-4 w-4' /> Edit
                  </Button>
                }
              />

              {/* Delete Position Button */}
              <PositionsActions.Delete
                positions={positionsData}
                onPositionDeleted={fetchPositionFromDatabase}
                trigger={
                  <Button variant='destructive'>
                    <Trash2 className='h-4 w-4' /> Delete
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Positions Cards Section */}
      {isLoading ? (
        <div className='container mx-auto px-4 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, index) => (
              <Card key={index} className='fade-in-from-bottom'>
                <CardHeader>
                  <Skeleton className='h-7 w-3/4 mb-2' />
                  <Skeleton className='h-4 w-full' />
                </CardHeader>
                <CardFooter className='flex gap-2'>
                  <Skeleton className='h-10 flex-1' />
                  <Skeleton className='h-10 flex-1' />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className='container mx-auto px-4 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {positionsData.map((position, index) => (
              <Card
                key={index}
                className={`fade-in-from-bottom ${
                  !position.is_accepting_responses ? 'opacity-60' : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <CardTitle className='text-xl'>{position.label}</CardTitle>
                    {!position.is_accepting_responses && (
                      <X className='h-5 w-5 text-red-500 shrink-0' />
                    )}
                  </div>
                  {position.description && (
                    <CardDescription className='text-base'>
                      {position.description}
                    </CardDescription>
                  )}
                </CardHeader>

                {!position.is_accepting_responses && (
                  <CardContent>
                    <div className='text-sm text-red-500 font-medium'>
                      Not accepting applications currently
                    </div>
                  </CardContent>
                )}

                <CardFooter className='flex gap-2 flex-wrap'>
                  <Button
                    variant='secondary'
                    className='flex-1'
                    onClick={() => handleCopyLink(position.form_url, position.label)}
                    disabled={!position.is_accepting_responses}
                  >
                    <Clipboard className='h-4 w-4' /> Copy Link
                  </Button>
                  <Button
                    asChild
                    variant='default'
                    className='flex-1'
                    disabled={!position.is_accepting_responses}
                  >
                    <a href={position.form_url} target='_blank' rel='noopener noreferrer'>
                      <ExternalLink className='h-4 w-4' /> Go to Form
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
