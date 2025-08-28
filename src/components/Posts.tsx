"use client";
import { getPosts } from "@/api/test";
import { useQuery } from "@tanstack/react-query";

export default function Posts() {
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data?.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
}
