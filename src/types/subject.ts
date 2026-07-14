export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"

export interface Subject {
  id: string
  name: string
  professor: string
  classroom: string
  period: string
  color: string
  days: Weekday[]
  startTime: string
  endTime: string
  createdAt: string
}

export interface CreateSubjectInput {
  name: string
  professor: string
  classroom: string
  period: string
  color: string
  days: Weekday[]
  startTime: string
  endTime: string
}
