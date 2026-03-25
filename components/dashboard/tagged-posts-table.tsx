"use client"

import { format, parseISO } from "date-fns"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TaggedPost {
  account_name: string
  caption: string
  media_url: string
  permalink: string
  posted_at: string
  likes: number
  comments: number
}

interface TaggedPostsTableProps {
  posts: TaggedPost[]
}

export function TaggedPostsTable({ posts }: TaggedPostsTableProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 mb-4">タグ付き投稿</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100">
              <TableHead className="pl-4 text-gray-500">サムネイル</TableHead>
              <TableHead className="text-gray-500">アカウント</TableHead>
              <TableHead className="text-gray-500">投稿内容</TableHead>
              <TableHead className="text-right text-gray-500">いいね</TableHead>
              <TableHead className="text-right text-gray-500">コメント</TableHead>
              <TableHead className="text-right pr-4 text-gray-500">日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, i) => (
              <TableRow key={`${post.permalink}-${i}`} className="border-gray-100">
                <TableCell className="pl-4">
                  {post.media_url ? (
                    <img src={post.media_url} alt="" className="size-12 rounded-lg object-cover" />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">N/A</div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-gray-900">{post.account_name}</TableCell>
                <TableCell className="max-w-[240px]">
                  <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-900">
                    <p className="truncate text-sm">{post.caption ? (post.caption.length > 30 ? post.caption.slice(0, 30) + "..." : post.caption) : "-"}</p>
                  </a>
                </TableCell>
                <TableCell className="text-right tabular-nums text-gray-900">{post.likes.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums text-gray-900">{post.comments.toLocaleString()}</TableCell>
                <TableCell className="pr-4 text-right text-sm text-gray-500">{format(parseISO(post.posted_at), "yyyy/MM/dd HH:mm")}</TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">タグ付き投稿がありません</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
