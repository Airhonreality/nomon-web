# SEO TÉCNICO — NOMON (2026-2027)

**Contrato vivo.** Guía para optimizar el sitio de NOMON para motores de búsqueda tradicionales y **búsqueda generativa** (AI Overviews, LLM). **Regla:** Todo contenido público debe incluir datos estructurados (JSON-LD).

**Fuente:** `INS_Mejores Prácticas de JSON-LD y SEO Técnico para 2026-2027.md`.

---

## 1. Contexto: Búsqueda Generativa (2026-2027)

### 1.1 El Cambio de Paradigma
- **Antes (2020-2025):** Los motores de búsqueda indexaban **palabras clave** y mostraban resultados en forma de enlaces (SERPs).
- **Ahora (2026-2027):** Los **LLM (Modelos de Lenguaje Grande)** analizan **datos estructurados** (JSON-LD) para generar **respuestas directas** (AI Overviews, ChatGPT Search, Perplexity).

**Implicación para NOMON:**
- Sin JSON-LD, el sitio **no aparecerá** en AI Overviews.
- Con JSON-LD, los LLM pueden **citar a NOMON** como fuente en respuestas generativas.

### 1.2 ¿Cómo Consumen los LLM el Contenido?
1. **Extracción de entidades:** Identifican `Organization`, `Person`, `Event`, `Article`, etc.
2. **Resolución de ambigüedades:** Usan el contexto semántico (ej: "Simposio de NOMON" vs "Simposio de otra organización").
3. **Mapeo de relaciones:** Entienden conexiones entre entidades (ej: `NOMON` organiza el `Simposio Internacional de Ética`).

---

## 2. JSON-LD para NOMON

### 2.1 Esquemas Clave

#### Organization (Organización)
**Ubicación:** `app/layout.tsx` (global).
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://rednomon.com/#organization",
  "name": "NOMON",
  "url": "https://rednomon.com",
  "logo": "https://rednomon.com/logo.svg",
  "description": "Ideas que echan raíces, acciones que transforman. Impulsamos la evolución de organizaciones y comunidades a través de consultoría estratégica, formación humana y creación artística.",
  "sameAs": ["https://twitter.com/rednomon", "https://linkedin.com/company/rednomon"]
}
```

#### Event (Simposio)
**Ubicación:** `app/simposio/page.tsx`.
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://rednomon.com/simposio/#event",
  "name": "Simposio Internacional de Ética 2026",
  "description": "Protocolos de Integridad para la Supervivencia multi especie y la Sustentabilidad Sistémica.",
  "startDate": "2026-11-15T09:00:00-05:00",
  "endDate": "2026-11-17T18:00:00-05:00",
  "location": {
    "@type": "Place",
    "name": "Bogotá, Colombia",
    "address": { "@type": "PostalAddress", "addressLocality": "Bogotá", "addressCountry": "CO" }
  },
  "organizer": { "@type": "Organization", "@id": "https://rednomon.com/#organization" }
}
```

#### Article (Recursos)
**Ubicación:** `app/recursos/[slug]/page.tsx` (dinámico).
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://rednomon.com/recursos/:slug/#article",
  "headline": "{titulo}",
  "description": "{metadata.razon_nomon}",
  "author": { "@type": "Person", "name": "{metadata.autor}" },
  "datePublished": "{fecha_creacion}",
  "publisher": { "@type": "Organization", "name": "NOMON", "logo": "https://rednomon.com/logo.svg" },
  "articleBody": "{contenido_resumido}"
}
```

#### BreadcrumbList (Migajas de Pan)
**Ubicación:** Todas las páginas (excepto `/`).
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://rednomon.com" },
    { "@type": "ListItem", "position": 2, "name": "Recursos", "item": "https://rednomon.com/recursos" },
    { "@type": "ListItem", "position": 3, "name": "{titulo}", "item": "https://rednomon.com/recursos/{slug}" }
  ]
}
```

---

## 3. Integración con Next.js (App Router)

### 3.1 Opción A: Metadata API (Recomendada)
```tsx
// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NOMON | Ética Aplicada',
  description: 'Ideas que echan raíces, acciones que transforman.',
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'NOMON',
      url: 'https://rednomon.com',
      logo: 'https://rednomon.com/logo.svg'
    })
  },
  openGraph: {
    title: 'NOMON | Ética Aplicada',
    description: 'Ideas que echan raíces, acciones que transforman.',
    url: 'https://rednomon.com',
    images: [{ url: 'https://rednomon.com/og-image.jpg' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOMON | Ética Aplicada',
    images: ['https://rednomon.com/twitter-image.jpg']
  }
};
```

### 3.2 Opción B: Componente `<JsonLd />`
```tsx
// components/JsonLd.tsx
import Script from 'next/script';

export function JsonLd({ schema }: { schema: any }) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Uso en app/recursos/[slug]/page.tsx
import { JsonLd } from '@/components/JsonLd';

export default function RecursoPage({ params }: { params: { slug: string } }) {
  const recurso = await getRecursoBySlug(params.slug);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: recurso.titulo,
    description: recurso.metadata?.razon_nomon,
    author: { '@type': 'Person', name: recurso.metadata?.autor },
    publisher: { '@type': 'Organization', name: 'NOMON' }
  };
  return <><JsonLd schema={schema} /><!-- contenido --></>;
}
```

---

## 4. Meta Tags y Open Graph

### 4.1 Meta Tags Básicos
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: { default: 'NOMON | Ética Aplicada', template: '%s | NOMON' },
  description: 'Ideas que echan raíces, acciones que transforman.',
  keywords: ['ética', 'empresarial', 'simposio', 'consultoría'],
  authors: [{ name: 'NOMON' }],
  creator: 'NOMON'
};
```

### 4.2 Open Graph
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    title: 'NOMON | Ética Aplicada',
    description: 'Ideas que echan raíces, acciones que transforman.',
    url: 'https://rednomon.com',
    siteName: 'NOMON',
    images: [{ url: 'https://rednomon.com/og-image.jpg', width: 1200, height: 630 }],
    locale: 'es_CO',
    type: 'website'
  }
};
```

### 4.3 Twitter Cards
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'NOMON | Ética Aplicada',
    description: 'Ideas que echan raíces, acciones que transforman.',
    images: ['https://rednomon.com/twitter-image.jpg'],
    creator: '@rednomon',
    site: '@rednomon'
  }
};
```

---

## 5. Validación y Herramientas

| Herramienta | URL | Propósito |
|-------------|-----|-----------|
| Google Rich Results Test | [link](https://search.google.com/test/rich-results) | Validar JSON-LD |
| Schema Markup Validator | [link](https://validator.schema.org/) | Validar sintaxis |
| Lighthouse | `npx lighthouse` | Audit de SEO |

**Comandos:**
```bash
npx schema-validator https://rednomon.com
npx seo-check https://rednomon.com
npx lighthouse https://rednomon.com --output=json
```

---

## 6. Sitemap y Robots.txt

### 6.1 Sitemap
```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllRecursos } from '@/lib/db/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recursos = await getAllRecursos();
  const recursoEntries = recursos.map((recurso) => ({
    url: `https://rednomon.com/recursos/${recurso.slug}`,
    lastModified: new Date(recurso.fecha_actualizacion),
    changeFrequency: 'monthly',
    priority: 0.8
  }));
  return [
    { url: 'https://rednomon.com', lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
    { url: 'https://rednomon.com/simposio', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    ...recursoEntries
  ];
}
```

### 6.2 Robots.txt
```tsx
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/perfil', '/correo'] }],
    sitemap: 'https://rednomon.com/sitemap.xml'
  };
}
```

---

## 7. Checklist de SEO

### 7.1 Antes de Diseñar
- [ ] ¿Tiene `title` único (≤ 60 caracteres)?
- [ ] ¿Tiene `description` única (≤ 160 caracteres)?
- [ ] ¿Tiene schema JSON-LD aplicable?

### 7.2 Antes de Implementar
- [ ] ¿JSON-LD validado con Schema Markup Validator?
- [ ] ¿Meta tags configuradas?
- [ ] ¿Imágenes tienen `alt`, `width`, `height`?
- [ ] ¿Enlaces externos tienen `rel="noopener noreferrer"`?

### 7.3 Antes de Deploy
- [ ] ¿Pasa Lighthouse (SEO score ≥ 90)?
- [ ] ¿Sitemap generado?
- [ ] ¿Robots.txt configurado?
