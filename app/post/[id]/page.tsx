import React from "react";

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

async function getPost(id: string) {
  const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
    cache: "no-cache",
  });
  const data = await response.json();

  // console.log(data);
  return data;
}

export default async function PostDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const post: Post = await getPost(id);

  return (
    <div className="flex flex-col gap-4 py-6">
      <h1 className="font-bold text-xl">{post.title}</h1>
      <p>{post.content}</p>
      <small>{post.createdAt}</small>
    </div>
  );
}
