import { format, formatDistanceToNow, isPast } from 'date-fns'
import { tr } from 'date-fns/locale'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'd MMM yyyy', { locale: tr })
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr })
}

export function isDueForReview(nextReviewAt: string): boolean {
  return isPast(new Date(nextReviewAt))
}
