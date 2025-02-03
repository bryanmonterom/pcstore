'use client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { paymentMethodSchema } from '@/lib/validators';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { PaymentMethod } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';

const PaymentMethodMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<PaymentMethod>({
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
    resolver: zodResolver(paymentMethodSchema),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (data: PaymentMethod) => {
    startTransition(async () => {
      const res = await updateUserPaymentMethod(data);

      if (res.success === false) {
        toast({
          title: 'Something went wrong',
          variant: 'destructive',
          description: res.message,
        });
        return;
      }
      router.push('/place-order');
    });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">
          Please select a payment method
        </p>
        <Form {...form}>
          <form
            method="post"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col"
                    >
                      {PAYMENT_METHODS.map((method) => (
                        <FormItem
                          key={method}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={method}
                              checked={field.value === method}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {method}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="h-4 w-4 animate-spin"></Loader>
                ) : (
                  <ArrowRight className="h4 w-4"></ArrowRight>
                )}{' '}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PaymentMethodMethodForm;
