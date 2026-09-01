alter table public.properties
  add column logo_url text;

comment on column public.properties.logo_url is
  'URL pública del logo de la propiedad (recomendado: cuadrado, 500x500px). Si es null, el AppBar público usa el logo de la app como fallback.';