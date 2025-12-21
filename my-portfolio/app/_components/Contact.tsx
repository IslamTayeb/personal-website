'use client';
import React, { useState } from 'react';
import { Section } from './Misc/Section';
import { Badge } from '@/components/ui/badge';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { sendEmail } from './sendEmail';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCopyToClipboard } from 'usehooks-ts';

// Type definition for contact items
type ContactItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
  value?: string;
  href: string;
  isCopyable: boolean;
  iconClass?: string;
};

// Contact links data
const contactsData: ContactItem[] = [
  {
    id: 'email',
    label: 'Email',
    description: 'for more hefty requests',
    icon: 'lucide:mail',
    value: 'islam.tayeb@duke.edu',
    href: 'mailto:islam.tayeb@duke.edu',
    isCopyable: true,
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'for more technical + personal musings',
    icon: 'lucide:command',
    href: 'https://apmoverflow.xyz/',
    isCopyable: false,
  },
  {
    id: 'github',
    label: 'GitHub',
    description: 'for code and repos',
    icon: 'jam:github',
    href: 'https://github.com/IslamTayeb',
    isCopyable: false,
  },
  {
    id: 'twitter',
    label: 'X',
    description: 'for shower thoughts',
    icon: 'prime:twitter',
    href: 'https://x.com/IslamTyb',
    isCopyable: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'for a professional summary',
    icon: 'mdi:linkedin',
    href: 'https://www.linkedin.com/in/islam-tayeb/',
    isCopyable: false,
  },
  {
    id: 'scholar',
    label: 'Scholar',
    description: 'for my publications',
    icon: 'fa6-brands:google-scholar',
    href: 'https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ',
    isCopyable: false,
  },
];

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name is required' })
    .max(50, { message: 'Your name must be 50 characters or fewer' }),
  email: z.string().email({ message: 'Email must be valid' }),
  subject: z
    .string()
    .min(2, { message: 'Subject is required' })
    .max(250, { message: 'Subject must be 250 characters or fewer' }),
  text: z
    .string()
    .min(2, { message: 'Message is required' })
    .max(2500, { message: 'Message must be 2500 characters or fewer' }),
});

export const Contact = () => {
  // const { toast } = useToast();
  // const [isSending, setIsSending] = useState(false);
  const [copiedButton, setCopiedButton] = useState('');
  //
  // // Define your form.
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: '',
  //     email: '',
  //     text: '',
  //     subject: '',
  //   },
  // });
  //
  // // Define a submit handler.
  // async function onSubmit(values: z.infer<typeof formSchema>) {
  //   setIsSending(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append('name', values.name);
  //     formData.append('email', values.email);
  //     formData.append('subject', values.subject);
  //     formData.append('text', values.text);
  //
  //     const { data, error } = await sendEmail(formData);
  //
  //     if (error) {
  //       toast({
  //         description: `An unexpected error occurred: ${error}`,
  //         variant: 'destructive',
  //       });
  //     } else {
  //       toast({
  //         description: "Successfully sent! I'll get back to you soon.",
  //       });
  //     }
  //   } catch (error) {
  //     toast({
  //       description: `An unexpected error occurred: ${error}`,
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setIsSending(false);
  //   }
  // }
  //
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (value: string, buttonId: string) => {
    copy(value);
    setCopiedButton(buttonId);
  };

  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={'outline'} id="contact">
        Contact
      </Badge>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {contactsData.map((contact) => (
          <div
            key={contact.id}
            className="inline-flex items-center gap-3 bg-card hover:bg-card/50 transition-colors py-2.5 px-3 rounded-md border border-border/80 hover:border-border border-dashed"
          >
            <span className="bg-slate-400/40 text-accent-foreground p-2 rounded-sm flex items-center justify-center shrink-0">
              <Icon
                icon={contact.icon}
                className={`w-4 h-4 ${contact.iconClass || ''}`}
              />
            </span>

            <div className="min-w-0 flex-1 gap-0.5 flex flex-col">
              <div className="text-md font-medium leading-none">{contact.label}</div>
              <div className="text-sm text-muted-foreground font-sans leading-none">{contact.description}</div>
            </div>

            <div className="flex flex-row gap-1 shrink-0">
              {contact.isCopyable && (
                <TooltipProvider delayDuration={50}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          handleCopy(contact.value || '', `${contact.id}Copy`)
                        }
                      >
                        {copiedButton === `${contact.id}Copy` ? (
                          <Icon
                            icon="lucide:check"
                            className="w-3.5 h-3.5 text-green-400"
                          />
                        ) : (
                          <Icon
                            icon="lucide:copy"
                            className="w-3.5 h-3.5 text-muted-foreground"
                          />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className='font-sans'>
                      <p>
                        {copiedButton === `${contact.id}Copy`
                          ? 'Copied!'
                          : `Copy ${contact.label.toLowerCase()}`}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <Link
                href={contact.href}
                target={contact.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-sm"
                >
                  <Icon
                    icon="lucide:arrow-up-right"
                    className="w-3.5 h-3.5 text-muted-foreground"
                  />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};
