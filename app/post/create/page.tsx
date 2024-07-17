"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";

// UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  title: z
    .string({
      required_error: "ກະລຸນາປ້ອນຫົວຂໍ້",
    })
    .min(2, {
      message: "ຫົວຂໍ້ຕ້ອງມີຢ່າງນ້ອຍ 2 ໂຕອັກສອນ",
    })
    .max(50, {
      message: "ຫົວຂໍ້ຕ້ອງບໍ່ເກີນ 50 ໂຕອັກສອນ",
    }),
  content: z
    .string({
      required_error: "ກະລຸນາປ້ອນເນື້ອຫາ",
    })
    .min(10, {
      message: "ເນື້ອຫາຕ້ອງມີຢ່າງນ້ອຍ 10 ໂຕອັກສອນ",
    })
    .max(1000, {
      message: "ເນື້ອຫາຕ້ອງບໍ່ເກີນ 1000 ໂຕອັກສອນ",
    }),
  categoryId: z.string({
    required_error: "ກະລຸນາເລືອກໝວດໝູ່",
  }),
});

type Category = {
  id: number;
  name: string;
};

export default function CreatePost() {
  const router = useRouter();
  const { toast } = useToast();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        console.log(response);

        if (response.status !== 200) return;

        setCategories(response.data);
      } catch (error) {
        // toast({
        //   title: "ມີບາງຢ່າງຜິດພາດ",
        //   description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        // });
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   title: "",
    //   content: "",
    //   category: "",
    // },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);

    try {
      const response = await axios.post("/api/posts", values);

      if (response.status === 200) {
        toast({
          title: "ສ້າງ Post ສຳເລັດ",
          // description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        });

        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "ມີບາງຢ່າງຜິດພາດ",
        description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
      });
    }
  }

  return (
    <div className="py-6">
      <Card className="max-w-[900px] mx-auto">
        <CardHeader>
          <CardTitle>ສ້າງ Post ຂໍ້ມູນ</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ຫົວຂໍ້ເລື່ອງ</FormLabel>
                    <FormControl>
                      <Input placeholder="ຫົວຂ້ໍເລື່ອງ..." {...field} />
                    </FormControl>
                    {/* <FormDescription>This is your public display name.</FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ເນື້ອຫາ</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ເນື້ອຫາ..." {...field} />
                    </FormControl>
                    {/* <FormDescription>
                      You can <span>@mention</span> other users and organizations.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ໝວດໝູ່</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ເລືອກໝວດໝູ່ຂອງເນື້ອຫາ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* <SelectItem value="Tech">Tech</SelectItem>
                        <SelectItem value="Life Style">Life Style</SelectItem> */}
                        {categories.map((category: Category) => (
                          <SelectItem key={category?.id} value={category?.id.toString()}>
                            {category?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormDescription>
                      You can manage email addresses in your <Link href="/examples/forms">email settings</Link>.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">ສ້າງ Post</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
