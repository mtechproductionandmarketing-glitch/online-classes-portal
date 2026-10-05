'use client'

import { useEffect, useState } from 'react'
import { getClasses, getDashboardStats, OnlineClass, FilterOptions, PaginatedResult } from '@/lib/database'

export interface UseCl assesResult {
  classes: OnlineClass[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  setFilters: (filters: FilterOptions) => void
  refresh: () => Promise<void>
}

export interface UseDashboardStatsResult {
  stats: {
    totalClasses: number
    classesToday: number
    classesWeek: number
    classesMonth: number
    totalFaculty: number
    totalPrograms: number
    totalBatches: number
    totalSections: number
  } | null
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/**
 * Custom hook for fetching classes with pagination and filtering
 */
export function useClasses(initialFilters: FilterOptions = {}): UseCl assesResult {
  const [classes, setClasses] = useState<OnlineClass[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [filters, setFilters] = useState<FilterOptions>(initialFilters)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchClasses = async () => {
    try {
      setLoading(true)
      setError(null)

      const result: PaginatedResult<OnlineClass> = await getClasses(page, pageSize, filters)

      setClasses(result.data)
      setTotal(result.count)
      setTotalPages(result.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes')
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [page, pageSize, filters])

  return {
    classes,
    loading,
    error,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
    setPage,
    setPageSize,
    setFilters,
    refresh: fetchClasses,
  }
}

/**
 * Custom hook for fetching dashboard statistics
 */
export function useDashboardStats(): UseDashboardStatsResult {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await getDashboardStats()
      setStats(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics')
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  }
}
