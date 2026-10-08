import { createClient } from '@supabase/supabase-js'

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
    console.log('[Delete-All] Counting records...')
    const countResult = await supabase
      .from('online_classes')
      .select('*', { count: 'exact', head: true })

    if (countResult.error) {
      console.error('[Delete-All] Count error:', countResult.error)
      return Response.json({
        success: false,
        error: `Count failed: ${countResult.error.message}`
      }, { status: 500 })
    }

    const beforeCount = countResult.count || 0
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
    console.log('[Delete-All] Starting delete operation...')
    const deleteResult = await supabase
      .from('online_classes')
      .delete()
      .gte('created_at', '2000-01-01T00:00:00')

    if (deleteResult.error) {
      console.error('[Delete-All] Delete error:', deleteResult.error)
      return Response.json({
        success: false,
        error: `Delete failed: ${deleteResult.error.message}`
      }, { status: 500 })
    }

    console.log(`[Delete-All] Deleted records successfully`)

    // Verify cleanup
    console.log('[Delete-All] Verifying deletion...')
    const verifyResult = await supabase
      .from('online_classes')
      .select('*', { count: 'exact', head: true })

    const afterCount = verifyResult.count || 0
    console.log(`[Delete-All] After deletion: ${afterCount} records remain`)

    return Response.json({
      success: true,
      message: `✅ Deleted ${beforeCount} records. Database clean!`,
      deleted: beforeCount,
      remaining: afterCount
    })
  } catch (error) {
    console.error('[Delete-All] Exception:', error)
    return Response.json({
      success: false,
      error: `Exception: ${(error as any).message}`
    }, { status: 500 })
  }
}

// POST endpoint (also works with POST)
export async function POST() {
  return DELETE()
}
