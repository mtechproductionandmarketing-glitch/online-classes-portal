import { createClient } from '@supabase/supabase-js'

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

    // Fetch only active (non-deleted) classes per SRS FR-09
    // Soft-deleted records excluded from all admin views
    const query = supabase
      .from('online_classes')
      .select('*', { count: 'exact' })
      .neq('is_deleted', true)
      .order('created_at', { ascending: false })
      .limit(100)

    const { data: classes, error, count } = await query

    console.log(`[Admin API] Query result: ${count} total records, error: ${error?.message || 'none'}`)

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
      debug: { totalRecords: count }
    })
  } catch (error) {
    console.error('[Admin API] Exception:', error)
    return Response.json(
      { error: 'Failed to fetch classes', details: (error as any).message },
      { status: 500 }
    )
  }
}
