import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET endpoint to check status
export async function GET() {
  try {
    const { count } = await supabase
      .from('online_classes')
      .select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      total_records: count || 0,
      status: count === 0 ? 'Database is clean' : `${count} records in database`
    })
  } catch (error) {
    console.error('GET error:', error)
    return Response.json({ error: 'Failed to check status' }, { status: 500 })
  }
}

// DELETE endpoint - works with DELETE method
export async function DELETE() {
  try {
    console.log('[Delete-All] Starting deletion...')

    // Count records before deletion
    const { count: beforeCount } = await supabase
      .from('online_classes')
      .select('*', { count: 'exact', head: true })

    console.log(`[Delete-All] Found ${beforeCount} records to delete`)

    if (beforeCount === 0) {
      return Response.json({
        success: true,
        message: 'Database already clean - 0 records',
        deleted: 0,
        remaining: 0
      })
    }

    // Delete all records
    const { error: deleteError, count: deletedCount } = await supabase
      .from('online_classes')
      .delete()
      .gte('created_at', '2000-01-01T00:00:00')

    if (deleteError) {
      console.error('[Delete-All] Error:', deleteError)
      return Response.json({
        success: false,
        error: deleteError.message
      }, { status: 500 })
    }

    console.log(`[Delete-All] Deleted ${deletedCount} records`)

    // Verify cleanup
    const { count: afterCount } = await supabase
      .from('online_classes')
      .select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      message: `✅ Deleted ${beforeCount} records. Database clean!`,
      deleted: beforeCount,
      remaining: afterCount || 0
    })
  } catch (error) {
    console.error('[Delete-All] Exception:', error)
    return Response.json({
      success: false,
      error: (error as any).message
    }, { status: 500 })
  }
}

// POST endpoint (also works with POST)
export async function POST() {
  return DELETE()
}
