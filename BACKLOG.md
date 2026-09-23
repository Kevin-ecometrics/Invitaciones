# Backlog — Invitación digital "60s María Esther"

Temática: cumpleaños 60 años, estilo galáctico/celestial (luna, estrellas, plata/holográfico).
Evento: sábado 24 de octubre, 8pm bienvenida, 9pm cena. Salón de Eventos CAIC, David Alfaro
Siqueiros 2601, Zona Río, Tijuana. Estacionamiento disponible. Dress code: "Disfraz Galáctico".

Referencias de estructura/UX: lunacreativegd.com/boda-isabel-jerry-12-09-26-2p,
lal.so/e/ejRmWKu7I9q, ivette35.netlify.app.

Todo conectado a Supabase (Postgres + Auth + Storage). Habrá un panel admin para que los
anfitriones (owners) aprueben o rechacen las solicitudes de confirmación (RSVP) que manden los
invitados.

---

## 1. Supabase — Base de datos

### Tabla `guests` (invitados/registro maestro, pre-carga opcional por los owners) — **en alcance**
- `id` uuid pk default gen_random_uuid()
- `full_name` text not null
- `phone` text
- `max_passes` int default 1 — cupo asignado a ese invitado/familia
- `notes` text
- `created_at` timestamptz default now()
- RLS: select/insert/update/delete solo `service_role`.
- El RSVP sigue siendo libre (cualquiera con el link puede mandar su solicitud); `rsvps.guest_id`
  queda nullable para las solicitudes que no vienen de un invitado precargado. `guests` se usa
  solo si los owners quieren precargar una lista con cupos asignados — no es obligatorio.

### Tabla `rsvps` (solicitudes de confirmación enviadas desde la página)
- `id` uuid pk default gen_random_uuid()
- `guest_id` uuid references guests(id) nullable — si vino de un link pre-cargado
- `full_name` text not null
- `email` text
- `phone` text
- `party_size` int not null default 1
- `companion_names` text[] nullable — nombre de cada acompañante (además del titular)
- `attendance` text check in ('yes','no') not null
- `dietary_notes` text nullable
- `message` text nullable — mensaje para la cumpleañera
- `status` text not null default 'pending' — 'pending' | 'approved' | 'rejected'
- `reviewed_by` text nullable — nombre del admin que revisó (no hay tabla de usuarios)
- `reviewed_at` timestamptz nullable
- `rejection_reason` text nullable
- `created_at` timestamptz default now()

### ~~Tabla `admin_users`~~ — fuera de alcance
Se descarta para la primera fase: el acceso admin se resuelve con usuario/contraseña en
variables de entorno (ver sección 4), no con Supabase Auth ni una tabla de usuarios.

### Tabla `gallery_photos` (galería mostrada en la landing — con moderación de invitados)
- `id` uuid pk default gen_random_uuid()
- `storage_path` text not null — referencia al objeto en el bucket `gallery`
- `alt_text` text
- `submitted_by_name` text nullable — nombre de quien subió la foto (invitado)
- `submitter_token` text not null default '' — identificador anónimo (cookie) del dispositivo que
  subió la foto, usado solo para aplicar el límite de 5 fotos por persona
- `sort_order` int default 0
- `status` text not null default 'pending' — 'pending' | 'approved' | 'rejected'
- `is_published` bool default false — solo se muestra en la landing si `status = 'approved'`
  **y** `is_published = true`
- `reviewed_by`, `reviewed_at`, `rejection_reason` — igual que en `rsvps`
- `created_at` timestamptz default now()

**Flujo de moderación:** cualquier invitado (anon) puede subir hasta **5 fotos por persona** desde
la landing (identificado por una cookie anónima `gallery_submitter`, ya que no hay login de
invitados) → cada foto se sube al bucket `gallery` y se crea una fila con `status = 'pending'`. El
admin ve **todas** las fotos subidas por todos los invitados, sin límite, y aprueba o rechaza cada
una. Al aprobar, la foto pasa a `approved` + `is_published = true` y aparece en la galería pública.
No hay límite en cuántas fotos puede aprobar/publicar el admin — el único límite es el de 5 subidas
por invitado, validado en el Server Action de subida (`app/actions/gallery.ts`).

### Tabla `event_settings` (contenido editable sin tocar código: fecha, textos, música)
- `id` int pk default 1 (fila única, tipo singleton)
- `event_title` text
- `event_date` timestamptz
- `welcome_time` text
- `dinner_time` text
- `venue_name` text
- `venue_address` text
- `dress_code_title` text
- `dress_code_description` text
- `music_storage_path` text nullable
- `hero_headline` text
- `rsvp_deadline` timestamptz nullable
- `updated_at` timestamptz default now()

### RLS (Row Level Security)
- `rsvps`: insert público (anon) permitido solo con validación de campos vía policy/check
  constraints; select/update/delete restringido al `service_role` (usado por los Server Actions
  del panel admin tras validar la cookie de sesión).
- `guests`: select/insert/update/delete solo `service_role`.
- `gallery_photos`: insert público (anon) permitido solo con `status = 'pending'` y
  `is_published = false` (submission de invitados); select público solo donde
  `status = 'approved' and is_published = true`; update/delete solo `service_role` (moderación
  admin).
- `event_settings`: select público; update solo `service_role`.

### Realtime (opcional)
- Habilitar realtime en `rsvps` para que el panel admin vea nuevas solicitudes sin refrescar.

---

## 2. Supabase — Storage (buckets)

- **`gallery`** (público, solo lectura pública) — fotos de ambientación/inspiración mostradas en
  la landing (las que ya tienes en la carpeta de Descargas).
- **`invitation-assets`** (público) — imagen principal de la invitación, íconos, texturas
  (estrellas, luna) usados en el diseño.
- **`music`** (público) — pista de fondo opcional.
- **`dress-code`** (público) — imágenes de referencia de outfits "Disfraz Galáctico".

Políticas de bucket: lectura pública en los 4. Insert público permitido solo en `gallery`
(submissions de invitados, quedan como `pending` hasta revisión); update/delete y escritura en
los otros 3 buckets (`invitation-assets`, `music`, `dress-code`) solo `service_role` desde el
panel admin.

---

## 3. Sitio público (landing de invitación)

- **Hero**: nombre "María Esther", "60s", fecha, fondo estelar animado (CSS/canvas de estrellas).
- **Cuenta regresiva** al 24 de octubre 8pm.
- **Detalles del evento**: salón, dirección con link a Google Maps (mapa embebido sin API key),
  horarios (bienvenida/cena), estacionamiento.
- **Mesa de regalos / lista de deseos** (Amazon, Liverpool, etc.): fila en la sección de detalles,
  junto a horario/estacionamiento. Ya está listo el campo `event_settings.gift_registry_links`
  (jsonb `[{label, url}]`) y su editor en el panel admin (Settings → "Mesa de regalos"); la fila en
  la landing solo aparece cuando hay al menos un link cargado.
  **PENDIENTE: falta que Kevin consiga los links reales y los cargue desde el admin.**
- **Dress code "Disfraz Galáctico"**: texto + mini galería de referencia (bucket `dress-code`).
- **Galería de fotos**: grid con las imágenes de `gallery_photos` (lightbox al hacer click).
- **Música de fondo**: botón mute/unmute, autoplay solo tras primer gesto del usuario (política
  de navegadores).
- **Formulario RSVP**: nombre del titular, teléfono/email, asistencia sí/no, número de
  acompañantes con un campo de nombre por cada uno (agregar/quitar dinámicamente en el form),
  restricciones alimenticias, mensaje. Al enviar → insert en `rsvps` (status `pending`) vía
  Server Action. Confirmación visual "tu solicitud fue enviada, en breve la confirmamos".
- **Responsive** mobile-first (la mayoría abrirá el link desde WhatsApp).
- **Preview de link para WhatsApp**: metadata Open Graph / Twitter (`title`, `description`,
  `og:image`, `og:url`) generada con `generateMetadata`, imagen OG dinámica vía
  `app/opengraph-image.tsx` (`next/og` `ImageResponse`, 1200×630, con el tema galáctico) para que
  el link se vea bien al compartirse. Requiere `NEXT_PUBLIC_SITE_URL` configurado con el dominio
  real una vez desplegado (por defecto usa `localhost:3000` en dev).

---

## 4. Panel Admin (`/admin`)

- **Auth**: login simple con usuario/contraseña guardados en variables de entorno
  (`ADMIN_USERNAME`, `ADMIN_PASSWORD`), verificados en un Server Action que setea una cookie de
  sesión firmada (httpOnly). No se usa Supabase Auth ni la tabla `admin_users` para esto — esa
  tabla se elimina del alcance de la primera fase. Las mutaciones admin (`approveRsvp`,
  `rejectRsvp`, subir/borrar galería, editar `event_settings`) se hacen con el
  `SUPABASE_SERVICE_ROLE_KEY` desde el servidor, verificando primero la cookie de sesión admin.
- **Dashboard de solicitudes**: tabla de `rsvps` con filtros por status (pending/approved/
  rejected), buscador por nombre.
- **Acciones por solicitud**: Aprobar / Rechazar (con motivo opcional) → actualiza `status`,
  `reviewed_by`, `reviewed_at`.
- **Contador en vivo**: total confirmados, total pases (`sum(party_size)` de aprobados),
  pendientes, rechazados.
- **Gestión de galería**: el admin ve **todas** las fotos subidas por los invitados (sin límite),
  aprueba/rechaza, publica/oculta y elimina. El límite de **5 fotos es por invitado al subir**
  (no un tope global de la galería), validado en el Server Action de subida.
- **Gestión de `event_settings`**: editar textos, fecha, horarios, música sin tocar código.
- **Exportar** lista de aprobados a CSV (para el salón/catering).

---

## 5. Server Actions / rutas necesarias (Next.js App Router)

- `app/actions/rsvp.ts` — `createRsvp(formData)` (`use server`), inserta en `rsvps`.
- `app/admin/login/page.tsx` — login owners.
- `app/admin/page.tsx` — dashboard (protegido, redirige si no hay sesión admin).
- `app/admin/actions.ts` — `approveRsvp`, `rejectRsvp`, `updateEventSettings`,
  `uploadGalleryPhoto`, `deleteGalleryPhoto` (todas `use server`, validan sesión admin antes de
  mutar).
- Middleware o check en layout de `/admin` para exigir cookie de sesión admin válida.

---

## 6. Variables de entorno necesarias

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # solo server-side, para acciones admin sensibles
ADMIN_USERNAME=
ADMIN_PASSWORD=
SESSION_SECRET=              # para firmar la cookie de sesión admin
NEXT_PUBLIC_SITE_URL=        # dominio público del sitio, usado para el link/OG de WhatsApp
```

---

## 7. Orden sugerido de implementación

1. ✅ Crear tablas (`guests`, `rsvps`, `gallery_photos`, `event_settings`) + RLS + trigger de tope
   de galería + buckets en Supabase.
2. ✅ Seed inicial de `event_settings` con los datos reales de la invitación.
3. ⬜ Subir fotos reales de ambientación/inspiración a `gallery` / `dress-code` si se quieren
   mostrar desde el día uno (por ahora la galería pública empieza vacía, a la espera de
   submissions de invitados o de que el admin apruebe algunas).
4. ✅ Landing pública: hero, countdown, detalles, dress code, galería con moderación, subida de
   fotos por invitados, música, metadata OG para WhatsApp.
5. ✅ Formulario RSVP conectado (insert `pending`).
6. ✅ Auth admin con `ADMIN_USERNAME`/`ADMIN_PASSWORD` + cookie de sesión firmada (`SESSION_SECRET`,
   `jose`), protegida con `proxy.ts` (Next 16 renombró `middleware.ts` a `proxy.ts`).
7. ✅ Panel admin: listado + filtros + búsqueda + aprobar/rechazar + contadores + export CSV.
8. ✅ Panel admin: moderación de galería (aprobar/rechazar/ocultar/eliminar, tope de 5) y edición
   de `event_settings`.
9. ⬜ Pulido visual final con fotos reales, `ADMIN_PASSWORD` real, testing en móvil/WhatsApp real,
   deploy y `NEXT_PUBLIC_SITE_URL` con el dominio definitivo.

---

## Decisiones ya tomadas
- RSVP libre: cualquier invitado con el link manda su solicitud directo a `rsvps`, sin necesidad
  de estar precargado. La tabla `guests` **sí se crea** (en alcance) para que los owners puedan
  precargar una lista con cupos (`max_passes`) si lo necesitan; `rsvps.guest_id` es nullable para
  las solicitudes que no vienen de ahí.
- Sin fecha límite de confirmación por ahora — `event_settings.rsvp_deadline` se deja nullable
  y sin usar en el UI hasta que se pida.

- Acceso admin: usuario/contraseña definidos por variables de entorno (`ADMIN_USERNAME`,
  `ADMIN_PASSWORD`, `SESSION_SECRET`), generados y guardados en `.env.local`. Sin tabla
  `admin_users` ni Supabase Auth.

- RSVP pide nombre del titular + nombre de cada acompañante (no solo cantidad).
- Galería con moderación: los invitados suben sus propias fotos (`gallery_photos.status =
  'pending'`), el admin aprueba o rechaza desde el panel, y solo las aprobadas y publicadas
  aparecen en la landing. Máximo 5 fotos aprobadas y publicadas a la vez, forzado en base de
  datos y en el Server Action de aprobación.
- Link de WhatsApp: metadata OG/Twitter con imagen dinámica (`next/og`) para que el preview del
  link se vea bien al compartirse.
