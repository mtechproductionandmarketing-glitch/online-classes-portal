import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // First delete any email logs for this teacher (due to foreign key constraint)
    const { error: logsError } = await supabase
      .from('email_logs')
      .delete()
      .eq('teacher_id', params.id)

    if (logsError) {
      console.error('Error deleting email logs:', logsError.message)
    }

    // Then delete the teacher
    console.log(`[DELETE] Attempting to delete teacher ID: ${params.id}`)

    const { error, count } = await supabase
      .from('imported_teachers')
      .delete()
      .eq('id', params.id)

    console.log(`[DELETE] Result - Error: ${error?.message || 'none'}, Count: ${count}`)

    if (error) {
      console.error('Delete error:', error.message)
      return Response.json({ error: error.message, details: JSON.stringify(error) }, { status: 500 })
    }

    // count should tell us how many rows were deleted
    if (!count || count === 0) {
      console.warn(`[DELETE] No rows deleted for ID: ${params.id}`)
      return Response.json({
        success: false,
        message: 'Teacher not found or already deleted',
        requestedId: params.id
      }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: 'Teacher deleted successfully',
      deletedCount: count
    })
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return Response.json({ error: 'Failed to delete teacher', details: (error as any).message }, { status: 500 })
  }
}
