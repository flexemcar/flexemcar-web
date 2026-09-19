import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { A, H2, P, UL } from "@/app/components/LegalLayout";
import { legal, metaLinks, orPending } from "@/app/lib/legal";

export const metadata: Metadata = {
  title: "Política de privacidad | Flexemcar",
  description:
    "Cómo trata Flexemcar tus datos personales, incluido el uso del píxel de Meta (Facebook e Instagram).",
};

const strong = "text-warm-50";

export default function PrivacyPage() {
  return (
    <LegalLayout title="Política de privacidad" updated={legal.updated}>
      <P>
        En Flexemcar nos tomamos en serio tu privacidad. Esta política explica
        qué datos personales tratamos, para qué, con qué base legal y qué
        derechos tienes, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley
        Orgánica 3/2018 (LOPDGDD).
      </P>

      <H2>1. Responsable del tratamiento</H2>
      <UL>
        <li>Nombre comercial: {legal.tradeName}</li>
        <li>Razón social: {orPending(legal.legalName, "razón social")}</li>
        <li>CIF: {orPending(legal.cif, "CIF")}</li>
        <li>Domicilio: {legal.address}</li>
        <li>
          Correo electrónico: <A href={`mailto:${legal.email}`}>{legal.email}</A>
        </li>
        <li>Teléfono: {legal.phone}</li>
      </UL>

      <H2>2. Qué datos tratamos y para qué</H2>
      <UL>
        <li>
          <strong className={strong}>Consultas y contacto.</strong> Si nos
          escribes por WhatsApp, teléfono o correo, o rellenas el formulario de
          tasación, tratamos los datos que nos facilites (nombre, teléfono,
          correo, tu mensaje y, si quieres vendernos o financiar un vehículo,
          los datos de ese vehículo: marca, modelo, año y kilómetros). La
          finalidad es atender tu consulta. Base legal: tu consentimiento y, si
          pides información previa a una compra o venta, la aplicación de
          medidas precontractuales a petición tuya.
        </li>
        <li>
          <strong className={strong}>Funcionamiento y seguridad de la web.</strong>{" "}
          Al navegar se tratan datos técnicos (dirección IP, navegador,
          dispositivo, páginas solicitadas) necesarios para servir la web y
          protegerla. Base legal: nuestro interés legítimo en que la web
          funcione y sea segura.
        </li>
        <li>
          <strong className={strong}>Publicidad y medición con Meta.</strong>{" "}
          Solo si aceptas las cookies de publicidad. Se explica en el apartado
          siguiente.
        </li>
      </UL>

      <H2>3. Píxel de Meta (Facebook e Instagram)</H2>
      <P>
        Esta web puede utilizar el píxel de Meta, una herramienta de Meta
        Platforms Ireland Limited (4 Grand Canal Square, Grand Canal Harbour,
        Dublín 2, Irlanda). Sirve para medir el resultado de nuestros anuncios
        en Facebook e Instagram, mostrarlos a personas que han visitado la web
        y crear audiencias parecidas.
      </P>
      <UL>
        <li>
          <strong className={strong}>Qué recoge:</strong> tu dirección IP,
          identificadores de cookies de Meta, datos del navegador y del
          dispositivo, las páginas que visitas y las acciones que haces en la
          web. Si tienes la sesión abierta en Facebook o Instagram, Meta puede
          asociar esta información a tu cuenta.
        </li>
        <li>
          <strong className={strong}>Base legal:</strong> tu consentimiento
          (art. 6.1.a RGPD y art. 22.2 de la Ley 34/2002, LSSI). El píxel no se
          carga hasta que pulsas «Aceptar» en el aviso de cookies.
        </li>
        <li>
          <strong className={strong}>Quién es responsable:</strong> Flexemcar y
          Meta Platforms Ireland Limited somos corresponsables del tratamiento
          de los datos que el píxel recoge y envía a Meta, según el{" "}
          <A href={metaLinks.controllerAddendum}>
            anexo de responsable del tratamiento de Meta
          </A>
          . Meta es responsable independiente del uso posterior que hace de
          esos datos para sus propios fines, descrito en su{" "}
          <A href={metaLinks.privacy}>política de privacidad</A>. Puedes
          consultar también las{" "}
          <A href={metaLinks.businessTools}>
            condiciones de las herramientas de Meta para empresas
          </A>
          .
        </li>
        <li>
          <strong className={strong}>Transferencias internacionales:</strong>{" "}
          Meta puede tratar datos fuera del Espacio Económico Europeo, en
          particular en Estados Unidos, con las garantías que declara aplicar
          (decisión de adecuación del Marco de Privacidad de Datos UE-EE. UU. o
          cláusulas contractuales tipo).
        </li>
        <li>
          <strong className={strong}>
            Cómo rechazarlo o retirar tu consentimiento:
          </strong>{" "}
          pulsa «Rechazar» en el aviso o, si ya elegiste, usa «Configurar
          cookies» en el pie de la web para cambiar tu decisión en cualquier
          momento. Rechazar no limita el uso de la web. Desde entonces no se
          recogen nuevos datos; lo ya recogido por Meta se rige por su
          política. También puedes gestionar los anuncios que ves en tus{" "}
          <A href={metaLinks.adPreferences}>preferencias de anuncios de Meta</A>.
        </li>
      </UL>
      <P>
        Más detalle sobre las cookies concretas en nuestra{" "}
        <Link
          href="/cookies"
          className="text-brand-orange underline underline-offset-2 hover:brightness-125"
        >
          política de cookies
        </Link>
        .
      </P>

      <H2>4. Destinatarios de tus datos</H2>
      <P>No vendemos tus datos. Pueden acceder a ellos, solo para lo necesario:</P>
      <UL>
        <li>
          Proveedores de alojamiento y tecnología de la web (Vercel y
          Supabase), que actúan como encargados del tratamiento.
        </li>
        <li>
          Resend, el proveedor que envía a Flexemcar por correo electrónico los
          datos del formulario de tasación, como encargado del tratamiento.
        </li>
        <li>
          Meta, en el caso del píxel (solo si lo aceptas) y de WhatsApp cuando
          nos escribes por esa aplicación, según sus propias condiciones.
        </li>
        <li>
          Google, si pulsas para cargar el mapa de la ubicación, según sus
          propias condiciones.
        </li>
        <li>
          Administraciones y organismos cuando una ley nos obligue a
          comunicarlos.
        </li>
      </UL>
      <P>
        Algunos de estos proveedores están en Estados Unidos. Las
        transferencias se apoyan en la decisión de adecuación del Marco de
        Privacidad de Datos UE-EE. UU. o en cláusulas contractuales tipo.
      </P>

      <H2>5. Cuánto tiempo conservamos los datos</H2>
      <UL>
        <li>
          Consultas: el tiempo necesario para atenderlas y, después, bloqueados
          durante los plazos legales de prescripción de posibles
          responsabilidades.
        </li>
        <li>
          Cookies de Meta: según la duración indicada en la política de
          cookies.
        </li>
        <li>Datos en poder de Meta: según su política de privacidad.</li>
      </UL>

      <H2>6. Tus derechos</H2>
      <P>
        Puedes ejercer los derechos de acceso, rectificación, supresión,
        oposición, limitación del tratamiento y portabilidad, y retirar tu
        consentimiento cuando lo hayas dado, escribiéndonos a{" "}
        <A href={`mailto:${legal.email}`}>{legal.email}</A> e indicando el
        derecho que quieres ejercer. Para atenderte podemos pedirte que
        acredites tu identidad.
      </P>
      <P>
        Si crees que tus datos no se tratan correctamente, puedes presentar una
        reclamación ante la Agencia Española de Protección de Datos (
        <A href="https://www.aepd.es">www.aepd.es</A>).
      </P>

      <H2>7. Cambios en esta política</H2>
      <P>
        Podemos actualizar esta política, por ejemplo si cambian las
        herramientas que usamos. La fecha de arriba indica la última revisión.
      </P>
    </LegalLayout>
  );
}
