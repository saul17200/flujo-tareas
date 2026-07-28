import type {
  LeagueDefinition,
} from "@/features/leagues/types/league"

export const leagueDefinitions: LeagueDefinition[] = [
  {
    id: "bronze",
    name: "Bronce",
    minimumWeeklyXp: 0,
    description:
      "El inicio de tu camino académico.",
  },
  {
    id: "silver",
    name: "Plata",
    minimumWeeklyXp: 300,
    description:
      "Estás construyendo un ritmo constante.",
  },
  {
    id: "gold",
    name: "Oro",
    minimumWeeklyXp: 700,
    description:
      "Tu productividad empieza a destacar.",
  },
  {
    id: "platinum",
    name: "Platino",
    minimumWeeklyXp: 1500,
    description:
      "Mantienes una semana de alto rendimiento.",
  },
  {
    id: "diamond",
    name: "Diamante",
    minimumWeeklyXp: 2500,
    description:
      "Tu disciplina académica es excepcional.",
  },
  {
    id: "master",
    name: "Maestro",
    minimumWeeklyXp: 4000,
    description:
      "Dominas tus hábitos de productividad.",
  },
  {
    id: "legend",
    name: "Leyenda",
    minimumWeeklyXp: 6000,
    description:
      "Has alcanzado la liga más alta.",
  },
]
