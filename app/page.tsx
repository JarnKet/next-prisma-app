"use client";

// Core
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Third Party
import axios from "axios";

// Icons
import { Pencil, Trash } from "lucide-react";

// UI Lib
import AlertModal from "@/components/AlertModal";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SpinnerLoading from "@/components/SpinnerLoading";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Category = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  category: Category;
};

// async function getPosts() {
//   const res = await fetch("http://localhost:3000/api/posts", {
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch posts");
//   }

//   return res.json();
// }

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filter, setFilter] = useState({
    search: "",
    category: "",
    sort: "desc",
  });

  // Event Trigger
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get("/api/posts");
        // console.log(response);

        if (response.status !== 200) return;

        setPosts(response.data);
      } catch (error) {
        toast({
          title: "ມີບາງຢ່າງຜິດພາດ",
          description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        });
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

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

    fetchPosts();
    fetchCategories();
  }, [toast]); // Add toast to the dependency array

  // const posts = await getPosts();
  // console.log(posts, "posts");

  const fetchPosts = async () => {
    setIsLoading(true);

    try {
      if (filter.category === "ທັງໝົດ") {
        setFilter({ ...filter, category: "" });
      }
      const query = new URLSearchParams(filter).toString();
      const response = await axios.get(`/api/posts?${query}`);
      // console.log(response);

      if (response.status !== 200) return;

      setPosts(response.data);
    } catch (error) {
      toast({
        title: "ມີບາງຢ່າງຜິດພາດ",
        description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`/api/posts/${id.toString()}`);

      if (res.status === 200) {
        toast({
          title: "ລົບ Post ສຳເລັດ",
          // description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        });

        fetchPosts();
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "ມີບາງຢ່າງຜິດພາດ",
        description: "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
      });
    }
  };

  const handleFilterChange = async () => {
    fetchPosts();
  };

  return (
    <main className="py-6">
      <Card className="max-w-[900px] mx-auto">
        <CardHeader>
          <CardTitle>ລາຍການ Post</CardTitle>
          <CardDescription>CRUD in Next.js 14 + Prisma ORM</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <SpinnerLoading />
            </div>
          ) : posts?.length > 0 ? (
            <section className="flex flex-col w-full gap-6">
              <div className="flex items-center gap-4">
                <Input
                  type="text"
                  placeholder="ຄົ້ນຫາຕາມຫົວຂໍ້"
                  value={filter.search}
                  onChange={(e) => {
                    setFilter({ ...filter, search: e.target.value });
                  }}
                />
                <Select
                  value={filter.category}
                  onValueChange={(value) => {
                    setFilter({ ...filter, category: value });
                  }}
                >
                  <SelectTrigger className="max-w-[130px]">
                    <SelectValue placeholder="ເລືອກໝວດໝູ່" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="ທັງໝົດ">ທັງໝົດ</SelectItem> */}
                    {/* <SelectItem value="Tech">Tech</SelectItem>
                    <SelectItem value="Life Style">Life Style</SelectItem> */}
                    {categories.map((category: Category) => (
                      <SelectItem key={category?.id} value={category?.id.toString()}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filter.sort}
                  onValueChange={(value) => {
                    setFilter({ ...filter, sort: value });
                  }}
                >
                  <SelectTrigger className="w-[400px]">
                    <SelectValue placeholder="ເລືອກຮູບແບບການຈັດລຽງ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">ໃໝ່ລ່າສຸດ</SelectItem>
                    <SelectItem value="asc">ເກົ່າ</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-[150px]" onClick={() => handleFilterChange()}>
                  ຄົ້ນຫາ
                </Button>
              </div>
              <Table>
                <TableCaption>ລາຍການ Posts ທັງໝົດ</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ໄອດີ</TableHead>
                    <TableHead className="w-[100px]">ຫົວຂໍ້</TableHead>
                    <TableHead className="w-[100px]">ໝວດໝູ່</TableHead>
                    <TableHead>ເນື້ອຫາ</TableHead>
                    <TableHead className="text-right">ຈັດການ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.map((post: Post) => (
                    <TableRow key={post?.id} className="cursor-pointer ">
                      <TableCell onClick={() => router.push(`/post/${post.id}`)}>{post?.id}</TableCell>
                      <TableCell className="w-[200px]" onClick={() => router.push(`/post/${post.id}`)}>
                        {post?.title}
                      </TableCell>
                      <TableCell onClick={() => router.push(`/post/${post.id}`)}>{post?.category?.name || "-"}</TableCell>
                      <TableCell onClick={() => router.push(`/post/${post.id}`)}>{post?.content}</TableCell>
                      <TableCell className="flex items-center justify-end gap-4">
                        <Link href={`/post/edit/${post.id}`}>
                          <Pencil />
                        </Link>
                        <AlertModal
                          triggerChildren={<Trash />}
                          title="ຢືນຢັນການລຶບ Post"
                          desc="ທ່ານຕ້ອງການລຶບ Post ນີ້ແທ້ບໍ?"
                          cancelText="ຍົກເລີກ"
                          confirmText="ຢືນຢັນການລົບ"
                          confirmAction={() => handleDelete(post.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>
          ) : (
            <div className="flex items-center justify-center">
              <p>ຍັງບໍ່ມີຂໍ້ມູນ Post</p>
            </div>
          )}
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
    </main>
  );
}
