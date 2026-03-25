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
      <h3 className="text-base font-semibold text-white mb-4">タグ付き投稿</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead className="pl-4 text-slate-400">サムネイル</TableHead>
              <TableHead className="text-slate-400">アカウント</TableHead>
              <TableHead className="text-slate-400">投稿内容</TableHead>
              <TableHead className="text-right text-slate-400">いいね</TableHead>
              <TableHead className="text-right text-slate-400">コメント</TableHead>
              <TableHead className="text-right pr-4 text-slate-400">日時</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post, i) => (
              <TableRow key={`${post.permalink}-${i}`} className="border-white/10">
                <TableCell className="pl-4">
                  {post.media_url ? (
                    <img src={post.media_url} alt="" className="size-12 rounded-lg object-cover" />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-lg bg-slate-700 text-xs text-slate-400">N/A</div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-white">{post.account_name}</TableCell>
                <TableCell className="max-w-[240px]">
                  <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="hover:underline text-white">
                    <p className="truncate text-sm">{post.caption ? (post.caption.length > 30 ? post.caption.slice(0, 30) + "..." : post.caption) : "-"}</p>
                  </a>
                </TableCell>
                <TableCell className="text-right tabular-nums text-slate-200">{post.likes.toLocaleString()}</TableCell>
                <TableCell className="text-right tabular-nums text-slate-200">{post.comments.toLocaleString()}</TableCell>
                <TableCell className="pr-4 text-right text-sm text-slate-400">{format(parseISO(post.posted_at), "yyyy/MM/dd HH:mm")}</TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-400">タグ付き投稿がありません</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
