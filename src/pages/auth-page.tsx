import { useState, type FormEvent } from "react"
import { CheckCircle2, Eye, EyeOff } from "lucide-react"
import { Navigate } from "react-router"
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
import { login, register } from "@/services/auth"
import { sendUserPasswordReset } from "@/services/profile"

type AuthMode = "login" | "register"

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    switch (String(error.code)) {
      case "auth/email-already-in-use":
        return "Este correo ya está registrado."
      case "auth/invalid-email":
        return "El correo no es válido."
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres."
      case "auth/invalid-credential":
        return "El correo o la contraseña son incorrectos."
      case "auth/too-many-requests":
        return "Demasiados intentos. Intenta más tarde."
      default:
        return "No fue posible completar la operación."
    }
  }

  return "Ocurrió un error inesperado."
}

export function AuthPage() {
  const { user, loading } = useAuth()

  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] =
    useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail || !password) {
      toast.error("Completa todos los campos.")
      return
    }

    if (password.length < 6) {
      toast.error(
        "La contraseña debe tener al menos 6 caracteres.",
      )
      return
    }

    if (
      mode === "register" &&
      password !== confirmPassword
    ) {
      toast.error("Las contraseñas no coinciden.")
      return
    }

    try {
      setSubmitting(true)

      if (mode === "register") {
        await register(cleanEmail, password)
        toast.success("Cuenta creada correctamente.")
      } else {
        await login(cleanEmail, password)
        toast.success("Sesión iniciada.")
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }


  async function handleForgotPassword() {
    const cleanEmail = email.trim().toLowerCase()

    if (!cleanEmail) {
      toast.error(
        "Escribe tu correo electrónico primero.",
      )
      return
    }

    try {
      await sendUserPasswordReset(cleanEmail)

      toast.success(
        "Correo de recuperación enviado.",
        {
          description: cleanEmail,
        },
      )
    } catch (error) {
      console.error(error)

      toast.error(
        "No fue posible enviar el correo de recuperación.",
      )
    }
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode)
    setPassword("")
    setConfirmPassword("")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="flex justify-end p-4 sm:p-6">
        <ModeToggle />
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center px-4 pb-16">
        <div className="w-full">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <CheckCircle2 className="size-7" />
            </div>

            <h1 className="text-3xl font-bold">
              Drif Notion
            </h1>

            <p className="mt-2 text-muted-foreground">
              Organiza tus tareas desde cualquier dispositivo.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {mode === "login"
                  ? "Iniciar sesión"
                  : "Crear una cuenta"}
              </CardTitle>

              <CardDescription>
                {mode === "login"
                  ? "Ingresa con tu correo y contraseña."
                  : "Regístrate para sincronizar tus tareas."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="grid gap-5"
              >
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Correo electrónico
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="nombre@correo.com"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">
                    Contraseña
                  </Label>

                  <div className="relative">
                    <Input
                      id="password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      autoComplete={
                        mode === "login"
                          ? "current-password"
                          : "new-password"
                      }
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      className="pr-11"
                      required
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {mode === "register" && (
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">
                      Confirmar contraseña
                    </Label>

                    <Input
                      id="confirm-password"
                      type={
                        showPassword ? "text" : "password"
                      }
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value,
                        )
                      }
                      required
                    />
                  </div>
                )}


                {mode === "login" && (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleForgotPassword}
                    className="h-auto justify-start p-0"
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full"
                >
                  {submitting
                    ? "Procesando..."
                    : mode === "login"
                      ? "Iniciar sesión"
                      : "Crear cuenta"}
                </Button>

                <Button
                  type="button"
                  variant="link"
                  onClick={() =>
                    changeMode(
                      mode === "login"
                        ? "register"
                        : "login",
                    )
                  }
                >
                  {mode === "login"
                    ? "¿No tienes cuenta? Regístrate"
                    : "¿Ya tienes cuenta? Inicia sesión"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
