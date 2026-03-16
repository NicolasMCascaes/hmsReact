import { Button } from "@mantine/core"
import { IconHeartbeat, IconHome2, IconLogin2, IconStethoscope } from "@tabler/icons-react"
import { Link } from "react-router-dom"

const quickLinks = [
  { label: "Painel do Paciente", to: "/patient/dashboard" },
  { label: "Painel do Médico", to: "/doctor/dashboard" },
  { label: "Painel do Admin", to: "/admin/dashboard" },
]

const NotFoundPage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 text-neutral-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(50,185,169,0.34),transparent_38%),radial-gradient(circle_at_86%_78%,rgba(31,173,159,0.3),transparent_35%),linear-gradient(145deg,#072c2b_0%,#0a3f3c_38%,#0f172a_100%)]" />
      <div className="absolute -left-30 top-24 h-72 w-72 rounded-full border border-white/15 bg-white/5 blur-sm" />
      <div className="absolute -right-24 bottom-16 h-80 w-80 rounded-full border border-white/15 bg-white/5 blur-sm" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-12 md:px-10">
        <section className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-[fadeIn_0.7s_ease-out]">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-300/30 bg-primary-950/40 px-4 py-2 text-sm text-primary-100">
              <IconStethoscope size={18} />
              HMS - Navegação
            </div>

            <h1 className="font-merriweather text-5xl leading-tight md:text-6xl">
              404
              <span className="mt-2 block text-3xl text-primary-200 md:text-4xl"> Página não encontrada</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base text-neutral-100/90 md:text-lg">
              Não encontramos a rota que você tentou acessar. Isso pode acontecer quando um link expira,
              quando a URL foi digitada incorretamente ou quando você ainda não tem permissão para a área.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                component={Link}
                to="/login"
                color="teal"
                size="md"
                leftSection={<IconLogin2 size={18} />}
              >
                Ir para login
              </Button>
              <Button
                component={Link}
                to="/login"
                variant="light"
                color="teal"
                size="md"
                leftSection={<IconHome2 size={18} />}
              >
                Voltar ao inicio
              </Button>
            </div>
          </div>

          <div className="animate-[fadeIn_0.9s_ease-out] rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md md:p-8">
            <div className="mb-5 flex items-center gap-2 text-primary-100">
              <IconHeartbeat size={20} />
              <h2 className="font-merriweather text-xl">Atalhos rápidos</h2>
            </div>

            <div className="space-y-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group block rounded-xl border border-white/15 bg-white/5 px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-300/60 hover:bg-primary-900/40"
                >
                  <div className="flex items-center justify-between text-sm md:text-base">
                    <span>{item.label}</span>
                    <span className="text-primary-200 transition-transform duration-300 group-hover:translate-x-1">Acessar</span>
                  </div>
                </Link>
              ))}
            </div>

            <p className="mt-6 text-sm text-neutral-200/85">
              Se o problema persistir, revise a URL e tente novamente pela navegação principal do sistema.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default NotFoundPage