export type MissionMetric =
  | "task-created"
  | "task-completed"
  | "note-created"
  | "file-uploaded"
  | "course-passed"
  | "any-activity"

export interface MissionDefinition {
  id: string
  title: string
  description: string
  metric: MissionMetric
  goal: number
  xp: number
}

export interface DailyMission
  extends MissionDefinition {
  progress: number
  percentage: number
  completed: boolean
}

export interface DailyMissionProfile {
  dateKey: string
  completedCount: number
  totalCount: number
  earnedXp: number
  missions: DailyMission[]
}
