import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const basicColorMap: { [key: string]: string } = {
  Red: '#EF4444',
  Orange: '#F97316',
  Yellow: '#EAB308',
  Green: '#22C55E',
  Teal: '#14B8A6',
  Blue: '#3B82F6',
  Purple: '#8B5CF6',
  Pink: '#EC4899',
  Brown: '#78350F',
  Black: '#000000',
  Gray: '#6B7280',
  White: '#FFFFFF',
};
