import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type FilterRequest = {
  title: {
    contains: string;
    mode: "insensitive";
  };
  categoryId?: number;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("category");
  const sort = searchParams.get("sort") || "desc";

  const whereCondition: FilterRequest = categoryId
    ? {
        title: {
          contains: search,
          mode: "insensitive",
        },
        categoryId: Number(categoryId),
      }
    : {
        title: {
          contains: search,
          mode: "insensitive",
        },
      };

  const posts = await prisma.post.findMany({
    where: whereCondition,
    orderBy: {
      createdAt: sort,
    } as any,
    include: {
      category: true,
    },
  });

  return Response.json(posts);
}

export async function POST(req: Request, res: Response) {
  const { title, content, categoryId } = await req.json();
  const newPost = await prisma.post.create({
    data: {
      title,
      content,
      categoryId: Number(categoryId),
    },
  });

  return Response.json(newPost);
}
