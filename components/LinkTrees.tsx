'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth, useToast } from '@/hooks';
import { supabase } from '@/lib';
import type { Link } from '@/types';
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
import { GripVertical, Loader2, Edit, Trash2, ArrowUpDown, Plus } from 'lucide-react';
import { IconLinkWide } from '@/components/';
import { fallbackLinks } from '@/lib/data';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reorderOpen, setReorderOpen] = useState(false);
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
      setReorderOpen(false);
      await fetchLinks();
    } catch (error) {
      toast.error('Failed to save link order');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkSaved = async () => {
    setEditOpen(false);
    setSelectedLinkId(null);
    await fetchLinks();
  };

  const handleLinkDeleted = async () => {
    setDeleteOpen(false);
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
        <div className='mb-4 flex flex-wrap justify-center gap-2'>
          {/* Add Link Button */}
          <HomeActions.AddEditLinkDialog
            mode='add'
            onLinkSaved={fetchLinks}
            trigger={
              <Button variant='default'>
                <Plus className='h-4 w-4' /> Add
              </Button>
            }
          />

          {/* Edit Link Button */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <Button
              variant='secondary'
              onClick={() => {
                setEditOpen(true);
                setSelectedLinkId(null);
              }}
            >
              <Edit className='h-4 w-4' /> Edit
            </Button>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Edit Link</DialogTitle>
              </DialogHeader>
              <ScrollArea type='always' className='max-h-[50vh] pr-4 sm:max-h-[70vh]'>
                <div className='space-y-4 px-2'>
                  <div className='flex flex-col space-y-2'>
                    <Label>Select Link to Edit:</Label>
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
                  {selectedLinkId && selectedLink && (
                    <HomeActions.AddEditLinkDialog
                      mode='edit'
                      link={selectedLink}
                      onLinkSaved={handleLinkSaved}
                      open={true}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditOpen(false);
                          setSelectedLinkId(null);
                        }
                      }}
                    />
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Delete Link Button */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <Button
              variant='secondary'
              onClick={() => {
                setDeleteOpen(true);
                setSelectedLinkId(null);
              }}
            >
              <Trash2 className='h-4 w-4' /> Delete
            </Button>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Delete Link</DialogTitle>
              </DialogHeader>
              <ScrollArea type='always' className='max-h-[50vh] pr-4 sm:max-h-[70vh]'>
                <div className='space-y-4 px-2'>
                  <div className='flex flex-col space-y-2'>
                    <Label>Select Link to Delete:</Label>
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
                  {selectedLinkId && selectedLink && (
                    <HomeActions.DeleteLinkDialog
                      link={{ id: selectedLink.id!, label: selectedLink.label }}
                      onLinkDeleted={handleLinkDeleted}
                      trigger={
                        <Button variant='destructive' className='w-full'>
                          Delete &quot;{selectedLink.label}&quot;
                        </Button>
                      }
                    />
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Reorder Links Button */}
          <Dialog open={reorderOpen} onOpenChange={setReorderOpen}>
            <Button variant='secondary' onClick={() => setReorderOpen(true)}>
              <ArrowUpDown className='h-4 w-4' /> Reorder
            </Button>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Reorder Links</DialogTitle>
              </DialogHeader>
              <ScrollArea type='always' className='max-h-[50vh] pr-4 sm:max-h-[70vh]'>
                <div className='space-y-4 px-2'>
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
                          scrollbar-track-secondary hover:scrollbar-thumb-muted-foreground
                          scrollbar-thumb-rounded-full scrollbar-track-rounded-full flex
                          max-h-96 w-full flex-col space-y-2 overflow-x-hidden
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
              </ScrollArea>
              <DialogFooter className='mt-4'>
                <Button
                  onClick={handleSaveOrder}
                  className='w-full'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className='animate-spin' /> : 'Save Order'}
                </Button>
              </DialogFooter>
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
