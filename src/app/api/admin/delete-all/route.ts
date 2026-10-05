import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    // Delete ALL records
    const { error: deleteError } = await supabase
      .from('online_classes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 })
    }

    // Verify deletion
    const { count } = await supabase
      .from('online_classes')
      .select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      message: 'All data deleted successfully',
      remaining: count
    })
  } catch (error) {
    console.error('Delete error:', error)
    return Response.json({ error: 'Delete failed' }, { status: 500 })
  }
}
