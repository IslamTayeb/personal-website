"use client";
import React, { useState } from "react";
import { Section } from "./Misc/Section";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmail } from "./sendEmail";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopyToClipboard } from "usehooks-ts";

// Contact links data
const contactsData = [
  {
    id: "email",
    label: "Email",
    icon: "lucide:mail",
    value: "islam.tayeb@duke.edu",
    href: "mailto:islam.tayeb@duke.edu",
    isCopyable: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "mdi:linkedin",
    href: "https://www.linkedin.com/in/islam-tayeb/",
    isCopyable: false,
  },
  {
    id: "github",
    label: "GitHub",
    icon: "jam:github",
    href: "https://github.com/IslamTayeb",
    isCopyable: false,
  },
  {
    id: "twitter",
    label: "X",
    icon: "prime:twitter",
    href: "https://x.com/IslamTyb",
    isCopyable: false,
  },
  {
    id: "scholar",
    label: "Google Scholar",
    icon: "fa6-brands:google-scholar",
    href: "https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ",
    isCopyable: false,
  },
  {
    id: "resume",
    label: "Resume",
    icon: "solar:file-bold",
    href: "/resume",
    isCopyable: false,
    iconClass: "p-[0.5px]",
  },
];

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name is required" })
    .max(50, { message: "Your name must be 50 characters or fewer" }),
  email: z.string().email({ message: "Email must be valid" }),
  subject: z
    .string()
    .min(2, { message: "Subject is required" })
    .max(250, { message: "Subject must be 250 characters or fewer" }),
  text: z
    .string()
    .min(2, { message: "Message is required" })
    .max(2500, { message: "Message must be 2500 characters or fewer" }),
});

export const Contact = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [copiedButton, setCopiedButton] = useState("");

  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      text: "",
      subject: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSending(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("subject", values.subject);
      formData.append("text", values.text);

      const { data, error } = await sendEmail(formData);

      if (error) {
        toast({
          description: `An unexpected error occurred: ${error}`,
          variant: "destructive",
        });
      } else {
        toast({
          description: "Successfully sent! I'll get back to you soon.",
        });
      }
    } catch (error) {
      toast({
        description: `An unexpected error occurred: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  }

  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (value: string, buttonId: string) => {
    copy(value);
    setCopiedButton(buttonId);
  };

  return (
    <Section className="flex flex-col items-start gap-4">
      <Badge variant={"outline"} className="mb-2" id="contact">
        Contact
      </Badge>

      <div className="flex max-md:flex-col flex-row gap-4 max-md:gap-8 w-full">
        <div className="font-sans font-medium w-full flex-[3] gap-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-3"
            >
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="John Doe"
                          className="transition"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          required
                          placeholder="johndoe@example.com"
                          className="transition"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="Your subject must be 250 characters or fewer."
                        className="transition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        required
                        placeholder="Your message must be 2500 characters or fewer."
                        className="resize-none h-36 transition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full "
                  disabled={isSending}
                >
                  {isSending ? "Sending..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="flex flex-col h-min font-sans font-medium flex-[2] w-full gap-2">
          {contactsData.map((contact, index) => (
            <React.Fragment key={contact.id}>
              <div className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-1 px-1.5 rounded w-full">
                <span className="bg-accent text-accent-foreground p-2.5 rounded-sm">
                  <Icon icon={contact.icon} className={`w-4 h-4 ${contact.iconClass || ''}`} />
                </span>

                <div>
                  <div className="text-base font-medium">{contact.label}</div>
                </div>

                <div className="ml-auto flex flex-row gap-2">
                  {contact.isCopyable && (
                    <TooltipProvider delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleCopy(contact.value || '', `${contact.id}Copy`)}
                          >
                            {copiedButton === `${contact.id}Copy` ? (
                              <Icon icon="lucide:check" className="w-4 h-4 text-green-400" />
                            ) : (
                              <Icon icon="lucide:copy" className="w-4 h-4 text-muted-foreground p-[1.5px]" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{copiedButton === `${contact.id}Copy` ? "Copied!" : `Copy ${contact.label.toLowerCase()}`}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  <Link href={contact.href} target={contact.href.startsWith('mailto') ? undefined : "_blank"} rel="noopener noreferrer">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-sm"
                    >
                      <Icon
                        icon="lucide:arrow-up-right"
                        className="w-4 h-4 text-muted-foreground group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
              {index < contactsData.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Section>
  );
};
