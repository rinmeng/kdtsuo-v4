'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, DollarSign } from 'lucide-react';
import { z } from 'zod';
import { useToast } from '@/hooks';
import Image from 'next/image';
import { supabase } from '@/lib';
import { iconMap } from '@/utils';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
} from '@/components/ui';

const formSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  link: z.string().url('Please enter a valid URL'),
  iconType: z.string().min(1, 'Icon type is required'),
  price: z
    .number()
    .min(0, 'Enter a number or leave blank')
    .optional()
    .or(z.literal(undefined)),
});

type AddEditLinkDialogProps = {
  onLinkSaved: () => void;
  link?: {
    id?: number;
    label: string;
    link: string;
    iconType: string;
    price?: number;
  };
  mode: 'add' | 'edit';
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddEditLinkDialog({
  onLinkSaved,
  link,
  mode,
  trigger,
  open,
  onOpenChange,
}: AddEditLinkDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: link
      ? {
          label: link.label || '',
          link: link.link || '',
          iconType: link.iconType || 'link',
          price: link.price ?? undefined,
        }
      : {
          label: '',
          link: '',
          iconType: 'link',
          price: undefined,
        },
  });

  useEffect(() => {
    if (link) {
      form.reset({
        label: link.label || '',
        link: link.link || '',
        iconType: link.iconType || 'link',
        price: link.price ?? undefined,
      });
    } else {
      form.reset({
        label: '',
        link: '',
        iconType: 'link',
        price: undefined,
      });
    }
  }, [link, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You must be logged in to manage links');
        return;
      }

      if (mode === 'add') {
        const currentDate = new Date().toISOString().split('T')[0];
        const newLink = {
          ...values,
          date: currentDate,
          user_id: user.id,
        };
        const { error } = await supabase.from('links').insert([newLink]);
        if (error) throw error;
        toast.success('Link added successfully!');
      } else if (mode === 'edit' && link?.id) {
        const { error } = await supabase.from('links').update(values).eq('id', link.id);
        if (error) throw error;
        toast.success('Link updated successfully!');
      }
      form.reset();
      const handleClose = onOpenChange || setIsOpen;
      handleClose(false);
      onLinkSaved();
    } catch (error) {
      toast.error(
        mode === 'add'
          ? 'Failed to add link. Please try again.'
          : 'Failed to update link. Please try again.'
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const dialogOpen = open !== undefined ? open : isOpen;
  const handleOpenChange = onOpenChange || setIsOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Link' : 'Edit Link'}</DialogTitle>
        </DialogHeader>
        <ScrollArea type='always' className='max-h-[60vh] pr-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='label'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Label</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter link title' {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed for the link.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='link'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://example.com' {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the full URL including https://
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='iconType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='flex flex-row flex-wrap justify-start
                          md:justify-around'
                      >
                        {Object.keys(iconMap).map((iconKey) => {
                          const Icon = iconMap[iconKey].iconComponent;
                          const imagePath = iconMap[iconKey].imagePath;
                          return (
                            <FormItem
                              key={iconKey}
                              className='flex flex-col items-center space-y-2'
                            >
                              <FormControl>
                                <RadioGroupItem
                                  value={iconKey}
                                  id={`manage-${iconKey}`}
                                  className='sr-only'
                                />
                              </FormControl>
                              <label
                                htmlFor={`manage-${iconKey}`}
                                className={`hover:bg-accent flex cursor-pointer flex-col
                                items-center justify-center rounded-md border-2 p-4 ${
                                  field.value === iconKey
                                    ? 'border-primary bg-accent'
                                    : 'border-muted'
                                }`}
                              >
                                {Icon && <Icon strokeWidth={2} size={30} />}
                                {imagePath && (
                                  <Image
                                    src={imagePath}
                                    alt={iconKey}
                                    width={32}
                                    height={32}
                                    className='h-8 w-8 object-contain'
                                  />
                                )}
                              </label>
                            </FormItem>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className='flex items-center justify-between'>
                        <DollarSign className='mr-2' size={25} />
                        <Input
                          className='no-spinner items-center'
                          type='number'
                          placeholder='Enter a number or leave blank'
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? undefined : Number(val));
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Leave blank to hide price. Enter 0 for Free, or any positive value.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type='submit'
            disabled={isSubmitting}
            onClick={form.handleSubmit(handleSubmit)}
            className='w-full'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                {mode === 'add' ? 'Adding...' : 'Saving...'}
              </>
            ) : mode === 'add' ? (
              'Add Link'
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
