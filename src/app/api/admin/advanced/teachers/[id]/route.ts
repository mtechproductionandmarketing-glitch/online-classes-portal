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
      // Don't fail - proceed with teacher deletion even if logs deletion fails
    }

    // Then delete the teacher
    const { data, error } = await supabase
      .from('imported_teachers')
      .delete()
      .eq('id', params.id)
      .select()

    if (error) {
      console.error('Delete error:', error.message)
      return Response.json({ error: error.message }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return Response.json({
        success: false,
        message: 'Teacher not found or already deleted'
      }, { status: 404 })
    }

    return Response.json({
      success: true,
      message: 'Teacher deleted successfully',
      deleted: data[0]
    })
  } catch (error) {
    console.error('Error deleting teacher:', error)
    return Response.json({ error: 'Failed to delete teacher', details: (error as any).message }, { status: 500 })
  }
}
