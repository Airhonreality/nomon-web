// Datos estáticos del Simposio Internacional de Ética
// Contenido real migrado literal de InteractiveDeck.jsx (repo viejo). No placeholder.
// Decisión: contenido cerrado como datos estáticos del repo (sin editor en vivo).

export interface SlideNode {
	role: string;
	desc: string;
}

export interface SlideBadge {
	name: string;
	role: string;
	image: string;
}

export interface Slide {
	id: string;
	title: string;
	subtitle?: string;
	content?: string;
	readMoreTitle?: string;
	readMoreContent?: string;
	bullets?: string[];
	nodes?: SlideNode[];
	badges?: SlideBadge[];
	gallery?: string[];
	accent: string;
}

export const slides: Slide[] = [
	{
		id: "cover",
		title: "SIMPOSIO INTERNACIONAL DE ÉTICA",
		subtitle:
			"Protocolos de Integridad para la Supervivencia multi especie y la Sustentabilidad Sistémica.",
		accent: "#f37024",
	},
	{
		id: "marco-teorico",
		title: "Marco Teórico",
		content:
			"La ética orienta la acción humana hacia la confianza, convivencia y sostenibilidad de la vida individual y colectiva.",
		readMoreTitle: "Marco Teórico Completo",
		readMoreContent:
			"La ética, entendida en sentido práctico, no se limita a normas o prohibiciones, sino que orienta la acción humana hacia la confianza, la convivencia y la sostenibilidad de la vida individual y colectiva. Por eso Desde esta perspectiva la Ética ayuda a preservar el buen funcionamiento de los sistemas sociales e institucionales. Cuando se debilita aparecen problemas como la corrupción, el abuso de poder, la mentira, el incumplimiento y la pérdida de legitimidad.\n\nEn este simposio, los protocolos vivos de integridad se entienden como herramientas dinámicas de prevención, orientación y corrección, capaces de adaptarse a distintos contextos. Lejos de ser documentos estáticos, se trata de instrumentos prácticos que fortalecerán la toma de decisiones éticas en la cultura, velando por su aplicación en todas las dinámicas sociales, la academia, las empresas, el gobierno, la sociedad civil y el ecosistema multi-especie.",
		accent: "#e63946",
	},
	{
		id: "justification",
		title: "Justificación",
		content:
			"Frente a la crisis sistémica actual, este simposio busca articular sectores para sostener la vida, fortalecer confianza y responsabilidad.",
		readMoreTitle: "Justificación Completa",
		readMoreContent:
			"Frente a la urgencia de nuestra crisis sistémica actual, este simposio busca articular a los principales sectores del país en torno a un propósito común: sostener la vida, fortalecer la confianza, la responsabilidad, los derechos humanos y la sustentabilidad social. En este escenario, la ética se presenta como una herramienta práctica de supervivencia que va más allá de la reflexión teórica, promoviendo acuerdos útiles y orientados a la acción.\n\nLa viabilidad de cualquier institución depende hoy de su coherencia ética y de su capacidad para operar con profunda responsabilidad frente a su entorno. Por ello, el simposio se proyecta hacia resultados tangibles: la consolidación de un marco compartido de integridad aplicada, capaz de traducirse en protocolos sectoriales concretos. Con esto, aspiramos a forjar una cultura institucional más transparente, coherente y verdaderamente comprometida con la transformación social.",
		accent: "#ffcc00",
	},
	{
		id: "objective",
		title: "Objetivo General",
		content:
			"Integrar a los actores de la quíntuple hélice para co-crear protocolos y tecnologías éticas aplicables que permitan anticipar el cambio social.",
		readMoreTitle: "Objetivo General Completo",
		readMoreContent:
			"Integrar a los actores de la quíntuple hélice —academia, industria, gobierno, sociedad civil y medio ambiente — para desarrollar, mediante diálogo, co-creación y metodologías prospectivas, protocolos y tecnologías éticas aplicables que permitan anticipar el cambio social, orientar escenarios de futuro viables y aumentar el bienestar multiespecie desde una perspectiva de Buen Vivir y argumentación pragma-dialéctica.",
		accent: "#009fe3",
	},
	{
		id: "sector-empresarial",
		title: "Sector Empresarial",
		subtitle: "Objetivos Específicos",
		content:
			"Establecer blindaje ético y alinear la productividad con el bienestar social y la resocialización.",
		bullets: [
			"**Blindaje Ético:** Diseñar protocolos de gobernanza corporativa que prevengan riesgos de corrupción con comunidades y el Estado, transformando la licencia social en alianza de confianza.",
			"**Productividad con Propósito:** Aplicar la ética como tecnología de gestión para demostrar que la integridad es el activo más rentable en territorios complejos.",
			"**Gestión de Talento y Reintegro:** Estructurar modelos de vinculación laboral y desarrollo humano que incorporen población en proceso de reintegración.",
		],
		accent: "#00b4d8",
	},
	{
		id: "sector-publico",
		title: "Sector Público",
		subtitle: "Objetivos Específicos",
		content:
			"Desarrollar gobernanza basada en la confianza y políticas públicas de alto impacto humano y territorial.",
		bullets: [
			"**Gobernanza basada en la Confianza:** Desarrollar mecanismos de transparencia operativa para transformar la relación Estado-ciudadano hacia la colaboración comprobable.",
			"**Gestión de la Política Pública con Enfoque Humano:** Integrar la ética para que el diseño y la ejecución de políticas prioricen la cohesión social y capacidades locales.",
			"**Arquitectura de Reintegración y Paz:** Diseñar protocolos institucionales técnicos y sostenibles para la atención y vinculación productiva de poblaciones vulnerables.",
		],
		accent: "#7209b7",
	},
	{
		id: "juridico-penal",
		title: "Jurídico-Penal",
		subtitle: "Objetivos Específicos",
		content:
			"Garantizar rutas de reintegro social integral complementadas con formación rigurosa y medición de impacto.",
		bullets: [
			"**Ruta de Reintegro Integral:** Implementar un programa de reintegro social diseñado como una vía de salida clara, digna y verificable para personas que han delinquido.",
			"**Complementariedad Estratégica (Reintegro + Oficio):** Armonizar el acompañamiento social con la formación en oficios de alta demanda (ebanistería, diseño técnico, etc.).",
			"**Medición de la Transformación:** Incorporar indicadores de impacto basados en la autonomía económica y la capacidad de inserción laboral autónoma alcanzada.",
		],
		badges: [
			{
				name: "Nidia Sara Donado Rueda",
				role: "Presidenta Corpojueces",
				image: "/assets/escarapelas/Nidia Sara Donado Rueda.webp",
			},
			{
				name: "Minelva Simanca Gale",
				role: "Especialista Jurídico-Penal",
				image: "/assets/escarapelas/Minelva Simanca Gale.png",
			},
			{
				name: "Antonio de la Ossa Contreras",
				role: "Experto en Reintegración",
				image: "/assets/escarapelas/Antonio de la Ossa Contreras.jpg",
			},
			{
				name: "Julio Charris Gallardo",
				role: "Consultor Jurídico",
				image: "/assets/escarapelas/Julio Charris Gallardo.png",
			},
		],
		accent: "#f72585",
	},
	{
		id: "sector-academico",
		title: "Sector Académico",
		subtitle: "Objetivos Específicos",
		content:
			"Generar conocimiento aplicado en ética, integrar la formación crítica y articular ecosistemas de innovación.",
		bullets: [
			"**Generación de Conocimiento Aplicado:** Establecer alianzas investigativas para elevar los protocolos de integridad y ética aplicada a estándares académicos de referencia.",
			"**Formación con Sentido Crítico:** Integrar la ética como componente práctico y transversal en currículos para capacitar en decisiones complejas y de gobernanza.",
			"**Articulación de Ecosistemas de Innovación:** Vincular investigación universitaria y proyectos de grado con los retos de eficiencia y transparencia empresarial y pública.",
		],
		accent: "#ffbe0b",
	},
	{
		id: "fuerza-publica",
		title: "Fuerza Pública",
		subtitle: "Objetivos Específicos",
		content:
			"Fortalecer la legitimidad institucional y desarrollar tecnologías éticas para la convivencia y derechos humanos.",
		bullets: [
			"**Blindaje Ético y Legitimidad:** Desarrollar protocolos de actuación con la integridad como eje, fortaleciendo la confianza ciudadana y legitimidad de la fuerza pública.",
			"**Tecnologías de Gestión para la Convivencia:** Implementar herramientas de ética aplicada para gestionar situaciones complejas priorizando la resolución pacífica y derechos humanos.",
			"**Fuerza Pública como Actor Ético:** Posicionar el servicio policial como agente de cohesión social y construcción de confianza.",
		],
		accent: "#3a86c8",
	},
	{
		id: "methodology",
		title: "Metodología",
		subtitle: "Investigación-Creación",
		content:
			"Modelo participativo multidisciplinar estructurado en formatos de interacción, escenarios y equipo misional.",
		readMoreTitle: "Metodología Completa",
		readMoreContent:
			"El simposio se desarrollará bajo un modelo participativo de investigación-creación que conecta capacidades multidisciplinares para generar acciones concretas, estructurado de la siguiente manera:\n\nFormatos de Interacción: Se programarán mesas de trabajo técnico, conversatorios, laboratorios de ideación y talleres de diseño especulativo para el co-diseño de soluciones aplicadas.\n\nEscenarios: Las actividades se realizarán en entornos académicos, culturales y naturales, utilizando la deslocalización para propiciar el pensamiento lateral y la cooperación entre actores.\n\nEquipo Misional: Un comité interdisciplinar coordinará el evento para asegurar el cumplimiento de los objetivos de investigación, regular los debates y tabular los datos resultantes.",
		bullets: [
			"**Formatos de Interacción:** Mesas de trabajo técnico, conversatorios, laboratorios de ideación y talleres de diseño especulativo.",
			"**Escenarios:** Entornos académicos, culturales y naturales, promoviendo la deslocalización y el pensamiento lateral.",
			"**Equipo Misional:** Comité interdisciplinar que coordina, regula debates, asegura objetivos y tabula datos resultantes.",
		],
		accent: "#96157f",
	},
	{
		id: "hub-1",
		title: "Hub de Profesionales (I)",
		content: "Coordinadores y facilitadores principales del Simposio.",
		nodes: [
			{
				role: "NOMON SAS BIC",
				desc: "Coordinador general y secretaría técnica: lidera la convocatoria estratégica y garantiza el seguimiento de resultados.",
			},
			{
				role: "Javier García",
				desc: "Diseñador especulativo: a cargo del diseño e implementación general del proyecto.",
			},
			{
				role: "Isabel Álvarez",
				desc: "Coordinadora Costa Caribe: articulación y enlace de actores clave de la región Caribe.",
			},
			{
				role: "Marina Álvarez",
				desc: "Club de Leones de Barranquilla: articulación y participación de la sociedad civil en el simposio.",
			},
			{
				role: "Dra. Nidia Sara Donado Rueda",
				desc: "Presidenta Corpojueces / Jueza de Paz: panelista principal en Justicia, Integridad y Convivencia.",
			},
			{
				role: "Alfonso Bohórquez",
				desc: "Director Diseño Industrial UNAL: aval institucional, dirección académica y articulación curricular.",
			},
		],
		accent: "#3da849",
	},
	{
		id: "hub-2",
		title: "Hub de Profesionales (II)",
		content: "Equipo académico y creativo del Simposio.",
		nodes: [
			{
				role: "Isabel Cristina",
				desc: "Directora de Investigación UNAL: supervisión del marco metodológico e investigación del Libro Blanco.",
			},
			{
				role: "Juan Mendoza Collazos",
				desc: "Profesor Maestría Diseño UNAL: teoría sistémica, diseño avanzado y co-creación.",
			},
			{
				role: "Samuel Herrera",
				desc: "Profesor Diseño Industrial UNAL: pedagogía del proyecto e implementación de guías de integridad en el aula.",
			},
			{
				role: "Andrés Felipe Sussman",
				desc: "Profesor Diseño Industrial UNAL: co-diseño de dinámicas participativas y diseño enfocado en la vida.",
			},
			{
				role: "Juan Sebastián Salazar",
				desc: "Diseño Especulativo: desarrollo de artefactos de especulación, escenarios de futuros y estética Solarpunk.",
			},
			{
				role: "Misa",
				desc: "Agente de Cultura UNAL: mediación artística, performances y escenarios no tradicionales.",
			},
		],
		accent: "#3da849",
	},
	{
		id: "galeria",
		title: "Evento en Barranquilla",
		subtitle: "Momentos del Simposio Internacional de Ética",
		content: "Galería de fotografías de la ciudad y del evento.",
		gallery: [
			"/assets/galeria/barranquilla-1.jpeg",
			"/assets/galeria/barranquilla-2.jpeg",
			"/assets/galeria/barranquilla-3.jpeg",
			"/assets/galeria/barranquilla-4.jpeg",
			"/assets/galeria/barranquilla-5.jpeg",
		],
		accent: "#d4a574",
	},
];

export const simposio = {
	titulo: "Simposio Internacional de Ética",
	subtitulo:
		"Protocolos de Integridad para la Supervivencia multi especie y la Sustentabilidad Sistémica.",
	descripcion:
		"El evento insignia de NOMON para co-crear protocolos y tecnologías éticas con los actores de la quíntuple hélice.",
	slides,
};
