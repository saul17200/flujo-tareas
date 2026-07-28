export interface StreakDay {
  dateKey: string
  label: string
  activity: number
  goal: number
  completed: boolean
  today: boolean
}

export interface StreakProfile {
  dailyGoal: number
  todayActivity: number
  todayPercentage: number
  todayCompleted: boolean
  currentStreak: number
  longestStreak: number
  completedDays: number
  lastSevenDays: StreakDay[]
}
