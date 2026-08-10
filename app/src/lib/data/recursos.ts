// Datos estáticos de Recursos (Biblioteca NOMON)
// Ver arnes/nucleo/logica_de_negocio.md §3

import type { estrategiaAccesoEnum } from "../db/schema";

export interface RecursoMetadata {
	autor?: string;
	editorial?: string;
	anio?: string;
	idioma?: string;
}

export interface Recurso {
	id: string;
	slug: string;
	titulo: string;
	contenido: string;
	pdfUrl?: string;
	estrategiaAcceso: (typeof estrategiaAccesoEnum.enumValues)[number];
	listaBlancaRef?: string;
	metadata?: RecursoMetadata;
	recursosRelacionados?: string[];
}

export interface RecursoAcceso {
	recursoId: string;
	email: string;
}

// Recursos públicos (PUBLICO)
export const recursos: Recurso[] = [
	{
		id: "1",
		slug: "etica-en-los-negocios",
		titulo: "Ética en los Negocios: Fundamentos para una Empresa Sostenible",
		contenido:
			"Este documento explora los principios fundamentales de la ética empresarial y cómo su implementación puede generar valor a largo plazo para las organizaciones.",
		pdfUrl: "/pdfs/etica-negocios.pdf",
		estrategiaAcceso: "PUBLICO",
		metadata: {
			autor: "Dr. Carlos Mendoza",
			editorial: "NOMON Ediciones",
			anio: "2023",
			idioma: "es",
		},
		recursosRelacionados: ["2", "3"],
	},
	{
		id: "2",
		slug: "liderazgo-etico",
		titulo: "Liderazgo Ético: Construyendo Organizaciones con Propósito",
		contenido:
			"Guía práctica para desarrollar habilidades de liderazgo basadas en valores éticos y su impacto en la cultura organizacional.",
		pdfUrl: "/pdfs/liderazgo-etico.pdf",
		estrategiaAcceso: "PUBLICO",
		metadata: {
			autor: "María López",
			editorial: "NOMON",
			anio: "2024",
			idioma: "es",
		},
		recursosRelacionados: ["1", "4"],
	},
	{
		id: "3",
		slug: "sostenibilidad-y-etica",
		titulo: "Sostenibilidad y Ética: Dos Caras de la Misma Moneda",
		contenido:
			"Análisis de cómo los principios éticos son la base para prácticas de sostenibilidad auténticas y efectivas.",
		pdfUrl: "/pdfs/sostenibilidad-etica.pdf",
		estrategiaAcceso: "SOLO_REGISTRADOS",
		metadata: {
			autor: "Dr. Ana Gómez",
			editorial: "Universidad Nacional",
			anio: "2023",
			idioma: "es",
		},
		recursosRelacionados: ["1", "5"],
	},
	{
		id: "4",
		slug: "etica-digital",
		titulo: "Ética Digital: Navegando el Mundo Tecnológico con Responsabilidad",
		contenido:
			"Reflexiones sobre los desafíos éticos que plantea la transformación digital y cómo abordarlos.",
		pdfUrl: "/pdfs/etica-digital.pdf",
		estrategiaAcceso: "PUBLICO",
		metadata: {
			autor: "Javier Rojas",
			editorial: "NOMON Tech",
			anio: "2024",
			idioma: "es",
		},
		recursosRelacionados: ["2", "6"],
	},
	{
		id: "5",
		slug: "gobernanza-corporativa",
		titulo: "Gobernanza Corporativa Ética: Más Allá del Cumplimiento",
		contenido:
			"Cómo implementar prácticas de gobernanza que vayan más allá de los requisitos legales para crear valor real.",
		estrategiaAcceso: "SOLO_REGISTRADOS",
		metadata: {
			autor: "Dr. Luis Martínez",
			editorial: "NOMON",
			anio: "2023",
			idioma: "es",
		},
		recursosRelacionados: ["3"],
	},
];

// Accesos a recursos (LISTA_BLANCA)
export const recursosAccesos: RecursoAcceso[] = [
	{
		recursoId: "3",
		email: "aliado1@ejemplo.com",
	},
	{
		recursoId: "3",
		email: "aliado2@ejemplo.com",
	},
	{
		recursoId: "5",
		email: "admin@rednomon.com",
	},
];

// Función para obtener recursos por estrategia de acceso
export function getRecursosByEstrategia(
	estrategia: (typeof estrategiaAccesoEnum.enumValues)[number],
	userEmail?: string,
) {
	return recursos.filter((recurso) => {
		if (recurso.estrategiaAcceso === "PUBLICO") return true;
		if (recurso.estrategiaAcceso === "SOLO_REGISTRADOS") return !!userEmail;
		if (recurso.estrategiaAcceso === "LISTA_BLANCA") {
			return recursosAccesos.some(
				(acceso) =>
					acceso.recursoId === recurso.id && acceso.email === userEmail,
			);
		}
		return false;
	});
}

// Función para obtener un recurso por slug
export function getRecursoBySlug(slug: string) {
	return recursos.find((recurso) => recurso.slug === slug);
}

// Función para verificar acceso a un recurso
export function checkRecursoAcceso(slug: string, userEmail?: string) {
	const recurso = getRecursoBySlug(slug);
	if (!recurso) return false;

	if (recurso.estrategiaAcceso === "PUBLICO") return true;
	if (recurso.estrategiaAcceso === "SOLO_REGISTRADOS") return !!userEmail;
	if (recurso.estrategiaAcceso === "LISTA_BLANCA") {
		return recursosAccesos.some(
			(acceso) => acceso.recursoId === recurso.id && acceso.email === userEmail,
		);
	}
	return false;
}
