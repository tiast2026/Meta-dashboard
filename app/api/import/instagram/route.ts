import { NextRequest, NextResponse } from 'next/server';
import { db, ensureDb } from '@/lib/db';
import Papa from 'papaparse';
import type { InStatement } from '@libsql/client';

const HEADER_MAP: Record<string, string> = {
  '日付': 'date',
  '閲覧数': 'impressions',
  'リーチ': 'reach',
  'アクションを実行し': 'actions',
  'インタラクション数': 'interactions',
  'コメント数': 'comments',
  'いいね数': 'likes',
  '保存数': 'saves',
  'シェア数': 'shares',
  'フォロワー数': 'followers',
  'フォロー数': 'follows',
  '投稿数': 'posts_count',
};

function mapHeaders(row: Record<string, string>): Record<string, string> {
  const mapped: Record<string, string> = {};
  for (const [csvKey, value] of Object.entries(row)) {
    for (const [jpKey, engKey] of Object.entries(HEADER_MAP)) {
      if (csvKey.startsWith(jpKey)) {
        mapped[engKey] = value;
        break;
      }
    }
  }
  return mapped;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('client_id') as string;

    if (!file || !clientId) {
      return NextResponse.json({ error: 'ファイルとクライアントIDが必要です' }, { status: 400 });
    }

    const csvText = await file.text();
    const { data, errors } = Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (errors.length > 0) {
      return NextResponse.json({ error: `CSVの解析に失敗しました: ${errors[0].message}` }, { status: 400 });
    }

    if (data.length === 0) {
      return NextResponse.json({ error: 'CSVにデータ行がありません。ヘッダー行の下にデータを入力してください。' }, { status: 400 });
    }

    await ensureDb();

    const statements: InStatement[] = [];
    let skippedRows = 0;
    for (const row of data) {
      const mapped = mapHeaders(row);
      if (!mapped.date) { skippedRows++; continue; }
      statements.push({
        sql: `INSERT OR REPLACE INTO instagram_daily_insights
          (client_id, date, impressions, reach, actions, interactions, comments, likes, saves, shares, followers, follows, posts_count)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          clientId, mapped.date,
          Number(mapped.impressions) || 0, Number(mapped.reach) || 0,
          Number(mapped.actions) || 0, Number(mapped.interactions) || 0,
          Number(mapped.comments) || 0, Number(mapped.likes) || 0,
          Number(mapped.saves) || 0, Number(mapped.shares) || 0,
          Number(mapped.followers) || 0, Number(mapped.follows) || 0,
          Number(mapped.posts_count) || 0,
        ],
      });
    }

    if (statements.length === 0) {
      return NextResponse.json({ error: `インポート可能な行がありません。${skippedRows > 0 ? `${skippedRows}行は「日付」列が空のためスキップされました。` : 'CSVのヘッダーが正しいか確認してください。'}` }, { status: 400 });
    }

    for (let i = 0; i < statements.length; i += 100) {
      await db.batch(statements.slice(i, i + 100), 'write');
    }

    return NextResponse.json({ success: true, message: `${statements.length}件のデータをインポートしました${skippedRows > 0 ? `（${skippedRows}行スキップ）` : ''}`, rowCount: statements.length });
  } catch (err) {
    console.error('Instagram daily import error:', err);
    return NextResponse.json({ error: `インポート中にエラーが発生しました: ${err instanceof Error ? err.message : String(err)}` }, { status: 500 });
  }
}
