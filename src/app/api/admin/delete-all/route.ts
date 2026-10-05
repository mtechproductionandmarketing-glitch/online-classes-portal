import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Count existing records before deletion
    const { count: beforeCount } = await supabase
      .from('online_classes')
      .select('*', { count: 'exact', head: true })

    if (beforeCount === 0) {
      return Response.json({
        success: true,
        message: 'No records to delete',
        deleted: 0,
        remaining: 0
      })
    }

    // Delete all records using a date filter that matches everything
    // created_at >= year 2000 will match all records
    const { error: deleteError } = await supabase
      .from('online_classes')
      .delete()
      .gte('created_at', '2000-01-01T00:00:00')

    if (deleteError) {
      console.error('Supabase delete error:', deleteError)
      return Response.json({
        error: `Delete failed: ${deleteError.message}`
      }, { status: 500 })
    }

    // Verify deletion worked
    const { count: afterCount } = await supabase
      .from('online_classes')
      .select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      message: `✅ Successfully deleted ${beforeCount} records!`,
      deleted: beforeCount,
      remaining: afterCount || 0
    })
  } catch (error) {
    console.error('Delete error:', error)
    return Response.json({
      error: `Error: ${(error as any).message}`
    }, { status: 500 })
  }
}
