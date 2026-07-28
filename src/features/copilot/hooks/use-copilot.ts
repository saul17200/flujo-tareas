import { useMemo } from "react"

import {
  useAchievements,
} from "@/features/achievements"
import {
  useAuth,
} from "@/features/auth/auth-provider"
import {
  buildCopilotSummary,
} from "@/features/copilot/utils/build-copilot-summary"
import {
  useLeague,
} from "@/features/leagues"
import {
  useDailyMissions,
} from "@/features/missions"
import {
  useSmartStreak,
} from "@/features/streaks"
import {
  useTaskStore,
} from "@/store/task-store"

export function useCopilot() {
  const { user } = useAuth()

  const tasks = useTaskStore(
    (state) => state.tasks,
  )

  const achievements =
    useAchievements()

  const league = useLeague()
  const missions = useDailyMissions()
  const streak = useSmartStreak(3)

  const summary = useMemo(
    () =>
      buildCopilotSummary({
        userName:
          user?.displayName ||
          user?.email?.split("@")[0] ||
          null,
        tasks,
        achievementProfile:
          achievements.profile,
        leagueProfile:
          league.profile,
        missionProfile:
          missions.profile,
        streakProfile:
          streak.streak,
      }),
    [
      achievements.profile,
      league.profile,
      missions.profile,
      streak.streak,
      tasks,
      user,
    ],
  )

  return {
    summary,
    loading:
      achievements.loading ||
      league.loading ||
      missions.loading ||
      streak.loading,
    error:
      achievements.error ||
      league.error ||
      missions.error ||
      streak.error,
  }
}
