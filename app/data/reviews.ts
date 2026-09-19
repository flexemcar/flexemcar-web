export type ManualReview = {
  id: string;
  name: string;
  // Texto tal cual lo escribió el cliente en Google (con sus faltas incluidas).
  text: string;
  // Mes aproximado de la reseña (AAAA-MM). Google solo enseña "hace 8 meses",
  // así que se calcula a partir de la fecha en que se copiaron (2026-09) y la
  // etiqueta relativa se recalcula al mostrarla, para que no se quede vieja.
  date: string;
  // Foto de perfil real (en /public/reviews). Si no hay, se pinta la inicial
  // con el color de avatar que tenía en Google.
  photo?: string;
  avatarColor?: string;
};

// Reseñas reales de 5 estrellas de la ficha de Google de Flexemcar, copiadas
// a mano (2026-09-19). Para añadir más: pegar aquí otra entrada.
export const manualReviews: ManualReview[] = [
  {
    id: "julyane-debona",
    name: "Julyane Debona",
    text: "Excelente experiencia con Flexemcar\n\nGran variedad de furgonetas y un trato muy profesional. Los chicos fueron muy atentos y me ayudaron a elegir la mejor opción para mis necesidades.\n\nMuy contenta\nSúper recomendable! 🚐👏",
    date: "2026-08",
    photo: "/reviews/julyane.webp",
  },
  {
    id: "daniel-ramos",
    name: "Daniel Ramos",
    text: "Hemos comprado una furgo L3H2 con Mariano. Siempre atento en todo el proceso. Nos fue a buscar a la estación de Renfe de Alicante en su coche ya que somos de Madrid! Compramos con el, nos consiguió una parte a financiar. Muy contentos con la experiencia.",
    date: "2026-01",
    photo: "/reviews/daniel-ramos.webp",
  },
  {
    id: "manuel-riquelme",
    name: "Manuel Riquelme Garcia",
    text: "Les compré una furgo para camperizar hace un año y mi experiencia ha sido muy buena. No basarse en las reseñas e ir en persona a conocer al personal y los vehículos. Yo los recomiendo totalmente.",
    date: "2026-02",
    avatarColor: "#6c9c3c",
  },
  {
    id: "adolfo-villamandos",
    name: "Adolfo Villamandos",
    text: "Encantado no, lo siguiente..., muy muy satisfactoria la compra de una furgoneta en Flexemcar, un trato increíble desde el primer minuto que me puse en contacto con ellos, Miguel un profesional de bandera, estuvo pendiente en cada momento de mis necesidades y todo fueron facilidades...Soy de Madrid y me vino a buscar a la estación con un trato de 10...me ayudó en la compra mucho contratar a la empresa NEEDCARHELP, que me hicieron un peritaje completo y dando el visto bueno a la compra...Furgonetas cuidadas, con un mantenimiento perfecto y km ajustables a las necesidades!! 120% recomendable.",
    date: "2026-03",
    avatarColor: "#c41c5c",
  },
  {
    id: "daniel-vega",
    name: "Daniel Vega",
    text: "Compré una furgo hace 4 meses con ellos! Me dedico a la construcción y fue muy buena la atención por parte de Mariano! Aunque parece muy serio y formal, tiene una simpatía increíble! Espero seguir creciendo y en 2 meses comprar con ellos mi segunda furgo!!",
    date: "2026-01",
    photo: "/reviews/daniel-vega.webp",
  },
  {
    id: "gaia",
    name: "Gaia",
    text: "Fui a Flexemcar con mi marido. Necesitábamos una furgoneta. Qué puedo decir? Tienen furgonetas de varias marcas y modelos, todas de excelente calidad. Miguel nos recibió y nos ayudó a elegir la furgoneta. Fue muy amable. Recomiendo este lugar a cualquiera que necesite una furgoneta. Estamos muy contentos con nuestra nueva Volkswagen Crafter.",
    date: "2026-02",
    avatarColor: "#ec447c",
  },
  {
    id: "gustavo-lafratta",
    name: "Gustavo Ricardo Lafratta",
    text: "E comprado un furgoneta en flexmcar en un estado insuperable ,la atención de Miguel fue increíble cuentan con un equipo de gente tanto en las oficinas como en talleres ,a sido una experiencia muy buena\nAdemas me han ayudado con la venta de otra furgoneta q ya no me hacía falta y ellos se encargaron de todo\nSolo me queda agradecer la atención tan entrañable\nGracias",
    date: "2026-03",
    avatarColor: "#6c9c3c",
  },
  {
    id: "raquel-anton",
    name: "Raquel Anton Boix",
    text: "Estamos muy contentos con la compra de nuestra Fiat Ducato. Tuvimos opción de revisar y certificar kilometraje. En nuestro caso elección de 10. Yo os recomiendo visitarlos en persona.",
    date: "2026-02",
    avatarColor: "#346c1c",
  },
  {
    id: "manuel",
    name: "Manuel",
    text: "Atención profesional por parte de Miguel. Nos aconsejó, nos enseñó varios modelos y nos decidimos por una renault máster. Gracias por todo!!!",
    date: "2026-01",
    avatarColor: "#044c44",
  },
  {
    id: "maricarmen-galan",
    name: "Maricarmen Galan Bascon",
    text: "Estoy encantada con el trato recibido, en concreto de Miguel. Estaba buscando una furgoneta para camperizar y me ayudaron a encontrar justo lo que necesitaba. Estoy muy contenta con la compra!",
    date: "2026-03",
    avatarColor: "#ac44bc",
  },
  {
    id: "daniel-morillo",
    name: "Daniel Morillo",
    text: "Buenas compré una furgoneta, me hice 6 horas de viaje donde el trato de Miguel fue muy familiar y estoy muy contento con mi furgoneta sin duda si tuviera que comprar otra furgoneta volvería a confiar en esta empresa, Gracias por hacérmelo tan fácil todo.",
    date: "2026-01",
    avatarColor: "#04549c",
  },
  {
    id: "jose-sandoval",
    name: "Jose Sandoval",
    text: "Muy buena experiencia, compré una buena furgoneta y el trato fue fenomenal y todo muy rápido. Un sitio aconsejable 100%",
    date: "2026-01",
    avatarColor: "#0494a4",
  },
  {
    id: "pedro-baraza",
    name: "Pedro Ramon Baraza",
    text: "Este verano compré una furgoneta Opel Movano y estoy encantado con ella. Buen trato y muchas facilidades por parte de Antonio y Miguel, además de un producto de gran calidad. Totalmente recomendable",
    date: "2025-09",
    avatarColor: "#ec6c04",
  },
  {
    id: "daniel-duenas",
    name: "Daniel Dueñas",
    text: "Llevo mas de 6 meses con mi furgoneta y todo va muy bien. Siempre estan en contacto para culquier duda 💪👍",
    date: "2026-02",
    photo: "/reviews/daniel-duenas.webp",
  },
  {
    id: "consuelo-rovira",
    name: "Consuelo Rovira Simo",
    text: "Hacía tiempo que buscaba una furgoneta y vi un anuncio en su web.\nPedí por favor que me la reservaran porque si iba a verla y me gustaba me la quedaba.\nSe fiaron de mí y me la reservaron.\nObviamente acabé comprando un BELLEZÓN!\nLes doy un 10 en amabilidad, trato y eficiencia.\nAdemás me aconsejaron a la hora tanto del seguro como de la homologación para camperizarla.\nCHICOS SOIS LOS MEJORES! :)",
    date: "2025-09",
    avatarColor: "#04549c",
  },
];
