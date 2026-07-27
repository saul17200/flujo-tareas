import { RewardCelebration } from "@/features/rewards/components/reward-celebration"
import { useRewardEngine } from "@/features/rewards/hooks/use-reward-engine"

export function RewardListener() {
  const {
    activeReward,
    dismissReward,
  } = useRewardEngine()

  if (!activeReward) {
    return null
  }

  return (
    <RewardCelebration
      reward={activeReward}
      onClose={dismissReward}
    />
  )
}
