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
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
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

  const email = "islam.tayeb@duke.edu";
  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (buttonId: React.SetStateAction<string>) => {
    copy(email);
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
          <div className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-1 px-1.5 rounded w-full">
            <span className="bg-accent text-accent-foreground p-2.5 rounded-sm">
              <Mail size={16} />
            </span>

            <div>
              <div className="text-base font-medium">Email</div>
            </div>

            <div className="ml-auto flex flex-row gap-2">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy("emailCopy")}
                    >
                      {copiedButton === "emailCopy" ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} className="text-muted-foreground p-[1.5px]" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copiedButton === "emailCopy" ? "Copied!" : "Copy email"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Link href={"mailto:islam.tayeb@duke.edu"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm"
                >
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all"
                  />
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          <div className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-1 p-1.5 rounded w-full">
            <span className="bg-accent text-accent-foreground p-2.5 rounded-sm">
              <Icon icon="mdi:linkedin" className="w-4 h-4" />
            </span>

            <div>
              <div className="text-base font-medium">LinkedIn</div>
            </div>

            <div className="ml-auto flex flex-row gap-2">

              <Link href="https://www.linkedin.com/in/islam-tayeb/" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm"
                >
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all"
                  />
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          <div className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-1 p-1.5 rounded w-full">
            <span className="bg-accent text-accent-foreground p-2.5 rounded-sm">
              <Icon icon="jam:github" className="w-4 h-4" />
            </span>

            <div>
              <div className="text-base font-medium">GitHub</div>
            </div>

            <div className="ml-auto flex flex-row gap-2">

              <Link href="https://github.com/IslamTayeb" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm"
                >
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all"
                  />
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          <div className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-1 p-1.5 rounded w-full">
            <span className="bg-accent text-accent-foreground p-2.5 rounded-sm">
              <Icon icon="prime:twitter" className="w-4 h-4" />
            </span>

            <div>
              <div className="text-base font-medium">X (Twitter)</div>
            </div>

            <div className="ml-auto flex flex-row gap-2">

              <Link href="https://x.com/IslamTyb" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm"
                >
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all"
                  />
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          <div className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-1 p-1.5 rounded w-full">
            <span className="bg-accent text-accent-foreground p-2.5 rounded-sm">
              <Icon icon="fa6-brands:google-scholar" className="w-4 h-4" />
            </span>

            <div>
              <div className="text-base font-medium">Google Scholar</div>
            </div>

            <div className="ml-auto flex flex-row gap-2">

              <Link href="https://scholar.google.com/citations?hl=en&user=2ZrlBUcAAAAJ" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm"
                >
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all"
                  />
                </Button>
              </Link>
            </div>
          </div>

          <Separator />

          <div className="inline-flex items-center gap-4 hover:bg-accent/25 transition-colors py-1 p-1.5 rounded w-full">
            <span className="bg-accent text-accent-foreground p-2.5 rounded-sm">
              <Icon icon="solar:file-bold" className="w-4 h-4 p-[0.5px]" />
            </span>

            <div>
              <div className="text-base font-medium">Resume</div>
            </div>

            <div className="ml-auto flex flex-row gap-2">

              <Link href="/Islam_Tayeb_Resume.pdf" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-sm"
                >
                  <ArrowUpRight
                    size={16}
                    className="text-muted-foreground group-hover:-translate-x-2 group-hover:-translate-y-2 transition-all"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
