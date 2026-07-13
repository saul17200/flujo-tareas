import {
  useEffect,
  useState,
  type FormEvent,
} from "react"
import {
  ArrowLeft,
  BadgeCheck,
  KeyRound,
  Mail,
  Save,
  UserRound,
} from "lucide-react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/features/auth/auth-provider"
import {
  sendUserPasswordReset,
  sendUserVerification,
  updateUserDisplayName,
} from "@/services/profile"

export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState("")
  const [saving, setSaving] = useState(false)
  const [sendingVerification, setSendingVerification] =
    useState(false)
  const [sendingPasswordReset, setSendingPasswordReset] =
    useState(false)

  useEffect(() => {
    setDisplayName(user?.displayName ?? "")
  }, [user])

  if (!user) {
    return null
  }

  const currentUser = user

  async function handleProfileSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const cleanName = displayName.trim()

    if (cleanName.length < 2) {
      toast.error(
        "El nombre debe tener al menos 2 caracteres.",
      )
      return
    }

    try {
      setSaving(true)

      await updateUserDisplayName(currentUser, cleanName)

      setDisplayName(cleanName)

      toast.success("Perfil actualizado correctamente.")
    } catch (error) {
      console.error(error)
      toast.error("No fue posible actualizar el perfil.")
    } finally {
      setSaving(false)
    }
  }

  async function handleVerification() {
    if (currentUser.emailVerified) {
      toast.info("Tu correo ya está verificado.")
      return
    }

    try {
      setSendingVerification(true)

      await sendUserVerification(currentUser)

      toast.success("Correo de verificación enviado.", {
        description:
          "Revisa también la carpeta de correo no deseado.",
      })
    } catch (error) {
      console.error(error)
      toast.error(
        "No fue posible enviar el correo de verificación.",
      )
    } finally {
      setSendingVerification(false)
    }
  }

  async function handlePasswordReset() {
    if (!currentUser.email) {
      toast.error(
        "La cuenta no tiene un correo electrónico asociado.",
      )
      return
    }

    try {
      setSendingPasswordReset(true)

      await sendUserPasswordReset(currentUser.email)

      toast.success(
        "Correo para cambiar contraseña enviado.",
        {
          description: currentUser.email,
        },
      )
    } catch (error) {
      console.error(error)
      toast.error(
        "No fue posible enviar el correo de recuperación.",
      )
    } finally {
      setSendingPasswordReset(false)
    }
  }

  const initials = (
    displayName ||
    user.email ||
    "U"
  )
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="size-4" />
            Volver al dashboard
          </Button>

          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 py-8 sm:px-6">
        <section>
          <p className="text-sm font-medium text-primary">
            Configuración de cuenta
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Mi perfil
          </h1>

          <p className="mt-2 text-muted-foreground">
            Administra tu información y la seguridad de tu
            cuenta.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card className="h-fit">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {initials}
              </div>

              <h2 className="mt-4 text-xl font-semibold">
                {displayName || "Usuario de FlujoTareas"}
              </h2>

              <p className="mt-1 max-w-full truncate text-sm text-muted-foreground">
                {user.email}
              </p>

              <div
                className={
                  user.emailVerified
                    ? "mt-4 flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-600 dark:text-emerald-400"
                    : "mt-4 flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1.5 text-sm text-amber-600 dark:text-amber-400"
                }
              >
                <BadgeCheck className="size-4" />

                {user.emailVerified
                  ? "Correo verificado"
                  : "Correo sin verificar"}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserRound className="size-5" />
                  </div>

                  <div>
                    <CardTitle>Información personal</CardTitle>

                    <CardDescription>
                      El nombre aparecerá dentro de tu cuenta.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <form
                  onSubmit={handleProfileSubmit}
                  className="grid gap-5"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="display-name">
                      Nombre visible
                    </Label>

                    <Input
                      id="display-name"
                      value={displayName}
                      onChange={(event) =>
                        setDisplayName(event.target.value)
                      }
                      placeholder="Escribe tu nombre"
                      maxLength={60}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="profile-email">
                      Correo electrónico
                    </Label>

                    <Input
                      id="profile-email"
                      value={user.email ?? ""}
                      disabled
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-fit"
                  >
                    <Save className="size-4" />

                    {saving
                      ? "Guardando..."
                      : "Guardar cambios"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="size-5" />
                  </div>

                  <div>
                    <CardTitle>Verificación de correo</CardTitle>

                    <CardDescription>
                      Verifica que el correo te pertenece.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerification}
                  disabled={
                    sendingVerification ||
                    user.emailVerified
                  }
                >
                  <BadgeCheck className="size-4" />

                  {user.emailVerified
                    ? "Correo verificado"
                    : sendingVerification
                      ? "Enviando..."
                      : "Enviar verificación"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <KeyRound className="size-5" />
                  </div>

                  <div>
                    <CardTitle>Contraseña</CardTitle>

                    <CardDescription>
                      Recibirás un enlace seguro para establecer
                      una contraseña nueva.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePasswordReset}
                  disabled={sendingPasswordReset}
                >
                  <KeyRound className="size-4" />

                  {sendingPasswordReset
                    ? "Enviando..."
                    : "Cambiar contraseña"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
