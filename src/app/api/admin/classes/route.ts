import { createClient } from '@supabase/supabase-js'

// Next.js 14 caches fetch() calls made by supabase-js, which served stale records
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

export async function GET() {
  try {
    console.log('[Admin API] Fetching all classes...')

    // Filter soft-deleted rows in the query (not only in memory) and avoid
    // an arbitrary low limit that made older records appear "missing".
    const { data: classes, error, count: totalCount } = await supabase
      .from('online_classes')
      .select('*', { count: 'exact' })
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(5000)

    console.log(
      `[Admin API] Query result: ${classes?.length || 0} active records (${totalCount} matched), error: ${error?.message || 'none'}`
    )

    if (error) {
      console.error('[Admin API] Error details:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    const activeRecords = classes || []

    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const stats = {
      total: activeRecords.length,
      today: activeRecords.filter(c => c.class_date === today).length,
      week: activeRecords.filter(c => c.class_date >= weekAgo).length,
      month: activeRecords.filter(c => c.class_date >= monthAgo).length,
    }

    return Response.json({
      classes: activeRecords,
      stats,
      debug: { totalRecords: totalCount, filteredRecords: activeRecords.length },
    })
  } catch (error) {
    console.error('[Admin API] Exception:', error)
    return Response.json(
      { error: 'Failed to fetch classes', details: (error as Error).message },
      { status: 500 }
    )
  }
}
