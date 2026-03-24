"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Client {
  client_id: string;
  name: string;
  instagram_account_id: string;
  meta_ad_account_id: string;
  share_token: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      if (res.ok) {
        const data = await res.json();
        setClient(data);
      }
    } catch (err) {
      console.error("クライアント取得エラー:", err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const copyShareLink = () => {
    if (!client) return;
    const url = `${window.location.origin}/dashboard/${client.share_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">読み込み中...</div>;
  }

  if (!client) {
    return (
      <div className="text-center py-12 text-gray-500">
        クライアントが見つかりません
      </div>
    );
  }

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard/${client.share_token}`;

  return (
    <div>
      <Link
        href="/admin"
        className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-block"
      >
        &larr; クライアント一覧に戻る
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Instagram ID:</span>{" "}
                <span className="font-mono">{client.instagram_account_id}</span>
              </p>
              <p>
                <span className="font-medium">広告アカウント ID:</span>{" "}
                <span className="font-mono">{client.meta_ad_account_id}</span>
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            ID: {client.client_id}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium whitespace-nowrap">
            共有リンク:
          </Label>
          <Input
            readOnly
            value={shareUrl}
            className="font-mono text-sm flex-1"
          />
          <Button variant="outline" size="sm" onClick={copyShareLink}>
            {copied ? "コピー済み" : "コピー"}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          データソース
        </h3>
        <p className="text-sm text-gray-600">
          データはGAS（Google Apps Script）経由でBigQueryに自動取込されます。
          手動インポートは不要です。
        </p>
        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p>・instagram_analytics.raw_account_insights（日次インサイト）</p>
          <p>・instagram_analytics.raw_post_insights（投稿インサイト）</p>
          <p>・instagram_analytics.raw_tagged_posts（タグ付け投稿）</p>
          <p>・meta_ads.raw_ad_insights（Meta広告データ）</p>
        </div>
      </div>
    </div>
  );
}
