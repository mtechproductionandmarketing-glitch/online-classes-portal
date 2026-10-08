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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    console.log(`[Delete-Class] Deleting record: ${id}`)

    if (!id) {
      return Response.json({ error: 'Record ID is required' }, { status: 400 })
    }

    // Soft delete: mark as deleted instead of removing
    const { error } = await supabase
      .from('online_classes')
      .update({ is_deleted: true })
      .eq('id', id)

    if (error) {
      console.error('[Delete-Class] Error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.log(`[Delete-Class] Successfully deleted: ${id}`)
    return Response.json({
      success: true,
      message: 'Record deleted successfully'
    })
  } catch (error) {
    console.error('[Delete-Class] Exception:', error)
    return Response.json({
      error: `Exception: ${(error as any).message}`
    }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const { data, error } = await supabase
      .from('online_classes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 404 })
    }

    return Response.json({ data })
  } catch (error) {
    console.error('[Get-Class] Exception:', error)
    return Response.json({
      error: `Exception: ${(error as any).message}`
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    console.log(`[Update-Class] Updating record: ${id}`, body)

    const { error } = await supabase
      .from('online_classes')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('[Update-Class] Error:', error)
      return Response.json({ error: error.message }, { status: 500 })
    }

    console.log(`[Update-Class] Successfully updated: ${id}`)
    return Response.json({
      success: true,
      message: 'Record updated successfully'
    })
  } catch (error) {
    console.error('[Update-Class] Exception:', error)
    return Response.json({
      error: `Exception: ${(error as any).message}`
    }, { status: 500 })
  }
}
