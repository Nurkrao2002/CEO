"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/auth-context";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Input as ShadcnInput } from "@/components/ui/input"

const membershipDataEntrySchema = z.object({
  period: z.string().min(1, "Period is required. e.g., 2025-08"),
  totalMembers: z.coerce.number().min(0),
  newMembers: z.coerce.number().min(0),
  membersLost: z.coerce.number().min(0),
  retentionRate: z.coerce.number().min(0).max(100),
  churnRate: z.coerce.number().min(0).max(100),
  csat: z.coerce.number().min(0).max(100),
  nps: z.coerce.number(),
});

type MembershipDataEntryFormValues = z.infer<typeof membershipDataEntrySchema>;

const defaultValues: Partial<MembershipDataEntryFormValues> = {
  period: "",
  totalMembers: "" as any,
  newMembers: "" as any,
  membersLost: "" as any,
  retentionRate: "" as any,
  churnRate: "" as any,
  csat: "" as any,
  nps: "" as any,
};

export function MembershipDataEntryForm() {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const form = useForm<MembershipDataEntryFormValues>({
    resolver: zodResolver(membershipDataEntrySchema),
    defaultValues,
  });

  const onSubmit = async (data: MembershipDataEntryFormValues) => {
    if (!userProfile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save data.",
      });
      return;
    }

    try {
      await addDoc(collection(db, "membership_metrics"), {
        ...data,
        companyId: userProfile.companyId,
      });
      toast({
        title: "Data Saved",
        description: "Membership metrics have been successfully saved.",
      });
      form.reset(defaultValues);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save membership metrics.",
      });
    }
  };

    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value;
    if (value === '' || value === '-') {
      field.onChange(value);
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        field.onChange(num);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Record Membership Metrics</CardTitle>
            <CardDescription>
                Fill out the form below to add membership data for a specific period.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period (YYYY-MM)</FormLabel>
                  <FormControl>
                    <ShadcnInput placeholder="e.g., 2025-08" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField control={form.control} name="totalMembers" render={({ field }) => ( <FormItem> <FormLabel>Total Members</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="newMembers" render={({ field }) => ( <FormItem> <FormLabel>New Members</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="membersLost" render={({ field }) => ( <FormItem> <FormLabel>Members Lost</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="retentionRate" render={({ field }) => ( <FormItem> <FormLabel>Retention Rate (%)</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="churnRate" render={({ field }) => ( <FormItem> <FormLabel>Churn Rate (%)</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="csat" render={({ field }) => ( <FormItem> <FormLabel>CSAT (%)</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="nps" render={({ field }) => ( <FormItem> <FormLabel>NPS</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" size="lg">
                <Save className="mr-2 h-4 w-4" />
                Save Membership Data
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
