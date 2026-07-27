import {
  ArrowUp,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import type {
  Reward,
} from "@/features/rewards/types/reward"

interface RewardCelebrationProps {
  reward: Reward
  onClose: () => void
}

export function RewardCelebration({
  reward,
  onClose,
}: RewardCelebrationProps) {
  const levelUp =
    reward.kind === "level-up"

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/75 p-4 backdrop-blur-sm animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={
        levelUp
          ? "Subida de nivel"
          : "Logro desbloqueado"
      }
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-background p-8 text-center shadow-2xl animate-in zoom-in-95 duration-500">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-3 top-3"
          aria-label="Cerrar recompensa"
        >
          <X className="size-4" />
        </Button>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Sparkles className="absolute left-8 top-10 size-6 animate-pulse text-primary/50" />
          <Star className="absolute right-10 top-16 size-5 animate-pulse text-primary/40" />
          <Sparkles className="absolute bottom-14 right-8 size-7 animate-pulse text-primary/50" />
        </div>

        <div className="relative">
          <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            {levelUp ? (
              <ArrowUp className="size-12" />
            ) : (
              <Trophy className="size-12" />
            )}
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-primary">
            {levelUp
              ? "¡Subiste de nivel!"
              : "Logro desbloqueado"}
          </p>

          {reward.kind ===
          "achievement" ? (
            <>
              <h2 className="mt-3 text-3xl font-bold">
                {reward.title}
              </h2>

              <p className="mt-3 text-muted-foreground">
                {reward.description}
              </p>

              <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-3 font-bold text-primary">
                <Star className="size-5" />
                +{reward.xp} XP
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-4xl font-bold">
                Nivel {reward.level}
              </h2>

              <p className="mt-3 text-muted-foreground">
                Tu constancia académica sigue
                creciendo. ¡Continúa así!
              </p>
            </>
          )}

          <Button
            type="button"
            size="lg"
            onClick={onClose}
            className="mt-8 w-full"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  )
}
