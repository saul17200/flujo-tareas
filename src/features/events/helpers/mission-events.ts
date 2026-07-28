import {
  emitUserEvent,
} from "@/features/events/utils/emit-user-event"

interface DailyMissionCompletedContext {
  userId: string
  missionId: string
  title: string
  xp: number
  dateKey: string
}

export function emitDailyMissionCompletedEvent({
  userId,
  missionId,
  title,
  xp,
  dateKey,
}: DailyMissionCompletedContext) {
  emitUserEvent({
    userId,
    type: "daily-mission-completed",
    title: `Completaste la misión: ${title}`,
    description: `Recompensa diaria: +${xp} XP`,
    metadata: {
      missionId,
      xp,
      dateKey,
    },
  })
}
