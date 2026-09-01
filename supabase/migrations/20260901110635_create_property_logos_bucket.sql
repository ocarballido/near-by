-- Bucket dedicado para logos de propiedad (branding), separado de
-- property-images (galería de la guía). Motivos: ciclo de vida distinto
-- (1:1 con la propiedad, casi estático) y restricciones de tamaño/tipo
-- más estrictas que no queremos imponer al resto de imágenes de la galería.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-logos',
  'property-logos',
  true,
  307200, -- 300 KB en bytes
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;