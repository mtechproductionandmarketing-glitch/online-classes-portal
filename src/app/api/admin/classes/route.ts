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

export async function GET(request: Request) {
  try {
    console.log('[Admin API] Fetching all classes...')

    // Fetch all records and filter deleted records in backend per SRS FR-09
    const query = supabase
      .from('online_classes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(100)

    const { data: allClasses, error, count: totalCount } = await query

    // Filter out soft-deleted records in backend
    const classes = (allClasses || []).filter(c => !c.is_deleted)

    console.log(`[Admin API] Query result: ${classes.length} active records (${totalCount} total in DB), error: ${error?.message || 'none'}`)

    if (error) {
      console.error('[Admin API] Error details:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    // Calculate statistics (only for active records, per SRS FR-09)
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    // Double-check: filter out any deleted records (safety check)
    const activeRecords = classes?.filter(c => !c.is_deleted) || []

    const stats = {
      total: activeRecords.length,
      today: activeRecords.filter(c => c.class_date === today).length,
      week: activeRecords.filter(c => c.class_date >= weekAgo).length,
      month: activeRecords.filter(c => c.class_date >= monthAgo).length
    }

    console.log('[Admin API] Stats:', stats)

    return Response.json({
      classes: classes || [],
      stats,
      debug: { totalRecords: totalCount, filteredRecords: classes.length }
    })
  } catch (error) {
    console.error('[Admin API] Exception:', error)
    return Response.json(
      { error: 'Failed to fetch classes', details: (error as any).message },
      { status: 500 }
    )
  }
}
