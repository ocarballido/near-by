-- supabase/seed.sql
-- This file is executed automatically by `npx supabase db reset`
-- Must be pure SQL (no psql meta-commands like \i)

begin;

-- =========================================================
-- CATEGORIES
-- =========================================================

insert into public.categories (id, name, icon, order_index, type)
values
  ('4581a08a-3e78-4800-b16c-575f5da81cba', 'El Alojamiento', 'IconApartment', 1, 'info'::public.property_data_type),
  ('56e286de-42ec-42f8-b538-a266387f5c7c', 'Salud y Bienestar', 'IconHealing', 2, 'location'::public.property_data_type),
  ('91125962-2260-4b09-a062-6aad5eff6101', 'Comida y Bebida', 'IconForkSpoon', 3, 'location'::public.property_data_type),
  ('f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Arte y Cultura', 'IconMuseum', 4, 'location'::public.property_data_type),
  ('d7569f16-3d4d-4e79-ac0e-a11a80b31f6c', 'Parques y Naturaleza', 'IconNature', 5, 'location'::public.property_data_type),
  ('e9781151-e27a-4c60-9819-49c095f03cd8', 'Compras', 'IconShoppingBag', 6, 'location'::public.property_data_type),
  ('f97d7e65-87f5-471e-a120-c04c26394b54', 'Servicios', 'IconLocalAtm', 7, 'location'::public.property_data_type),
  ('5922cd0e-8c11-448f-83c0-e785f83c31f5', 'Transporte', 'IconTrain', 8, 'location'::public.property_data_type),
  ('81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Entretenimiento y Vida Nocturna', 'IconNightLife', 9, 'location'::public.property_data_type),
  ('d2a4b56f-151b-4151-a006-6f86a7ad6a9a', 'Atracciones y Turismo', 'IconComedyMask', 10, 'location'::public.property_data_type),
  ('c89d4a51-babd-44d0-acff-de3f3a8fd3db', 'Seguridad y Emergencias', 'IconEmergency', 11, 'location'::public.property_data_type),
  ('5509834d-c45c-4667-9e8b-960fea63ffc2', 'Familia y Niños', 'IconFamilyRestroom', 12, 'location'::public.property_data_type),
  ('7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684', 'Mascotas', 'IconPets', 13, 'location'::public.property_data_type)
on conflict (id) do update
set
  name        = excluded.name,
  icon        = excluded.icon,
  order_index = excluded.order_index,
  type        = excluded.type;

-- =========================================================
-- SUB CATEGORIES
-- =========================================================

insert into public.sub_categories (id, category_id, name, type, order_index)
values
  ('4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7', '4581a08a-3e78-4800-b16c-575f5da81cba', 'Manual de alojamiento', 'info'::public.property_data_type, 1),
  ('f6eb90a5-0543-49a2-8619-23912e9c1a33', '4581a08a-3e78-4800-b16c-575f5da81cba', 'Normas de uso', 'info'::public.property_data_type, 2),
  ('a1091bf8-4fe3-4ded-854b-fc08019d9296', '4581a08a-3e78-4800-b16c-575f5da81cba', 'Horario', 'info'::public.property_data_type, 3),
  ('cd19040f-5160-49ac-b395-adab3ec2d919', '4581a08a-3e78-4800-b16c-575f5da81cba', 'Reciclaje', 'info'::public.property_data_type, 4),
  ('0e04b6d5-72be-4f9b-9274-3526ff3f851a', '4581a08a-3e78-4800-b16c-575f5da81cba', 'Wifi', 'info'::public.property_data_type, 5),
  ('e34d65fd-18a4-4fca-9522-5585593fe28d', '4581a08a-3e78-4800-b16c-575f5da81cba', 'Explora los detalles', 'info'::public.property_data_type, 6),
  ('8028b58d-6024-42dc-a4e2-2ff2caa27e56', '5509834d-c45c-4667-9e8b-960fea63ffc2', 'Restaurantes para niños', 'location'::public.property_data_type, 1),
  ('01f16e27-fba9-4ee5-9eb8-9b948c235de2', '5509834d-c45c-4667-9e8b-960fea63ffc2', 'Centros de juegos interiores', 'location'::public.property_data_type, 2),
  ('bdf47ef5-710c-4f2d-aa6a-b40c45148b11', '5509834d-c45c-4667-9e8b-960fea63ffc2', 'Jugueterías', 'location'::public.property_data_type, 3),
  ('da84c886-c6a6-4d5b-8148-657d6802bbb8', '5509834d-c45c-4667-9e8b-960fea63ffc2', 'Museos infantiles', 'location'::public.property_data_type, 4),
  ('d86dd401-9a93-45e8-b4c2-47fa8f46398e', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Hospitales', 'location'::public.property_data_type, 1),
  ('a1b814e3-f5f5-4669-84f9-dd06685a2867', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Farmacias', 'location'::public.property_data_type, 2),
  ('9a39fc67-6908-49d7-ad7b-b03c4b4a17ec', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Urgencias', 'location'::public.property_data_type, 3),
  ('b8c955ca-9c59-4e63-a4a8-d12721200a9b', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Cuidado dental', 'location'::public.property_data_type, 4),
  ('c8b9fc21-434b-4bc3-b6b5-0543e3b6acfd', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Masajes y Spa', 'location'::public.property_data_type, 5),
  ('458a6ca7-1af3-4a64-8335-8c2c5dbaad9f', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Fisioterapia', 'location'::public.property_data_type, 6),
  ('042505e9-7485-41cb-9895-d3ccd2028ad7', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Gimnasios', 'location'::public.property_data_type, 7),
  ('13574fdb-f91c-440d-854a-ab037bded19f', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Yoga', 'location'::public.property_data_type, 8),
  ('39b17b02-0b43-4490-9c5f-373b6f1c6eea', '56e286de-42ec-42f8-b538-a266387f5c7c', 'Salud Mental', 'location'::public.property_data_type, 9),
  ('8760d066-d6c1-468f-80ab-b0dcae430af1', '5922cd0e-8c11-448f-83c0-e785f83c31f5', 'Paradas de autobús', 'location'::public.property_data_type, 1),
  ('a113f5c3-b32a-439f-961f-851c767f5bd5', '5922cd0e-8c11-448f-83c0-e785f83c31f5', 'Estaciones de metro', 'location'::public.property_data_type, 2),
  ('4404e048-02fe-469a-bcf0-69ff62fdd8ce', '5922cd0e-8c11-448f-83c0-e785f83c31f5', 'Estaciones de tren', 'location'::public.property_data_type, 3),
  ('0c9e0152-f4fa-409c-a28a-c1984d05518f', '5922cd0e-8c11-448f-83c0-e785f83c31f5', 'Alquiler de bicicletas', 'location'::public.property_data_type, 4),
  ('5cae1a6d-305c-430f-926e-46c0bd763ffa', '5922cd0e-8c11-448f-83c0-e785f83c31f5', 'Alquiler de scooters', 'location'::public.property_data_type, 5),
  ('ec589527-2da7-4228-81c9-aaab84fd9d64', '5922cd0e-8c11-448f-83c0-e785f83c31f5', 'Terminales de ferry', 'location'::public.property_data_type, 6),
  ('6ed3e4bf-1ff5-4d50-bebe-a7ae2f9edd8e', '5922cd0e-8c11-448f-83c0-e785f83c31f5', 'Paradas de taxi', 'location'::public.property_data_type, 7),
  ('49c9294a-409a-4e28-80a4-da0aa48906c4', '7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684', 'Tiendas de mascotas', 'location'::public.property_data_type, 1),
  ('17f95bb5-1a11-45da-9d60-adad0cb6a13d', '7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684', 'Veterinarios', 'location'::public.property_data_type, 2),
  ('5fd95b33-2992-4e8c-88d4-0bb295e93994', '7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684', 'Peluquerías', 'location'::public.property_data_type, 3),
  ('70a80113-e4cf-487b-8e39-bc5ed5fe7588', '81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Discotecas', 'location'::public.property_data_type, 1),
  ('a18fa330-50fc-43a9-8edd-da8cdf3d0f06', '81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Casinos', 'location'::public.property_data_type, 2),
  ('ea0406ab-18c7-48b4-976d-e016629ed7a0', '81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Clubes de comedia', 'location'::public.property_data_type, 3),
  ('d672053e-dc92-4e88-bf47-aab0bc18adfa', '81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Karaoke', 'location'::public.property_data_type, 4),
  ('4619002a-2e62-4fcf-8573-91727d106405', '81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Cines', 'location'::public.property_data_type, 5),
  ('4c893118-197b-437d-bb91-3952b8b7b45e', '81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Salas de escape', 'location'::public.property_data_type, 6),
  ('d2f95ecd-deb9-42d4-aa8d-4d9f7d84c368', '81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Boleras', 'location'::public.property_data_type, 7),
  ('004ced32-64dd-4ab0-8f7d-d241bfecbd4c', '81bb9ab7-25ad-483c-812d-6bdef1a0ee92', 'Arcades', 'location'::public.property_data_type, 8),
  ('b9048ed1-ab96-4a10-b542-2f5ef4fb5e78', '91125962-2260-4b09-a062-6aad5eff6101', 'Restaurantes', 'location'::public.property_data_type, 1),
  ('45d9b160-4619-4e99-a9eb-f0c86768eb6e', '91125962-2260-4b09-a062-6aad5eff6101', 'Cafeterías', 'location'::public.property_data_type, 2),
  ('7d77f635-9897-4ab0-8801-c3939a7f366b', '91125962-2260-4b09-a062-6aad5eff6101', 'Panaderías', 'location'::public.property_data_type, 3),
  ('915e4916-4726-4e95-950a-42057280a00c', '91125962-2260-4b09-a062-6aad5eff6101', 'Comida rápida', 'location'::public.property_data_type, 4),
  ('b7f98f6d-0f44-4702-8ead-138342382694', '91125962-2260-4b09-a062-6aad5eff6101', 'Bares', 'location'::public.property_data_type, 5),
  ('339a71f4-265e-4792-8d2a-f027bf69784b', '91125962-2260-4b09-a062-6aad5eff6101', 'Pubs', 'location'::public.property_data_type, 6),
  ('eebdb669-57f0-4039-b6a9-b5b2e4158a5f', '91125962-2260-4b09-a062-6aad5eff6101', 'Cervecerías', 'location'::public.property_data_type, 7),
  ('f5fc055e-5d6e-451e-bede-4e0db4ec74eb', '91125962-2260-4b09-a062-6aad5eff6101', 'Bares de Vinos', 'location'::public.property_data_type, 8),
  ('a66d2683-ced1-49ba-b60b-ee7befa6bf1f', '91125962-2260-4b09-a062-6aad5eff6101', 'Camiones de comida', 'location'::public.property_data_type, 9),
  ('a7a480f3-895c-48a1-8ae8-7fc8a57c1d10', 'c89d4a51-babd-44d0-acff-de3f3a8fd3db', 'Estaciones de policía', 'location'::public.property_data_type, 1),
  ('e41e0fb7-bb65-4d62-998e-13ba9a6c684e', 'c89d4a51-babd-44d0-acff-de3f3a8fd3db', 'Estaciones de bomberos', 'location'::public.property_data_type, 2),
  ('4682133f-e202-4620-bc2c-fa2d0921a231', 'c89d4a51-babd-44d0-acff-de3f3a8fd3db', 'Clínicas de emergencia', 'location'::public.property_data_type, 3),
  ('3725a152-dfeb-4041-9b60-e0564c13384a', 'c89d4a51-babd-44d0-acff-de3f3a8fd3db', 'Embajadas', 'location'::public.property_data_type, 4),
  ('7ad70a98-6d4d-473a-8d5b-e9c12af02976', 'd2a4b56f-151b-4151-a006-6f86a7ad6a9a', 'Atracciones turísticas', 'location'::public.property_data_type, 1),
  ('2db703c0-922e-4642-a5b9-8fda4b73c613', 'd2a4b56f-151b-4151-a006-6f86a7ad6a9a', 'Lugares emblemáticos', 'location'::public.property_data_type, 2),
  ('fbac7bca-a33f-42fb-a266-cd5931f6f24b', 'd2a4b56f-151b-4151-a006-6f86a7ad6a9a', 'Miradores', 'location'::public.property_data_type, 3),
  ('bcc4d5f2-a406-492d-a680-b5a9cd8c9886', 'd2a4b56f-151b-4151-a006-6f86a7ad6a9a', 'Parques temáticos', 'location'::public.property_data_type, 4),
  ('ae04421f-8507-4ec4-bd9c-52b2229e40d3', 'd2a4b56f-151b-4151-a006-6f86a7ad6a9a', 'Parques acuáticos', 'location'::public.property_data_type, 5),
  ('7ffc6b69-5684-4385-9f05-0ba196b409ca', 'd2a4b56f-151b-4151-a006-6f86a7ad6a9a', 'Tours guiados', 'location'::public.property_data_type, 6),
  ('ecd1752b-f8f4-4e6b-939b-a15586675b1f', 'd7569f16-3d4d-4e79-ac0e-a11a80b31f6c', 'Parques urbanos', 'location'::public.property_data_type, 1),
  ('2317985d-6b46-4391-a880-48090c95c9d3', 'd7569f16-3d4d-4e79-ac0e-a11a80b31f6c', 'Parques infantiles', 'location'::public.property_data_type, 2),
  ('57caef2f-6402-43b4-9b8f-303f3cb9ab75', 'd7569f16-3d4d-4e79-ac0e-a11a80b31f6c', 'Jardines botánicos', 'location'::public.property_data_type, 3),
  ('9fa589e5-a339-4cb6-9c7e-909e844d41ba', 'd7569f16-3d4d-4e79-ac0e-a11a80b31f6c', 'Senderos', 'location'::public.property_data_type, 4),
  ('01dcc1a2-fe62-4de8-822e-caba49c50f3c', 'd7569f16-3d4d-4e79-ac0e-a11a80b31f6c', 'Playas', 'location'::public.property_data_type, 5),
  ('b7639fff-d280-411f-a426-f1eddeb73b55', 'd7569f16-3d4d-4e79-ac0e-a11a80b31f6c', 'Zoológicos y Acuarios', 'location'::public.property_data_type, 6),
  ('9c1f3552-494d-464f-b4dd-bb161e6a6e47', 'd7569f16-3d4d-4e79-ac0e-a11a80b31f6c', 'Reservas naturales', 'location'::public.property_data_type, 7),
  ('c1059558-561f-4720-805e-6468f73cf29c', 'e9781151-e27a-4c60-9819-49c095f03cd8', 'Supermercados', 'location'::public.property_data_type, 1),
  ('e25bdb0a-0111-48a9-8fbf-c470910ee001', 'e9781151-e27a-4c60-9819-49c095f03cd8', 'Mercados de agricultores', 'location'::public.property_data_type, 2),
  ('e5ca0ca4-cf59-4c0f-82ef-45a063075e9d', 'e9781151-e27a-4c60-9819-49c095f03cd8', 'Centros comerciales', 'location'::public.property_data_type, 3),
  ('35b50848-fa18-4a21-bbe0-0229dbe13102', 'e9781151-e27a-4c60-9819-49c095f03cd8', 'Boutiques', 'location'::public.property_data_type, 4),
  ('0928801b-9908-46a6-95bf-3f9d0bee0251', 'e9781151-e27a-4c60-9819-49c095f03cd8', 'Souvenirs', 'location'::public.property_data_type, 5),
  ('3dbd739f-b111-49a4-9a01-fdbcf58d91a7', 'e9781151-e27a-4c60-9819-49c095f03cd8', 'Mercadillos', 'location'::public.property_data_type, 6),
  ('6c2f2c8b-3f5d-4a3e-9a0b-6c3a6e8e9f42', 'e9781151-e27a-4c60-9819-49c095f03cd8', 'Tiendas veganas', 'location'::public.property_data_type, 7),
  ('370681cd-d2fa-4b2c-9224-0eb796eb25ba', 'f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Museos', 'location'::public.property_data_type, 1),
  ('5a994cdf-55bc-42f8-b2cc-2f7d32359317', 'f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Galerías de arte', 'location'::public.property_data_type, 2),
  ('164448b8-7b5c-4875-a652-37e042456d2d', 'f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Teatros', 'location'::public.property_data_type, 3),
  ('84d10573-0cef-4cda-bbc7-d9d8c902069f', 'f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Salas de conciertos', 'location'::public.property_data_type, 4),
  ('d67c6e6e-9cca-4daa-b382-d458360a066d', 'f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Sitios históricos', 'location'::public.property_data_type, 5),
  ('d61355ba-adf6-49c6-8467-4037e0c3e978', 'f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Monumentos', 'location'::public.property_data_type, 6),
  ('3577e70e-5f21-46d1-b067-f4926e1936a8', 'f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Bibliotecas', 'location'::public.property_data_type, 7),
  ('bb50ff5f-ad12-4467-90b9-fa2123f5ac49', 'f3262d3d-5bfb-4dc3-91c7-33afc885fd3e', 'Centros culturales', 'location'::public.property_data_type, 8),
  ('b687c3eb-a033-4982-ae47-236697e027b1', 'f97d7e65-87f5-471e-a120-c04c26394b54', 'Bancos', 'location'::public.property_data_type, 1),
  ('feaee2d1-4cce-48d1-a02d-f773384a5171', 'f97d7e65-87f5-471e-a120-c04c26394b54', 'Oficinas de correos', 'location'::public.property_data_type, 2),
  ('cbe9ec62-6cd2-4999-b0d7-e86d1d79870d', 'f97d7e65-87f5-471e-a120-c04c26394b54', 'Tintorerías', 'location'::public.property_data_type, 3),
  ('81214844-8e80-45bf-a082-b0c72413dff2', 'f97d7e65-87f5-471e-a120-c04c26394b54', 'Lavanderías', 'location'::public.property_data_type, 4),
  ('7257be95-7d6e-43aa-b919-8005c2443f63', 'f97d7e65-87f5-471e-a120-c04c26394b54', 'Peluquerías y Barberías', 'location'::public.property_data_type, 5),
  ('47a64cae-136b-4e93-8752-882c583d3e30', 'f97d7e65-87f5-471e-a120-c04c26394b54', 'Centros de impresión y copiado', 'location'::public.property_data_type, 6),
  ('9e2a6f5d-7c42-4f8c-b7ef-6c4c3e4c2a71', 'f97d7e65-87f5-471e-a120-c04c26394b54', 'Aparcamientos', 'location'::public.property_data_type, 7)
on conflict (id) do update
set
  category_id = excluded.category_id,
  name        = excluded.name,
  type        = excluded.type,
  order_index = excluded.order_index,
  updated_at  = now();

commit;
