"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/lib/actions/user.actions";
import { paths, USER_ROLES } from "@/lib/constants";
import { UpdateUserSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UpdateUserFormProps {
  user: z.infer<typeof UpdateUserSchema>;
}

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: user,
  });

  const onSubmit = async (values: z.infer<typeof UpdateUserSchema>) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      });

      if (!res.success) toast.error(res.message);

      toast.success(res.message);
      form.reset();
      router.push(paths.adminUsers());
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="POST"
        className="space-y-4"
      >
        {/* EMAIL */}
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof UpdateUserSchema>,
                "email"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user email" {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* NAME */}
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof UpdateUserSchema>,
                "name"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* ROLE */}
        <div>
          <FormField
            control={form.control}
            name="role"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof UpdateUserSchema>,
                "role"
              >;
            }) => (
              <FormItem className="w-full">
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="cursor-pointer w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        className="cursor-pointer"
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Update user"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserForm;
