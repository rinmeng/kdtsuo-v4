'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth, useToast } from '@/hooks';
import { supabase } from '@/lib';
import type { ActionType, Link } from '@/types';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, GripVertical, Loader2 } from 'lucide-react';
import { IconLinkWide } from '@/components/';
import { fallbackLinks } from '@/lib/data';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { getDelayClass } from '@/utils/animations';
import * as HomeActions from '@/components/HomeActions';

function SortableItem({ link }: { link: Link }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: link.id!,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='bg-secondary border-ring flex items-center gap-2 rounded-md border-2 p-3'
    >
      <div
        {...attributes}
        {...listeners}
        className='shrink-0 cursor-grab active:cursor-grabbing'
      >
        <GripVertical className='text-muted-foreground h-5 w-5' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-medium'>
          {link.label.length > 35 ? `${link.label.substring(0, 35)}...` : link.label}
        </p>
        <p className='text-muted-foreground truncate text-xs'>
          {link.link.length > 35 ? `${link.link.substring(0, 35)}...` : link.link}
        </p>
      </div>
    </div>
  );
}

export function LinkTrees() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const [manageOpen, setManageOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('order', { ascending: true })
        .order('date', { ascending: false });

      if (error) {
        console.error('Fetch error details:', error);
        throw error;
      }

      if (data && data.length > 0) {
        setLinks(data);
      } else {
        setLinks(fallbackLinks);
      }
    } catch (error) {
      toast.error('Failed to load links from database');
      setLinks(fallbackLinks);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSaveOrder = async () => {
    setIsSubmitting(true);
    try {
      const updates = links.map((link, index) => ({
        id: link.id,
        order: index,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('links')
          .update({ order: update.order })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast.success('Link order saved successfully!');
      setManageOpen(false);
      setSelectedAction(null);
      await fetchLinks();
    } catch (error) {
      toast.error('Failed to save link order');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkSaved = async () => {
    setManageOpen(false);
    setSelectedAction(null);
    setSelectedLinkId(null);
    await fetchLinks();
  };

  const handleLinkDeleted = async () => {
    setManageOpen(false);
    setSelectedAction(null);
    setSelectedLinkId(null);
    await fetchLinks();
  };

  const selectedLink = selectedLinkId
    ? links.find((l) => l.id === selectedLinkId)
    : undefined;

  return (
    <div
      className={`m-auto mt-5 mb-4 flex w-full flex-col justify-center space-y-4 px-4
        md:mt-10 md:max-w-1/2 lg:mx-4`}
    >
      {user && (
        <div className='mb-4 flex justify-center space-x-2'>
          <Dialog open={manageOpen} onOpenChange={setManageOpen}>
            <DialogTrigger asChild>
              <Button variant='secondary'>
                <Edit /> Manage Links
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Manage Links</DialogTitle>
              </DialogHeader>
              <ScrollArea type='always' className='max-h-[50vh] pr-4 sm:max-h-[70vh]'>
                <div className='space-y-4 px-2'>
                  <div className='flex flex-col space-y-2'>
                    <Label>Select Action</Label>
                    <Select
                      value={selectedAction || ''}
                      onValueChange={(value) => {
                        setSelectedAction(value as ActionType);
                        if (value === 'add') {
                          setSelectedLinkId(null);
                        }
                      }}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select action...' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value='add'>Add Link</SelectItem>
                          <SelectItem value='update'>Update Link</SelectItem>
                          <SelectItem value='delete'>Delete Link</SelectItem>
                          <SelectItem value='reorder'>Reorder Links</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {(selectedAction === 'update' || selectedAction === 'delete') && (
                    <div className='flex flex-col space-y-2'>
                      <Label>Select Link:</Label>
                      <Select
                        value={selectedLinkId?.toString() || ''}
                        onValueChange={(value) => setSelectedLinkId(Number(value))}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select link...' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {links
                              .filter((link) => link.id !== undefined)
                              .map((link) => (
                                <SelectItem key={link.id} value={link.id!.toString()}>
                                  {link.label}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {(selectedAction === 'add' ||
                    (selectedAction === 'update' && selectedLinkId)) && (
                    <HomeActions.AddEditLinkDialog
                      mode={selectedAction === 'add' ? 'add' : 'edit'}
                      link={selectedLink}
                      onLinkSaved={handleLinkSaved}
                      open={true}
                      onOpenChange={(open) => {
                        if (!open) {
                          setSelectedAction(null);
                          setSelectedLinkId(null);
                        }
                      }}
                    />
                  )}
                  {selectedAction === 'delete' && selectedLinkId && selectedLink && (
                    <HomeActions.DeleteLinkDialog
                      link={{ id: selectedLink.id!, label: selectedLink.label }}
                      onLinkDeleted={handleLinkDeleted}
                      trigger={
                        <Button variant='destructive' className='w-full'>
                          Delete Link
                        </Button>
                      }
                    />
                  )}
                  {selectedAction === 'reorder' && (
                    <div className='w-full space-y-4'>
                      <p className='text-muted-foreground text-sm'>
                        Drag and drop the links below to reorder them. Click &quot;Save
                        Order&quot; when done.
                      </p>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={links
                            .filter((link) => link.id !== undefined)
                            .map((link) => link.id!)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div
                            className='scrollbar-thin scrollbar-thumb-muted-foreground/50
                              scrollbar-track-secondary
                              hover:scrollbar-thumb-muted-foreground
                              scrollbar-thumb-rounded-full scrollbar-track-rounded-full
                              flex max-h-96 w-full flex-col space-y-2 overflow-x-hidden
                              overflow-y-auto pr-2'
                          >
                            {links
                              .filter((link) => link.id !== undefined)
                              .map((link) => (
                                <SortableItem key={link.id} link={link} />
                              ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </div>
                  )}
                </div>
              </ScrollArea>
              {/* DialogFooter for Reorder */}
              {selectedAction === 'reorder' && (
                <DialogFooter className='mt-4'>
                  <Button
                    onClick={handleSaveOrder}
                    className='w-full'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className='animate-spin' /> : 'Save Order'}
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}

      {loading ? (
        <div className='flex justify-center pb-[860px]'>
          <Loader2 className='h-12 w-12 animate-spin rounded-full text-gray-700' />
        </div>
      ) : (
        links.map((link, idx) => (
          <IconLinkWide
            key={link.id || link.label}
            iconType={link.iconType}
            label={link.label}
            link={link.link}
            date={link.date}
            price={link.price}
            className={`bg-secondary border-ring drop-shadow-box hover:bg-muted
              fade-in-from-bottom fill-mode-both border-2 text-center
              ${getDelayClass(idx)}`}
          />
        ))
      )}
    </div>
  );
}
