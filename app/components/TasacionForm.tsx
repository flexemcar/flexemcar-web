"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { CtaChevron, CtaShine, ctaButtonClass } from "@/app/components/ctaButton";
import { links } from "@/app/lib/links";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "mt-1 w-full rounded-lg border border-warm-200 bg-warm-50 px-3 py-2.5 text-[15px] text-dark-900 outline-none transition placeholder:text-dark-900/35 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/25";

function Field({
  label,
  required = true,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm font-semibold text-dark-900/80 ${className}`}>
      {label}
      {required ? <span className="text-brand-orange"> *</span> : null}
      {children}
    </label>
  );
}

// Botón "Pide tu tasación gratis" que despliega un formulario y envía la
// solicitud por correo a la empresa (ruta /api/tasacion).
export default function TasacionForm({ buttonText }: { buttonText: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) {
      // Cuando termina de desplegarse, deja el formulario a la vista.
      window.setTimeout(
        () => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        400,
      );
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/tasacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) {
        throw new Error(json.error || "No hemos podido enviar tu solicitud.");
      }
      form.reset();
      setStatus("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No hemos podido enviar tu solicitud.",
      );
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={ctaButtonClass}
      >
        <CtaShine />
        <span className="relative">{buttonText}</span>
        <CtaChevron open={open} />
      </button>

      {/* Se despliega animando la altura; cerrado, sus campos no reciben foco. */}
      <div
        id={panelId}
        ref={panelRef}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-8">
            <div className="mx-auto max-w-2xl rounded-2xl bg-white p-5 text-left text-dark-900 shadow-[0_20px_50px_rgba(0,0,0,0.25)] sm:p-8">
              {status === "success" ? (
                <div className="py-6 text-center" role="status">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg
                      viewBox="0 0 24 24"
                      className="size-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-heading uppercase font-extrabold text-2xl">
                    ¡Solicitud enviada!
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-dark-900/70">
                    Hemos recibido los datos de tu furgoneta. Te contactaremos lo
                    antes posible con la tasación.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-semibold text-brand-orange underline underline-offset-2"
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <h3 className="font-heading uppercase font-extrabold text-2xl">
                      Cuéntanos sobre tu furgoneta
                    </h3>
                    <p className="mt-1 text-sm text-dark-900/60">
                      Tasación gratis y sin compromiso. Los campos con * son
                      obligatorios.
                    </p>
                  </div>

                  <Field label="Nombre">
                    <input
                      name="name"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Teléfono">
                    <input
                      name="phone"
                      type="tel"
                      required
                      maxLength={30}
                      autoComplete="tel"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Correo electrónico" className="sm:col-span-2">
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={150}
                      autoComplete="email"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Marca y modelo" className="sm:col-span-2">
                    <input
                      name="vehicle"
                      type="text"
                      required
                      maxLength={120}
                      placeholder="Ej.: Renault Master L2H2"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Año">
                    <input
                      name="year"
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={4}
                      pattern="[0-9]{4}"
                      title="Año con cuatro cifras, por ejemplo 2019"
                      placeholder="2019"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Kilómetros">
                    <input
                      name="km"
                      type="text"
                      inputMode="numeric"
                      required
                      maxLength={12}
                      placeholder="120000"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Comentarios" required={false} className="sm:col-span-2">
                    <textarea
                      name="comments"
                      rows={3}
                      maxLength={1500}
                      placeholder="Estado, extras, cuándo quieres venderla…"
                      className={`${inputClass} resize-y`}
                    />
                  </Field>

                  {/* Campo trampa contra bots: las personas no lo ven. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      No rellenar
                      <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-dark-900/70 sm:col-span-2">
                    <input
                      name="consent"
                      type="checkbox"
                      required
                      className="mt-0.5 size-4 shrink-0 accent-brand-orange"
                    />
                    <span>
                      He leído y acepto la{" "}
                      <Link
                        href="/privacidad"
                        target="_blank"
                        className="font-semibold text-brand-orange underline underline-offset-2"
                      >
                        política de privacidad
                      </Link>
                      . Usaremos tus datos solo para contactarte sobre la
                      tasación.
                    </span>
                  </label>

                  {status === "error" && error && (
                    <p
                      role="alert"
                      className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2"
                    >
                      {error}{" "}
                      {links.whatsapp && (
                        <a
                          href={`https://wa.me/${links.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline"
                        >
                          Escríbenos por WhatsApp
                        </a>
                      )}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="rounded-full bg-brand-orange px-6 py-3 font-bold text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-60 sm:col-span-2"
                  >
                    {status === "sending" ? "Enviando…" : "Enviar solicitud"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
