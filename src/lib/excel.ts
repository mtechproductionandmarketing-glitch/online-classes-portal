import { OnlineClass } from './database'

/**
 * Format timestamp to dd-mm-yyyy format
 */
export function formatDateForExcel(dateStr: string): string {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

/**
 * Format time to 12-hour format
 */
export function formatTimeForExcel(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':')
  const h = parseInt(hours, 10)
  const m = parseInt(minutes, 10)

  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayHours = h % 12 === 0 ? 12 : h % 12
  const displayMinutes = String(m).padStart(2, '0')

  return `${displayHours}:${displayMinutes} ${ampm}`
}

/**
 * Generate Excel export data structure
 */
export function generateExcelData(classes: OnlineClass[]) {
  // Sheet 1: Records
  const recordsData = classes.map(c => ({
    'Reference ID': c.reference_id,
    'Date': formatDateForExcel(c.class_date),
    'Faculty': c.faculty_name,
    'Course': c.course_title,
    'Program': c.program,
    'Batch': c.batch,
    'Semester': c.semester || '',
    'Section': c.section,
    'Start Time': formatTimeForExcel(c.start_time),
    'Duration (min)': c.duration_minutes,
    'Meeting Link': c.teams_link,
    'Remarks': c.remarks || '',
    'Submitted At': new Date(c.created_at).toLocaleString(),
  }))

  // Sheet 2: Summary statistics
  const summary = {
    'Report Generated': new Date().toLocaleString(),
    'Total Records': classes.length,
    'Date Range': `${formatDateForExcel(classes[classes.length - 1]?.class_date || new Date().toISOString())} to ${formatDateForExcel(classes[0]?.class_date || new Date().toISOString())}`,
  }

  // Group by program
  const byProgram: Record<string, number> = {}
  classes.forEach(c => {
    byProgram[c.program] = (byProgram[c.program] || 0) + 1
  })

  // Group by faculty
  const byFaculty: Record<string, number> = {}
  classes.forEach(c => {
    byFaculty[c.faculty_name] = (byFaculty[c.faculty_name] || 0) + 1
  })

  // Group by batch
  const byBatch: Record<string, number> = {}
  classes.forEach(c => {
    byBatch[c.batch] = (byBatch[c.batch] || 0) + 1
  })

  // Group by semester
  const bySemester: Record<string, number> = {}
  classes.forEach(c => {
    const key = c.semester || 'Not specified'
    bySemester[key] = (bySemester[key] || 0) + 1
  })

  // Group by section
  const bySection: Record<string, number> = {}
  classes.forEach(c => {
    bySection[c.section] = (bySection[c.section] || 0) + 1
  })

  return {
    recordsData,
    summary,
    byProgram,
    byFaculty,
    byBatch,
    bySemester,
    bySection,
  }
}

/**
 * Generate Excel file (client-side using ExcelJS)
 * Returns blob for download
 */
export async function generateExcelBlob(classes: OnlineClass[]): Promise<Blob> {
  // Dynamic import ExcelJS
  const ExcelJS = await import('exceljs').then(m => m.default)

  const data = generateExcelData(classes)
  const workbook = new ExcelJS.Workbook()

  // Sheet 1: Records
  const recordsSheet = workbook.addWorksheet('Records')
  recordsSheet.columns = [
    { header: 'Reference ID', key: 'Reference ID', width: 15 },
    { header: 'Date', key: 'Date', width: 12 },
    { header: 'Faculty', key: 'Faculty', width: 20 },
    { header: 'Course', key: 'Course', width: 25 },
    { header: 'Program', key: 'Program', width: 12 },
    { header: 'Batch', key: 'Batch', width: 12 },
    { header: 'Semester', key: 'Semester', width: 14 },
    { header: 'Section', key: 'Section', width: 15 },
    { header: 'Start Time', key: 'Start Time', width: 12 },
    { header: 'Duration (min)', key: 'Duration (min)', width: 14 },
    { header: 'Meeting Link', key: 'Meeting Link', width: 30 },
    { header: 'Remarks', key: 'Remarks', width: 25 },
    { header: 'Submitted At', key: 'Submitted At', width: 20 },
  ]

  // Style headers
  recordsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
  recordsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2C5AA0' } }
  recordsSheet.getRow(1).alignment = { horizontal: 'center', vertical: 'center' }

  // Add data
  data.recordsData.forEach(row => {
    recordsSheet.addRow(row)
  })

  // Add filter buttons to headers
  recordsSheet.autoFilter.from = 'A1'
  recordsSheet.autoFilter.to = `M${data.recordsData.length + 1}`

  // Freeze header row
  recordsSheet.views = [{ state: 'frozen', ySplit: 1 }]

  // Sheet 2: Summary
  const summarySheet = workbook.addWorksheet('Summary')
  
  // Add report info
  summarySheet.addRow(['ONLINE CLASSES EXPORT REPORT'])
  summarySheet.addRow([])
  summarySheet.addRow(['Report Generated:', data.summary['Report Generated']])
  summarySheet.addRow(['Total Records:', data.summary['Total Records']])
  summarySheet.addRow(['Date Range:', data.summary['Date Range']])
  summarySheet.addRow([])

  // Totals by program
  summarySheet.addRow(['TOTALS BY PROGRAM'])
  Object.entries(data.byProgram).forEach(([program, count]) => {
    summarySheet.addRow([program, count])
  })

  summarySheet.addRow([])

  // Totals by faculty
  summarySheet.addRow(['TOTALS BY FACULTY'])
  Object.entries(data.byFaculty).forEach(([faculty, count]) => {
    summarySheet.addRow([faculty, count])
  })

  summarySheet.addRow([])

  // Totals by batch
  summarySheet.addRow(['TOTALS BY BATCH'])
  Object.entries(data.byBatch).forEach(([batch, count]) => {
    summarySheet.addRow([batch, count])
  })

  summarySheet.addRow([])

  // Totals by semester
  summarySheet.addRow(['TOTALS BY SEMESTER'])
  Object.entries(data.bySemester).forEach(([semester, count]) => {
    summarySheet.addRow([semester, count])
  })

  summarySheet.addRow([])

  // Totals by section
  summarySheet.addRow(['TOTALS BY SECTION'])
  Object.entries(data.bySection).forEach(([section, count]) => {
    summarySheet.addRow([section, count])
  })

  // Style summary sheet
  summarySheet.getColumn('A').width = 25
  summarySheet.getColumn('B').width = 15

  // Get buffer and convert to blob
  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * Trigger download of Excel file
 */
export async function downloadExcelFile(
  classes: OnlineClass[],
  filename: string = `OnlineClasses_${new Date().toISOString().split('T')[0]}.xlsx`
) {
  try {
    const blob = await generateExcelBlob(classes)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading Excel file:', error)
    throw error
  }
}
