import { supabase } from './supabase'

export interface OnlineClass {
  id: string
  reference_id: string
  class_date: string
  faculty_name: string
  course_title: string
  batch: string
  semester: string
  program: string
  section: string
  start_time: string
  duration_minutes: number
  teams_link: string
  remarks: string | null
  possible_duplicate: boolean
  created_at: string
  updated_at: string
  updated_by: string | null
  is_deleted: boolean
  deleted_at: string | null
  deleted_by: string | null
}

export interface PaginatedResult<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface FilterOptions {
  dateFrom?: string
  dateTo?: string
  faculty?: string
  course?: string
  program?: string
  batch?: string
  semester?: string
  section?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Fetch classes with pagination and filtering
 */
export async function getClasses(
  page: number = 1,
  pageSize: number = 25,
  filters: FilterOptions = {}
): Promise<PaginatedResult<OnlineClass>> {
  try {
    let query = supabase
      .from('active_online_classes')
      .select('*', { count: 'exact' })

    // Apply filters
    if (filters.dateFrom) {
      query = query.gte('class_date', filters.dateFrom)
    }
    if (filters.dateTo) {
      query = query.lte('class_date', filters.dateTo)
    }
    if (filters.faculty) {
      query = query.ilike('faculty_name', `%${filters.faculty}%`)
    }
    if (filters.course) {
      query = query.ilike('course_title', `%${filters.course}%`)
    }
    if (filters.program) {
      query = query.eq('program', filters.program)
    }
    if (filters.batch) {
      query = query.eq('batch', filters.batch)
    }
    if (filters.semester) {
      query = query.eq('semester', filters.semester)
    }
    if (filters.section) {
      query = query.eq('section', filters.section)
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'created_at'
    const sortOrder = filters.sortOrder || 'desc'
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, count, error } = await query

    if (error) throw error

    const totalPages = count ? Math.ceil(count / pageSize) : 0

    return {
      data: (data || []) as OnlineClass[],
      count: count || 0,
      page,
      pageSize,
      totalPages,
    }
  } catch (error) {
    console.error('Error fetching classes:', error)
    throw error
  }
}

/**
 * Get single class by ID
 */
export async function getClassById(id: string): Promise<OnlineClass | null> {
  try {
    const { data, error } = await supabase
      .from('active_online_classes')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return null
    }

    return data as OnlineClass
  } catch (error) {
    console.error('Error fetching class:', error)
    return null
  }
}

/**
 * Update a class record
 */
export async function updateClass(
  id: string,
  updates: Partial<OnlineClass>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('online_classes')
      .update(updates)
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: 'Update failed. Please try again.',
    }
  }
}

/**
 * Soft delete a class (set is_deleted = true)
 */
export async function deleteClass(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('online_classes')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('is_deleted', false)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: 'Delete failed. Please try again.',
    }
  }
}

/**
 * Restore a deleted class
 */
export async function restoreClass(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('online_classes')
      .update({
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
      })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: 'Restore failed. Please try again.',
    }
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  try {
    // Get total classes
    const { count: totalClasses } = await supabase
      .from('active_online_classes')
      .select('*', { count: 'exact', head: true })

    // Get classes today (Pakistan time)
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const { count: classesToday } = await supabase
      .from('active_online_classes')
      .select('*', { count: 'exact', head: true })
      .eq('class_date', todayStr)

    // Get classes this week
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const weekAgoStr = weekAgo.toISOString().split('T')[0]
    const { count: classesWeek } = await supabase
      .from('active_online_classes')
      .select('*', { count: 'exact', head: true })
      .gte('class_date', weekAgoStr)

    // Get classes this month
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const monthAgoStr = monthAgo.toISOString().split('T')[0]
    const { count: classesMonth } = await supabase
      .from('active_online_classes')
      .select('*', { count: 'exact', head: true })
      .gte('class_date', monthAgoStr)

    // Get distinct counts
    const { data: distinct } = await supabase
      .from('active_online_classes')
      .select('faculty_name, program, batch, semester, section')

    const uniqueFaculty = new Set(distinct?.map(d => d.faculty_name) || [])
    const uniquePrograms = new Set(distinct?.map(d => d.program) || [])
    const uniqueBatches = new Set(distinct?.map(d => d.batch) || [])
    const uniqueSemesters = new Set(distinct?.map(d => d.semester).filter(Boolean) || [])
    const uniqueSections = new Set(distinct?.map(d => d.section) || [])

    return {
      totalClasses: totalClasses || 0,
      classesToday: classesToday || 0,
      classesWeek: classesWeek || 0,
      classesMonth: classesMonth || 0,
      totalFaculty: uniqueFaculty.size,
      totalPrograms: uniquePrograms.size,
      totalBatches: uniqueBatches.size,
      totalSemesters: uniqueSemesters.size,
      totalSections: uniqueSections.size,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw error
  }
}

/**
 * Get audit logs
 */
export async function getAuditLogs(limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }
}

/**
 * Export classes to array format (for Excel)
 */
export async function exportClassesForExcel(
  filters: FilterOptions = {}
): Promise<OnlineClass[]> {
  try {
    const allClasses: OnlineClass[] = []
    let page = 1
    const pageSize = 1000

    while (true) {
      const result = await getClasses(page, pageSize, filters)
      allClasses.push(...result.data)

      if (result.page >= result.totalPages) {
        break
      }

      page++
    }

    return allClasses
  } catch (error) {
    console.error('Error exporting classes:', error)
    throw error
  }
}

/**
 * Perform data cleanup (replace variant spellings)
 */
export async function performDataCleanup(
  column: string,
  oldValue: string,
  newValue: string
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const { error, data } = await supabase
      .from('online_classes')
      .update({
        [column]: newValue,
        updated_at: new Date().toISOString(),
      })
      .eq(column, oldValue)
      .eq('is_deleted', false)
      .select('id')

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      count: data?.length || 0,
    }
  } catch (error) {
    return {
      success: false,
      error: 'Cleanup failed. Please try again.',
    }
  }
}
