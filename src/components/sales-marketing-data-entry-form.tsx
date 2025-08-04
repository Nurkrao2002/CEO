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

const salesMarketingDataEntrySchema = z.object({
  period: z.string().min(1, "Period is required. e.g., 2025-08"),
  leadGeneration: z.coerce.number().min(0),
  conversionRate: z.coerce.number().min(0).max(100),
  salesPipelineValue: z.coerce.number().min(0),
  avgRevenuePerClient: z.coerce.number().min(0),
  marketingRoi: z.coerce.number(),
  costPerLead: z.coerce.number().min(0),
});

type SalesMarketingDataEntryFormValues = z.infer<typeof salesMarketingDataEntrySchema>;

const defaultValues: Partial<SalesMarketingDataEntryFormValues> = {
  period: "",
  leadGeneration: "" as any,
  conversionRate: "" as any,
  salesPipelineValue: "" as any,
  avgRevenuePerClient: "" as any,
  marketingRoi: "" as any,
  costPerLead: "" as any,
};

export function SalesMarketingDataEntryForm() {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const form = useForm<SalesMarketingDataEntryFormValues>({
    resolver: zodResolver(salesMarketingDataEntrySchema),
    defaultValues,
  });

  const onSubmit = async (data: SalesMarketingDataEntryFormValues) => {
    if (!userProfile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save data.",
      });
      return;
    }

    try {
      await addDoc(collection(db, "sales_marketing_metrics"), {
        ...data,
        companyId: userProfile.companyId,
      });
      toast({
        title: "Data Saved",
        description: "Sales & marketing metrics have been successfully saved.",
      });
      form.reset(defaultValues);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save sales & marketing metrics.",
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
            <CardTitle className="font-headline text-2xl">Record Sales & Marketing Metrics</CardTitle>
            <CardDescription>
                Fill out the form below to add sales & marketing data for a specific period.
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
              <FormField control={form.control} name="leadGeneration" render={({ field }) => ( <FormItem> <FormLabel>Lead Generation</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="conversionRate" render={({ field }) => ( <FormItem> <FormLabel>Conversion Rate (%)</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="salesPipelineValue" render={({ field }) => ( <FormItem> <FormLabel>Sales Pipeline Value ($)</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="avgRevenuePerClient" render={({ field }) => ( <FormItem> <FormLabel>Avg. Revenue per Client ($)</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="marketingRoi" render={({ field }) => ( <FormItem> <FormLabel>Marketing ROI (x)</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="costPerLead" render={({ field }) => ( <FormItem> <FormLabel>Cost Per Lead (CPL) ($)</FormLabel> <FormControl> <Input type="text" inputMode="decimal" {...field} onChange={e => handleNumericChange(e, field)} value={field.value ?? ''} /> </FormControl> <FormMessage /> </FormItem> )} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" size="lg">
                <Save className="mr-2 h-4 w-4" />
                Save Sales & Marketing Data
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
