SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: ai_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ai_usage" ("id", "user_id", "date", "count", "created_at", "updated_at") FROM stdin;
6eda2380-f436-46dc-aa72-e28703b31a31	2c8b8292-5d6e-497e-9ede-eafe45b07924	2025-05-22	8	2025-05-22 11:18:22.616597+00	2025-05-22 11:18:22.616597+00
d28452ca-b549-4263-8291-ebeea5eac0bc	396199c2-f192-49a1-a7e6-8e2d6709cd94	2025-05-22	1	2025-05-22 18:33:16.615157+00	2025-05-22 18:33:16.615157+00
2bd486f2-b412-4199-b398-4e95ad5a443e	2c8b8292-5d6e-497e-9ede-eafe45b07924	2025-05-23	2	2025-05-23 12:01:12.804691+00	2025-05-23 12:01:12.804691+00
8dbdb1b2-4b09-4216-a492-0ba050f19fc7	396199c2-f192-49a1-a7e6-8e2d6709cd94	2025-05-23	1	2025-05-23 12:33:54.690773+00	2025-05-23 12:33:54.690773+00
be42ee52-db04-406c-9fe5-96d662ab1534	2c8b8292-5d6e-497e-9ede-eafe45b07924	2025-05-26	1	2025-05-26 16:23:17.521359+00	2025-05-26 16:23:17.521359+00
2e474299-4349-40e9-92ef-af83a635bfe0	2c8b8292-5d6e-497e-9ede-eafe45b07924	2025-05-27	1	2025-05-27 15:02:27.674573+00	2025-05-27 15:02:27.674573+00
c7f5c1ac-c995-4f24-a077-a84b53a1e40d	396199c2-f192-49a1-a7e6-8e2d6709cd94	2025-05-29	1	2025-05-29 17:26:34.504549+00	2025-05-29 17:26:34.504549+00
3e6e87e5-4461-44c3-a1a4-227a0a800a4a	5baac7e7-7ee6-4810-9760-7a79a5f7727a	2025-06-30	6	2025-06-30 18:54:01.822059+00	2025-06-30 18:54:01.822059+00
34fabe4f-1ab2-4ba6-9506-95d35b676056	15863c76-fecb-4b87-8cac-8b258892e7d6	2025-07-26	1	2025-07-26 10:06:08.417698+00	2025-07-26 10:06:08.417698+00
c6a257b2-0dd3-438a-962f-2d06e7a43ff9	396199c2-f192-49a1-a7e6-8e2d6709cd94	2025-07-26	1	2025-07-26 12:05:02.036998+00	2025-07-26 12:05:02.036998+00
7d173aa4-ae88-42d3-92a1-a2d09debc868	15863c76-fecb-4b87-8cac-8b258892e7d6	2025-09-16	1	2025-09-16 18:57:29.375586+00	2025-09-16 18:57:29.375586+00
ae0c77d7-36d2-494a-960a-9269044882d3	396199c2-f192-49a1-a7e6-8e2d6709cd94	2025-10-09	2	2025-10-09 09:19:33.800229+00	2025-10-09 09:19:33.800229+00
25ba05d7-da9c-4317-bfb4-919a9b4479d5	396199c2-f192-49a1-a7e6-8e2d6709cd94	2025-10-10	2	2025-10-10 08:13:26.278152+00	2025-10-10 08:13:26.278152+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."categories" ("id", "name", "icon", "order_index", "created_at", "type") FROM stdin;
56e286de-42ec-42f8-b538-a266387f5c7c	Salud y Bienestar	IconHealing	2	2025-04-21 17:11:32.180087+00	location
91125962-2260-4b09-a062-6aad5eff6101	Comida y Bebida	IconForkSpoon	3	2025-04-21 17:11:32.180087+00	location
f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Arte y Cultura	IconMuseum	4	2025-04-21 17:11:32.180087+00	location
d7569f16-3d4d-4e79-ac0e-a11a80b31f6c	Parques y Naturaleza	IconNature	5	2025-04-21 17:11:32.180087+00	location
e9781151-e27a-4c60-9819-49c095f03cd8	Compras	IconShoppingBag	6	2025-04-21 17:11:32.180087+00	location
f97d7e65-87f5-471e-a120-c04c26394b54	Servicios	IconLocalAtm	7	2025-04-21 17:11:32.180087+00	location
5922cd0e-8c11-448f-83c0-e785f83c31f5	Transporte	IconTrain	8	2025-04-21 17:11:32.180087+00	location
d2a4b56f-151b-4151-a006-6f86a7ad6a9a	Atracciones y Turismo	IconComedyMask	10	2025-04-21 17:11:32.180087+00	location
c89d4a51-babd-44d0-acff-de3f3a8fd3db	Seguridad y Emergencias	IconEmergency	11	2025-04-21 17:11:32.180087+00	location
5509834d-c45c-4667-9e8b-960fea63ffc2	Familia y Niños	IconFamilyRestroom	12	2025-04-21 17:11:32.180087+00	location
7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684	Mascotas	IconPets	13	2025-04-21 17:11:32.180087+00	location
81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Entretenimiento y Vida Nocturna	IconNightLife	9	2025-04-21 17:11:32.180087+00	location
4581a08a-3e78-4800-b16c-575f5da81cba	El Alojamiento	IconApartment	1	2025-04-21 17:11:32.180087+00	info
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."properties" ("id", "user_id", "name", "description", "address", "latitude", "longitude", "image_url", "slug", "created_at", "updated_at", "summary") FROM stdin;
19541e45-edf5-402d-9be3-d5aca05e6baa	396199c2-f192-49a1-a7e6-8e2d6709cd94	Madrid a tope		C. Prudencio Álvaro, 34, Cdad. Lineal, 28027 Madrid, Spain	40.4378543	-3.6449489	https://wwclrrykkvsbpzlpavls.supabase.co/storage/v1/object/public/property-images/396199c2-f192-49a1-a7e6-8e2d6709cd94/property_1748452699680.jpg	\N	2025-05-28 17:18:20.642169+00	2025-05-28 17:18:20.642169+00	\N
2467aaa2-b61c-41ee-bfc7-67ba141e2111	2c8b8292-5d6e-497e-9ede-eafe45b07924	MI casa en Madrid		C. de Cyesa, 5, Cdad. Lineal, 28017 Madrid, Spain	40.430208	-3.6589599	\N	\N	2025-05-28 18:01:51.601369+00	2025-05-28 18:01:51.601369+00	\N
37a03a95-cd39-4d40-a22b-7628cbb50245	15863c76-fecb-4b87-8cac-8b258892e7d6	Chueca Chueca		C/ de Hortaleza, 64, Centro, 28004 Madrid, Spain	40.4228445	-3.69903	https://wwclrrykkvsbpzlpavls.supabase.co/storage/v1/object/public/property-images/15863c76-fecb-4b87-8cac-8b258892e7d6/property_1748605017807.jpg	\N	2025-05-30 11:36:58.924369+00	2025-05-30 11:36:58.924369+00	\N
c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	396199c2-f192-49a1-a7e6-8e2d6709cd94	Madrid Ventas		C. de Cyesa, 5, Cdad. Lineal, 28017 Madrid, Spain	40.430208	-3.6589599	\N	\N	2025-05-31 10:39:15.60893+00	2025-05-31 10:39:15.60893+00	\N
006c961b-c837-48b5-899c-691b50d98387	0475ac77-4e4e-41c2-8ab1-1fcf5ccd1fe5	Casa Lolita		Cam. Viejo de Vélez, 21, 29730 Torre de Benagalbón, Málaga, Spain	36.7142256	-4.264954599999999	https://wwclrrykkvsbpzlpavls.supabase.co/storage/v1/object/public/property-images/0475ac77-4e4e-41c2-8ab1-1fcf5ccd1fe5/property_1749793776899.jpeg	\N	2025-06-13 05:49:37.984079+00	2025-06-13 05:49:37.984079+00	\N
2692b6aa-624c-4bc1-81b8-6a2ea22fdfcb	0e55075d-25ab-4072-987b-9f1a126689df	miami		13615 SW 157th Ct, Miami, FL 33196, USA	25.639737	-80.447969	\N	\N	2025-06-18 17:16:33.157246+00	2025-06-18 17:16:33.157246+00	\N
307ef0bd-4363-425b-9a18-aad42fd1c81c	5baac7e7-7ee6-4810-9760-7a79a5f7727a	Casa		C. Bélgica, 38530, Santa Cruz de Tenerife, Spain	28.360718	-16.3682966	\N	\N	2025-06-30 18:53:24.366505+00	2025-06-30 18:53:24.366505+00	\N
5c08b642-ca42-45a1-9791-b6a91aba3cb3	5baac7e7-7ee6-4810-9760-7a79a5f7727a	Cada		C. Bélgica, 38530, Santa Cruz de Tenerife, Spain	28.360718	-16.3682966	\N	\N	2025-06-30 18:59:16.85113+00	2025-06-30 18:59:16.85113+00	\N
ab500dd0-7c0c-4774-9d8d-6e5ef9ddf08c	0a31bd2f-ef5d-4ec0-87dc-41420c722223	Casa 4		2309 S Cameron Ave, Tampa, FL 33629, USA	27.9240187	-82.5133767	\N	\N	2025-12-04 17:46:25.932352+00	2025-12-04 17:46:25.932352+00	\N
\.


--
-- Data for Name: location_groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."location_groups" ("id", "property_id", "category_id", "name", "order_index", "created_at", "updated_at", "slug") FROM stdin;
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."locations" ("id", "group_id", "name", "address", "description", "latitude", "longitude", "website", "phone", "created_at", "updated_at", "property_id", "image_url") FROM stdin;
\.


--
-- Data for Name: sub_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."sub_categories" ("id", "category_id", "name", "created_at", "updated_at", "type", "order_index") FROM stdin;
cd19040f-5160-49ac-b395-adab3ec2d919	4581a08a-3e78-4800-b16c-575f5da81cba	Reciclaje	2025-05-26 07:51:22+00	2025-05-26 07:51:24+00	info	4
a1091bf8-4fe3-4ded-854b-fc08019d9296	4581a08a-3e78-4800-b16c-575f5da81cba	Horario	2025-05-26 07:51:05+00	2025-05-26 07:51:06+00	info	3
d86dd401-9a93-45e8-b4c2-47fa8f46398e	56e286de-42ec-42f8-b538-a266387f5c7c	Hospitales	2025-05-26 07:52:09+00	2025-05-26 07:52:11+00	location	1
0e04b6d5-72be-4f9b-9274-3526ff3f851a	4581a08a-3e78-4800-b16c-575f5da81cba	Wifi	2025-05-26 07:51:39+00	2025-05-26 07:51:41+00	info	5
f6eb90a5-0543-49a2-8619-23912e9c1a33	4581a08a-3e78-4800-b16c-575f5da81cba	Normas de uso	2025-05-26 07:50:40+00	2025-05-26 07:50:42+00	info	2
4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7	4581a08a-3e78-4800-b16c-575f5da81cba	Manual de alojamiento	2025-05-26 07:49:50+00	2025-05-26 07:49:53+00	info	1
a1b814e3-f5f5-4669-84f9-dd06685a2867	56e286de-42ec-42f8-b538-a266387f5c7c	Farmacias	2025-05-26 07:52:28+00	2025-05-26 07:52:29+00	location	2
9a39fc67-6908-49d7-ad7b-b03c4b4a17ec	56e286de-42ec-42f8-b538-a266387f5c7c	Urgencias	2025-05-26 07:52:45+00	2025-05-26 07:52:46+00	location	3
b8c955ca-9c59-4e63-a4a8-d12721200a9b	56e286de-42ec-42f8-b538-a266387f5c7c	Cuidado dental	2025-05-26 07:53:00+00	2025-05-26 07:53:02+00	location	4
c8b9fc21-434b-4bc3-b6b5-0543e3b6acfd	56e286de-42ec-42f8-b538-a266387f5c7c	Masajes y Spa	2025-05-26 07:53:20+00	2025-05-26 07:53:21+00	location	5
458a6ca7-1af3-4a64-8335-8c2c5dbaad9f	56e286de-42ec-42f8-b538-a266387f5c7c	Fisioterapia	2025-05-26 07:53:34+00	2025-05-26 07:53:36+00	location	6
042505e9-7485-41cb-9895-d3ccd2028ad7	56e286de-42ec-42f8-b538-a266387f5c7c	Gimnasios	2025-05-26 07:54:11+00	2025-05-26 07:54:12+00	location	7
13574fdb-f91c-440d-854a-ab037bded19f	56e286de-42ec-42f8-b538-a266387f5c7c	Yoga	2025-05-26 07:54:28+00	2025-05-26 07:54:29+00	location	8
39b17b02-0b43-4490-9c5f-373b6f1c6eea	56e286de-42ec-42f8-b538-a266387f5c7c	Salud Mental	2025-05-26 07:54:45+00	2025-05-26 07:54:47+00	location	9
8028b58d-6024-42dc-a4e2-2ff2caa27e56	5509834d-c45c-4667-9e8b-960fea63ffc2	Restaurantes para niños	2025-05-26 08:14:22+00	2025-05-26 08:14:23+00	location	1
b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	91125962-2260-4b09-a062-6aad5eff6101	Restaurantes	2025-05-26 07:55:14+00	2025-05-26 07:55:16+00	location	1
45d9b160-4619-4e99-a9eb-f0c86768eb6e	91125962-2260-4b09-a062-6aad5eff6101	Cafeterías	2025-05-26 07:56:23+00	2025-05-26 07:56:24+00	location	2
7d77f635-9897-4ab0-8801-c3939a7f366b	91125962-2260-4b09-a062-6aad5eff6101	Panaderías	2025-05-26 07:56:40+00	2025-05-26 07:56:42+00	location	3
b7f98f6d-0f44-4702-8ead-138342382694	91125962-2260-4b09-a062-6aad5eff6101	Bares	2025-05-26 07:57:17+00	2025-05-26 07:57:18+00	location	5
915e4916-4726-4e95-950a-42057280a00c	91125962-2260-4b09-a062-6aad5eff6101	Comida rápida	2025-05-26 07:57:00+00	2025-05-26 07:57:01+00	location	4
339a71f4-265e-4792-8d2a-f027bf69784b	91125962-2260-4b09-a062-6aad5eff6101	Pubs	2025-05-26 07:58:34+00	2025-05-26 07:58:35+00	location	6
eebdb669-57f0-4039-b6a9-b5b2e4158a5f	91125962-2260-4b09-a062-6aad5eff6101	Cervecerías	2025-05-26 07:58:51+00	2025-05-26 07:58:52+00	location	7
f5fc055e-5d6e-451e-bede-4e0db4ec74eb	91125962-2260-4b09-a062-6aad5eff6101	Bares de Vinos	2025-05-26 07:59:06+00	2025-05-26 07:59:08+00	location	8
a66d2683-ced1-49ba-b60b-ee7befa6bf1f	91125962-2260-4b09-a062-6aad5eff6101	Camiones de comida	2025-05-26 07:59:24+00	2025-05-26 07:59:25+00	location	9
370681cd-d2fa-4b2c-9224-0eb796eb25ba	f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Museos	2025-05-26 07:59:48+00	2025-05-26 07:59:49+00	location	1
5a994cdf-55bc-42f8-b2cc-2f7d32359317	f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Galerías de arte	2025-05-26 08:00:03+00	2025-05-26 08:00:05+00	location	2
164448b8-7b5c-4875-a652-37e042456d2d	f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Teatros	2025-05-26 08:00:19+00	2025-05-26 08:00:20+00	location	3
d67c6e6e-9cca-4daa-b382-d458360a066d	f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Sitios históricos	2025-05-26 08:00:55+00	2025-05-26 08:00:56+00	location	5
d61355ba-adf6-49c6-8467-4037e0c3e978	f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Monumentos	2025-05-26 08:01:09+00	2025-05-26 08:01:10+00	location	6
3577e70e-5f21-46d1-b067-f4926e1936a8	f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Bibliotecas	2025-05-26 08:01:24+00	2025-05-26 08:01:25+00	location	7
bb50ff5f-ad12-4467-90b9-fa2123f5ac49	f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Centros culturales	2025-05-26 08:01:39+00	2025-05-26 08:01:41+00	location	8
ecd1752b-f8f4-4e6b-939b-a15586675b1f	d7569f16-3d4d-4e79-ac0e-a11a80b31f6c	Parques urbanos	2025-05-26 08:02:12+00	2025-05-26 08:02:14+00	location	1
2317985d-6b46-4391-a880-48090c95c9d3	d7569f16-3d4d-4e79-ac0e-a11a80b31f6c	Parques infantiles	2025-05-26 08:02:30+00	2025-05-26 08:02:31+00	location	2
57caef2f-6402-43b4-9b8f-303f3cb9ab75	d7569f16-3d4d-4e79-ac0e-a11a80b31f6c	Jardines botánicos	2025-05-26 08:02:46+00	2025-05-26 08:02:47+00	location	3
9fa589e5-a339-4cb6-9c7e-909e844d41ba	d7569f16-3d4d-4e79-ac0e-a11a80b31f6c	Senderos	2025-05-26 08:03:01+00	2025-05-26 08:03:02+00	location	4
01dcc1a2-fe62-4de8-822e-caba49c50f3c	d7569f16-3d4d-4e79-ac0e-a11a80b31f6c	Playas	2025-05-26 08:03:15+00	2025-05-26 08:03:16+00	location	5
9c1f3552-494d-464f-b4dd-bb161e6a6e47	d7569f16-3d4d-4e79-ac0e-a11a80b31f6c	Reservas naturales	2025-05-26 08:03:47+00	2025-05-26 08:03:48+00	location	7
c1059558-561f-4720-805e-6468f73cf29c	e9781151-e27a-4c60-9819-49c095f03cd8	Supermercados	2025-05-26 08:04:05+00	2025-05-26 08:04:06+00	location	1
e25bdb0a-0111-48a9-8fbf-c470910ee001	e9781151-e27a-4c60-9819-49c095f03cd8	Mercados de agricultores	2025-05-26 08:04:23+00	2025-05-26 08:04:24+00	location	2
e5ca0ca4-cf59-4c0f-82ef-45a063075e9d	e9781151-e27a-4c60-9819-49c095f03cd8	Centros comerciales	2025-05-26 08:04:38+00	2025-05-26 08:04:40+00	location	3
35b50848-fa18-4a21-bbe0-0229dbe13102	e9781151-e27a-4c60-9819-49c095f03cd8	Boutiques	2025-05-26 08:04:58+00	2025-05-26 08:04:59+00	location	4
0928801b-9908-46a6-95bf-3f9d0bee0251	e9781151-e27a-4c60-9819-49c095f03cd8	Souvenirs	2025-05-26 08:05:25+00	2025-05-26 08:05:27+00	location	5
3dbd739f-b111-49a4-9a01-fdbcf58d91a7	e9781151-e27a-4c60-9819-49c095f03cd8	Mercadillos	2025-05-26 08:05:39+00	2025-05-26 08:05:40+00	location	6
b687c3eb-a033-4982-ae47-236697e027b1	f97d7e65-87f5-471e-a120-c04c26394b54	Bancos	2025-05-26 08:05:58+00	2025-05-26 08:05:59+00	location	1
cbe9ec62-6cd2-4999-b0d7-e86d1d79870d	f97d7e65-87f5-471e-a120-c04c26394b54	Tintorerías	2025-05-26 08:06:25+00	2025-05-26 08:06:27+00	location	3
81214844-8e80-45bf-a082-b0c72413dff2	f97d7e65-87f5-471e-a120-c04c26394b54	Lavanderías	2025-05-26 08:06:41+00	2025-05-26 08:06:42+00	location	4
7257be95-7d6e-43aa-b919-8005c2443f63	f97d7e65-87f5-471e-a120-c04c26394b54	Peluquerías y Barberías	2025-05-26 08:07:06+00	2025-05-26 08:07:07+00	location	5
47a64cae-136b-4e93-8752-882c583d3e30	f97d7e65-87f5-471e-a120-c04c26394b54	Centros de impresión y copiado	2025-05-26 08:07:22+00	2025-05-26 08:07:24+00	location	6
8760d066-d6c1-468f-80ab-b0dcae430af1	5922cd0e-8c11-448f-83c0-e785f83c31f5	Paradas de autobús	2025-05-26 08:07:41+00	2025-05-26 08:07:42+00	location	1
4404e048-02fe-469a-bcf0-69ff62fdd8ce	5922cd0e-8c11-448f-83c0-e785f83c31f5	Estaciones de tren	2025-05-26 08:08:15+00	2025-05-26 08:08:17+00	location	3
0c9e0152-f4fa-409c-a28a-c1984d05518f	5922cd0e-8c11-448f-83c0-e785f83c31f5	Alquiler de bicicletas	2025-05-26 08:08:31+00	2025-05-26 08:08:33+00	location	4
a113f5c3-b32a-439f-961f-851c767f5bd5	5922cd0e-8c11-448f-83c0-e785f83c31f5	Estaciones de metro	2025-05-26 08:07:58+00	2025-05-26 08:07:59+00	location	2
ec589527-2da7-4228-81c9-aaab84fd9d64	5922cd0e-8c11-448f-83c0-e785f83c31f5	Terminales de ferry	2025-05-26 08:09:05+00	2025-05-26 08:09:06+00	location	6
6ed3e4bf-1ff5-4d50-bebe-a7ae2f9edd8e	5922cd0e-8c11-448f-83c0-e785f83c31f5	Paradas de taxi	2025-05-26 08:09:20+00	2025-05-26 08:09:21+00	location	7
70a80113-e4cf-487b-8e39-bc5ed5fe7588	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Discotecas	2025-05-26 08:09:37+00	2025-05-26 08:09:38+00	location	1
a18fa330-50fc-43a9-8edd-da8cdf3d0f06	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Casinos	2025-05-26 08:09:50+00	2025-05-26 08:09:52+00	location	2
ea0406ab-18c7-48b4-976d-e016629ed7a0	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Clubes de comedia	2025-05-26 08:10:05+00	2025-05-26 08:10:06+00	location	3
d672053e-dc92-4e88-bf47-aab0bc18adfa	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Karaoke	2025-05-26 08:10:17+00	2025-05-26 08:10:18+00	location	4
4619002a-2e62-4fcf-8573-91727d106405	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Cines	2025-05-26 08:10:29+00	2025-05-26 08:10:30+00	location	5
d2f95ecd-deb9-42d4-aa8d-4d9f7d84c368	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Boleras	2025-05-26 08:10:56+00	2025-05-26 08:10:58+00	location	7
004ced32-64dd-4ab0-8f7d-d241bfecbd4c	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Arcades	2025-05-26 08:11:08+00	2025-05-26 08:11:09+00	location	8
ae04421f-8507-4ec4-bd9c-52b2229e40d3	d2a4b56f-151b-4151-a006-6f86a7ad6a9a	Parques acuáticos	2025-05-26 08:12:40+00	2025-05-26 08:12:41+00	location	5
a7a480f3-895c-48a1-8ae8-7fc8a57c1d10	c89d4a51-babd-44d0-acff-de3f3a8fd3db	Estaciones de policía	2025-05-26 08:13:16+00	2025-05-26 08:13:17+00	location	1
e41e0fb7-bb65-4d62-998e-13ba9a6c684e	c89d4a51-babd-44d0-acff-de3f3a8fd3db	Estaciones de bomberos	2025-05-26 08:13:30+00	2025-05-26 08:13:31+00	location	2
4682133f-e202-4620-bc2c-fa2d0921a231	c89d4a51-babd-44d0-acff-de3f3a8fd3db	Clínicas de emergencia	2025-05-26 08:13:43+00	2025-05-26 08:13:46+00	location	3
7ffc6b69-5684-4385-9f05-0ba196b409ca	d2a4b56f-151b-4151-a006-6f86a7ad6a9a	Tours guiados	2025-05-26 08:12:57+00	2025-05-26 08:12:58+00	location	6
da84c886-c6a6-4d5b-8148-657d6802bbb8	5509834d-c45c-4667-9e8b-960fea63ffc2	Museos infantiles	2025-05-26 08:15:02+00	2025-05-26 08:15:04+00	location	4
bdf47ef5-710c-4f2d-aa6a-b40c45148b11	5509834d-c45c-4667-9e8b-960fea63ffc2	Jugueterías	2025-05-26 08:14:49+00	2025-05-26 08:14:50+00	location	3
fbac7bca-a33f-42fb-a266-cd5931f6f24b	d2a4b56f-151b-4151-a006-6f86a7ad6a9a	Miradores	2025-05-26 08:11:57+00	2025-05-26 08:11:59+00	location	3
5fd95b33-2992-4e8c-88d4-0bb295e93994	7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684	Peluquerías	2025-05-26 08:16:06+00	2025-05-26 08:16:08+00	location	3
4c893118-197b-437d-bb91-3952b8b7b45e	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	Salas de escape	2025-05-26 08:10:43+00	2025-05-26 08:10:45+00	location	6
49c9294a-409a-4e28-80a4-da0aa48906c4	7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684	Tiendas de mascotas	2025-05-26 08:15:25+00	2025-05-26 08:15:27+00	location	1
17f95bb5-1a11-45da-9d60-adad0cb6a13d	7afd50dd-e1ea-41e8-9f2f-77ad9c4fe684	Veterinarios	2025-05-26 08:15:38+00	2025-05-26 08:15:39+00	location	2
2db703c0-922e-4642-a5b9-8fda4b73c613	d2a4b56f-151b-4151-a006-6f86a7ad6a9a	Lugares emblemáticos	2025-05-26 08:11:45+00	2025-05-26 08:11:46+00	location	2
3725a152-dfeb-4041-9b60-e0564c13384a	c89d4a51-babd-44d0-acff-de3f3a8fd3db	Embajadas	2025-05-26 08:14:03+00	2025-05-26 08:14:04+00	location	4
84d10573-0cef-4cda-bbc7-d9d8c902069f	f3262d3d-5bfb-4dc3-91c7-33afc885fd3e	Salas de conciertos	2025-05-26 08:00:35+00	2025-05-26 08:00:37+00	location	4
b7639fff-d280-411f-a426-f1eddeb73b55	d7569f16-3d4d-4e79-ac0e-a11a80b31f6c	Zoológicos y Acuarios	2025-05-26 08:03:31+00	2025-05-26 08:03:32+00	location	6
feaee2d1-4cce-48d1-a02d-f773384a5171	f97d7e65-87f5-471e-a120-c04c26394b54	Oficinas de correos	2025-05-26 08:06:12+00	2025-05-26 08:06:13+00	location	2
5cae1a6d-305c-430f-926e-46c0bd763ffa	5922cd0e-8c11-448f-83c0-e785f83c31f5	Alquiler de scooters	2025-05-26 08:08:47+00	2025-05-26 08:08:49+00	location	5
7ad70a98-6d4d-473a-8d5b-e9c12af02976	d2a4b56f-151b-4151-a006-6f86a7ad6a9a	Atracciones turísticas	2025-05-26 08:11:29+00	2025-05-26 08:11:30+00	location	1
bcc4d5f2-a406-492d-a680-b5a9cd8c9886	d2a4b56f-151b-4151-a006-6f86a7ad6a9a	Parques temáticos	2025-05-26 08:12:22+00	2025-05-26 08:12:24+00	location	4
01f16e27-fba9-4ee5-9eb8-9b948c235de2	5509834d-c45c-4667-9e8b-960fea63ffc2	Centros de juegos interiores	2025-05-26 08:14:37+00	2025-05-26 08:14:38+00	location	2
\.


--
-- Data for Name: property_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."property_data" ("id", "user_id", "property_id", "category_id", "sub_category_id", "type", "name", "description", "latitude", "longitude", "image_url", "address", "featured", "created_at", "updated_at") FROM stdin;
62d1a4ca-a201-48c4-bb3a-d67d700d2969	0475ac77-4e4e-41c2-8ab1-1fcf5ccd1fe5	006c961b-c837-48b5-899c-691b50d98387	4581a08a-3e78-4800-b16c-575f5da81cba	4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7	info	\N	🤗 Bienvenido a nuestra guía de Casa Lolita. \r\nPor favor sigue 	\N	\N	\N	\N	f	2025-06-13 06:17:08.926407+00	2025-06-13 06:19:47.587+00
0e1e73ac-0a3b-45ac-9612-1c20484ed8fd	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Cafeteria Fanatico		40.4390789	-3.6291818	\N	Calle de Alfonso Gómez, 15, Madrid	t	2025-05-29 17:28:30.972+00	2025-05-29 17:28:30.972+00
a3ed5402-010b-4810-b8d8-96a93bff63ee	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Chocoplanet		40.44151989999999	-3.6540497	\N	Calle de Pablo Sánchez, 4, Madrid	f	2025-06-14 09:27:52.523+00	2025-06-14 09:27:52.523+00
4c0cc696-44dc-4cc0-86c8-f60912f48ad8	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	El almuerzo		40.4420905	-3.6564424	\N	Calle del Caribe, 2, Madrid	f	2025-06-14 09:27:52.523+00	2025-06-14 09:27:52.523+00
404ceeaa-b224-4754-8072-f1f0b4958cdb	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Bar-Cafeteria “La Tienda “		40.4378004	-3.646525200000001	\N	Calle Hermanos de Pablo, 45, Madrid	f	2025-06-14 09:27:52.523+00	2025-06-14 09:27:52.523+00
6399ffae-b682-4002-af5f-64221469a25c	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Perla del Pacífico		40.4315534	-3.6565215	\N	Calle de Ángel González Tejedor, 5, Madrid	f	2025-05-29 17:28:30.972+00	2025-05-29 17:28:30.972+00
b59cd9cc-9d92-4e35-97a1-92ba0936b0af	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	8760d066-d6c1-468f-80ab-b0dcae430af1	location	Sevilla		40.41736	-3.70013	\N	Spain	f	2025-06-14 10:16:04.81+00	2025-06-14 10:16:04.81+00
6a200572-bd44-47c7-a7c1-5092c50c8e1c	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	8760d066-d6c1-468f-80ab-b0dcae430af1	location	Metro Colón		40.4258751	-3.691961799999999	\N	Spain	f	2025-06-14 10:16:04.81+00	2025-06-14 10:16:04.81+00
d0ca20e0-3b64-4309-b1d6-224fa74ad1f9	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	8760d066-d6c1-468f-80ab-b0dcae430af1	location	Luchana		40.43044	-3.70042	\N	Spain	f	2025-06-14 10:16:04.81+00	2025-06-14 10:16:04.81+00
bf9b5010-9429-41fd-8de6-cc9dcb4257c5	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	8760d066-d6c1-468f-80ab-b0dcae430af1	location	Carranza		40.4295798	-3.704955799999999	\N	Spain	f	2025-06-14 10:16:04.81+00	2025-06-14 10:16:04.81+00
56cbbd93-afad-4d2a-95f7-466a55a39350	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	8760d066-d6c1-468f-80ab-b0dcae430af1	location	Gran Vía - Pedro Zerolo		40.4199184	-3.6999404	\N	Spain	f	2025-06-14 10:16:04.81+00	2025-06-14 10:16:04.81+00
a1124b8e-560f-4867-89a0-f349a07eada9	5baac7e7-7ee6-4810-9760-7a79a5f7727a	5c08b642-ca42-45a1-9791-b6a91aba3cb3	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	Plan Bakery Café		28.3560856	-16.3703896	\N	Calle Alcalde Juan Castellano Castellano, 23, Candelaria	f	2025-06-30 19:01:28.563+00	2025-06-30 19:01:28.563+00
7eceeae0-fdb6-4116-b729-304a5d76ea5a	5baac7e7-7ee6-4810-9760-7a79a5f7727a	5c08b642-ca42-45a1-9791-b6a91aba3cb3	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	Restaurante Tasca El Trasiego		28.3617659	-16.3679794	\N	Rambla de los Menceyes, Candelaria	f	2025-06-30 19:01:28.563+00	2025-06-30 19:01:28.563+00
fed72e89-34e2-44f9-86be-5d1af5ee08a0	5baac7e7-7ee6-4810-9760-7a79a5f7727a	5c08b642-ca42-45a1-9791-b6a91aba3cb3	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	PIZZOLO		28.3613157	-16.3665456	\N	Edificio Brisamar 2, Calle Batayola, 1, Candelaria	f	2025-06-30 19:01:28.563+00	2025-06-30 19:01:28.563+00
fb9ecf18-6717-4741-b792-6b83924076e1	5baac7e7-7ee6-4810-9760-7a79a5f7727a	5c08b642-ca42-45a1-9791-b6a91aba3cb3	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	Bar Cofradía de Pescadores Ntra.Sra. de Candelaria		28.357921	-16.3683294	\N	Calle la Piscina, S/N, Candelaria	t	2025-06-30 19:01:28.563+00	2025-06-30 19:01:28.563+00
426f6a9c-5d63-4033-8b1c-0ee8b36b70a6	0a31bd2f-ef5d-4ec0-87dc-41420c722223	ab500dd0-7c0c-4774-9d8d-6e5ef9ddf08c	4581a08a-3e78-4800-b16c-575f5da81cba	4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7	info	\N	Ahhhhh	\N	\N	\N	\N	f	2025-12-04 17:46:48.466471+00	2025-12-04 17:46:48.466471+00
494b2488-ca96-4a1e-904e-f952492915da	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Cervecería Hevia		40.4384228	-3.6356031	\N	Calle Alcalá, 440, LOCAL, Madrid	t	2025-05-29 17:28:30.972+00	2025-05-29 17:28:30.972+00
69b03e4e-c7a6-4633-8ff4-dc33592683e3	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Restaurante Los Montes de Galicia		40.4346777	-3.668364	\N	Calle de Azcona, 46, Madrid	f	2025-06-06 23:45:05.177+00	2025-06-06 23:45:05.177+00
eaa7a39e-9eab-4620-85f5-cc13535239b5	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	4581a08a-3e78-4800-b16c-575f5da81cba	4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7	info	\N	Esta muela es para es para el manual de usuario	\N	\N	\N	\N	f	2025-05-29 17:25:11.356654+00	2025-05-29 17:25:11.356654+00
08fd8434-620d-4b72-a5ca-5fb2f59df26c	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	4581a08a-3e78-4800-b16c-575f5da81cba	f6eb90a5-0543-49a2-8619-23912e9c1a33	info	\N	¡Bienvenido a nuestra propiedad! Para que tu estadía sea lo más agradable posible, te pedimos que respetes estas sencillas normas:\r\n1. Por favor, respeta el horario de silencio de 10 p.m. a 8 a.m.\r\n2. No se permite fumar dentro de la casa ni en áreas comunes.\r\n3. Si traes mascotas, asegúrate de recoger sus desechos.\r\n4. Utiliza los electrodomésticos y aparatos con cuidado.\r\n5. No están permitidas las fiestas ni eventos en la propiedad.\r\n\r\nSi tienes alguna duda o necesitas algo durante tu estadía, no dudes en comunicarte con nosotros. ¡Esperamos que disfrutes tu tiempo en nuestra propiedad!	\N	\N	\N	\N	f	2025-05-29 17:26:55.671982+00	2025-05-29 17:26:55.671982+00
3c5bbb08-3392-45ce-bc6f-b22ef85432e7	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	La Esquina de los More		40.43053549999999	-3.6404691	\N	Calle de Ascao, 31, Madrid	f	2025-05-29 17:28:30.972+00	2025-05-29 17:28:30.972+00
96726865-3acd-4243-ba71-700dec8c1b5a	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Isamar		40.43218209999999	-3.642101199999999	\N	Calle de Emilio Ferrari, 42, Madrid	f	2025-05-29 17:28:30.972+00	2025-05-29 17:28:30.972+00
4412c9ea-eb80-4919-9904-e6940a91c9bc	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Movistar Arena Madrid		40.42387859999999	-3.6717512	\N	Avenida de Felipe II, s/n, Madrid	f	2025-05-31 11:57:47.062+00	2025-05-31 11:57:47.062+00
12d60428-c177-4e2f-9170-277f48451ca5	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Restaurante Ogrelo		40.41944469999999	-3.6742675	\N	Calle de Menorca, 39, Madrid	f	2025-05-31 11:57:47.062+00	2025-05-31 11:57:47.062+00
c4250e0e-f9cc-49ae-a419-dd94162ee275	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Restaurante Rías Bajas		40.4425801	-3.6711912	\N	Calle Alustante, 11, Calle de Clara del Rey, 33, Posterior, Madrid	f	2025-05-31 11:57:47.062+00	2025-05-31 11:57:47.062+00
eda9ed97-3e4e-4bdf-8e0d-4448ca81415c	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Tandoori Station		40.4298444	-3.670925	\N	Calle de José Ortega y Gasset, 89, 91, Madrid	f	2025-05-31 11:57:47.062+00	2025-05-31 11:57:47.062+00
5d107d2c-177c-440c-b07c-4f51958622ee	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	TreZe Restaurante		40.426798	-3.6783377	\N	Calle del General Pardiñas, 34, Madrid	f	2025-05-31 11:57:47.062+00	2025-05-31 11:57:47.062+00
69259280-7a0f-45d9-bdaf-188d99c30974	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	5922cd0e-8c11-448f-83c0-e785f83c31f5	8760d066-d6c1-468f-80ab-b0dcae430af1	location	Pueblo Nuevo		40.43569	-3.64282	\N	Spain	f	2025-05-29 17:30:08.506+00	2025-05-29 17:30:08.506+00
30b026e6-ee0f-4f54-b8e5-0bd2410e372b	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	5922cd0e-8c11-448f-83c0-e785f83c31f5	8760d066-d6c1-468f-80ab-b0dcae430af1	location	Ciudad Lineal		40.43790800000001	-3.638060199999999	\N	Spain	f	2025-05-29 17:30:08.506+00	2025-05-29 17:30:08.506+00
f593fb04-3e58-40f9-995c-83b2fa75a10d	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	5922cd0e-8c11-448f-83c0-e785f83c31f5	8760d066-d6c1-468f-80ab-b0dcae430af1	location	Barrio de la Concepción		40.43886450000001	-3.6516135	\N	Spain	t	2025-05-29 17:30:08.506+00	2025-05-29 17:30:08.506+00
c463837f-adf2-4754-8fe5-5e1a6b5056cf	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	4581a08a-3e78-4800-b16c-575f5da81cba	4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7	info	\N	¡Bienvenid@!\r\nNos alegra que hayas elegido quedarte con nosotros. Este manual está diseñado para ayudarte a conocer todos los detalles prácticos de tu estancia, resolver dudas frecuentes y garantizar una experiencia cómoda y respetuosa para todos.\r\n\r\nAquí encontrarás información clave sobre:\r\n- Normas básicas de convivencia\r\n- Horarios de entrada y salida\r\n- Conexión a internet\r\n- Sistema de reciclaje\r\n- Uso de electrodomésticos y zonas comunes\r\n- Qué hacer en caso de emergencia\r\n\r\nPor favor, dedica unos minutos a leerlo. Nuestra intención es ofrecerte un espacio agradable, seguro y cuidado, y tu colaboración es esencial para mantenerlo así.	\N	\N	\N	\N	f	2025-05-30 11:42:41.400655+00	2025-05-30 11:42:41.400655+00
8f07bee5-1461-4b7a-8773-e82d6062564a	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	4581a08a-3e78-4800-b16c-575f5da81cba	f6eb90a5-0543-49a2-8619-23912e9c1a33	info	\N	Estas normas están pensadas para asegurar la buena convivencia y el respeto por el espacio y el resto de vecinos.\r\n\r\n- Respeto por el descanso: Evita ruidos fuertes entre las 22:00 y las 08:00.\r\n- Visitas: Puedes recibir visitas puntuales, pero no se permiten pernoctaciones sin autorización.\r\n- Fumar: Está prohibido fumar dentro del alojamiento. Puedes hacerlo en balcones o zonas exteriores si las hay.\r\n- Mascotas: Solo se admiten si se ha acordado previamente.\r\n- Limpieza y orden: Por favor, mantén el alojamiento en condiciones razonables durante tu estancia.\r\n- Elementos comunes: Si usas espacios compartidos (como terraza o patio), asegúrate de dejarlos como los encontraste.	\N	\N	\N	\N	f	2025-05-30 11:44:45.690833+00	2025-05-30 11:44:45.690833+00
28633d51-76f4-4861-aa69-46da3881b89b	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	4581a08a-3e78-4800-b16c-575f5da81cba	a1091bf8-4fe3-4ded-854b-fc08019d9296	info	\N	- Check-in: A partir de las 15:00\r\n- Check-out: Hasta las 11:00\r\n\r\nSi necesitas ajustar estos horarios, háznoslo saber con antelación. Siempre que sea posible, intentaremos adaptarnos.\r\n\r\nDurante tu estancia, te pedimos respetar los horarios de descanso del edificio:\r\n- Silencio nocturno: de 22:00 a 08:00	\N	\N	\N	\N	f	2025-05-30 11:45:32.10356+00	2025-05-30 11:45:32.10356+00
f890bf5e-503c-42a8-aad8-fab35ae06e9a	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	4581a08a-3e78-4800-b16c-575f5da81cba	cd19040f-5160-49ac-b395-adab3ec2d919	info	\N	Queremos cuidar del entorno, por eso te pedimos seguir estas indicaciones:\r\n\r\n- Amarillo: envases (plásticos, latas, bricks)\r\n- Azul: papel y cartón\r\n- Verde: vidrio\r\n- Gris: resto de residuos\r\n\r\nEn la cocina encontrarás cubos diferenciados. Por favor, vacíalos con regularidad en los contenedores de la calle (en la esquina de Calle X con Calle Y).\r\n\r\nGracias por contribuir a un barrio más limpio y sostenible 💚	\N	\N	\N	\N	f	2025-05-30 11:46:08.179883+00	2025-05-30 11:46:08.179883+00
93acbfe9-7649-4d12-88de-f4c5d75a250a	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	4581a08a-3e78-4800-b16c-575f5da81cba	0e04b6d5-72be-4f9b-9274-3526ff3f851a	info	\N	Estás conectado 😉\r\n\r\n- Red: ChuecaHome\r\n- Contraseña: Bienvenido2025\r\n\r\nSi tienes cualquier problema con la conexión, no dudes en contactarnos.	\N	\N	\N	\N	f	2025-05-30 11:46:31.223053+00	2025-05-30 11:46:31.223053+00
6acb2098-f14e-478d-a4e4-b6ec53047b34	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	Le Boost - Dermatología y Medicina Estética		40.4212068	-3.6976089	\N	Calle de San Marcos, 34, Madrid	f	2025-05-30 11:46:58.995+00	2025-05-30 11:46:58.995+00
93ec3fc8-7694-498b-8e5f-053b00fd8ab7	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	Clínica Dra. Sandra de Oliveira		40.4168175	-3.6906517	\N	Calle de Antonio Maura, 7, Bajo Derecha, Madrid	f	2025-05-30 11:46:58.995+00	2025-05-30 11:46:58.995+00
dd21c88a-5d3c-4044-9d81-6e87dc4cb6ca	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	a1b814e3-f5f5-4669-84f9-dd06685a2867	location	Farmacia La Victoria		40.4159129	-3.7017388	\N	Calle de la Victoria, 6, Madrid	f	2025-05-30 11:47:17.842+00	2025-05-30 11:47:17.842+00
f6054633-9db1-4eab-b842-e72bfeb2e9ce	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	a1b814e3-f5f5-4669-84f9-dd06685a2867	location	Pharmacy Jardines Lucía Milans del Bosch		40.4189861	-3.701038	\N	Calle de los Jardines, 11, Madrid	f	2025-05-30 11:47:17.842+00	2025-05-30 11:47:17.842+00
4b060e3d-e89f-4679-b531-f28d4e2b008f	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	a1b814e3-f5f5-4669-84f9-dd06685a2867	location	Farmacia San Antón		40.4229685	-3.6990626	\N	Calle de Hortaleza, 66, Madrid	f	2025-05-30 11:47:17.842+00	2025-05-30 11:47:17.842+00
767e871a-123e-4783-8254-afe1c2044547	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Petit Palace Santa Barbara		40.4264258	-3.696379599999999	\N	Plaza de Santa Bárbara, 10, Madrid	f	2025-05-30 11:47:46.213+00	2025-05-30 11:47:46.213+00
091cc405-3810-4ea7-b270-d9e4566f3b4d	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Jamón Market		40.4267808	-3.673860599999999	\N	Calle de Alcántara, 14, Madrid	f	2025-06-14 09:27:52.523+00	2025-06-14 09:27:52.523+00
4ffd0fc6-8e59-410e-9f3c-9ec0e4ac2a54	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Petit Palace Chueca		40.420354	-3.7011024	\N	Calle de Hortaleza, 3, Madrid	f	2025-05-30 11:47:46.213+00	2025-05-30 11:47:46.213+00
0c10101b-bdad-476e-8768-98e8b555fe38	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Hospes Puerta de Alcalá		40.4206199	-3.689281300000001	\N	Plaza de la Independencia, 3, Madrid	f	2025-05-30 11:47:46.213+00	2025-05-30 11:47:46.213+00
b0676a38-17c4-46ee-8164-6be6c772f228	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Miyama Restaurant		40.42222219999999	-3.71	\N	Calle de la Flor Baja, 5, Madrid	f	2025-05-30 11:47:46.213+00	2025-05-30 11:47:46.213+00
79951dd9-7e28-45ee-8078-14a531834dc1	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Lamucca de Pez		40.42333199999999	-3.703871399999999	\N	Plaza de Carlos Cambronero, 4, Madrid	t	2025-05-30 11:47:46.213+00	2025-05-30 11:47:46.213+00
cacd4c9b-7809-493a-9f6a-919c630450e4	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	RIBS ABADA		40.4193231	-3.704118599999999	\N	Calle de la Abada, 8, Madrid	t	2025-05-30 11:47:46.213+00	2025-05-30 11:47:46.213+00
994dca47-5d3a-4c96-842f-73cdc6922781	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Intelier Palacio San Martín		40.4186427	-3.7067589	\N	Plaza de San Martín, 5, Madrid	f	2025-05-30 11:47:46.213+00	2025-05-30 11:48:32.447+00
1d05fe83-d414-4545-b88b-e0c3dfcc66b1	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Tipos Infames. Libros y vinos		40.4246957	-3.7011121	\N	Calle de San Joaquín, 3, Madrid	f	2025-05-30 11:48:32.447+00	2025-05-30 11:48:32.447+00
f306a072-603d-473c-a200-2da3da71b070	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Carmencita Brunch		40.4261315	-3.7079092	\N	Calle de San Vicente Ferrer, 57, Madrid	f	2025-05-30 11:48:32.447+00	2025-05-30 11:48:32.447+00
219eb9b7-e3cc-4747-b149-7a0cbdd091ad	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b7f98f6d-0f44-4702-8ead-138342382694	location	Tablao Flamenco 1911		40.4149873	-3.7014214	\N	Plaza de Santa Ana, 15, Madrid	f	2025-05-30 11:48:53.387+00	2025-05-30 11:48:53.387+00
f24cb124-62f4-4c90-94d3-dd7ac2a021db	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b7f98f6d-0f44-4702-8ead-138342382694	location	La Musa Malasaña		40.42881359999999	-3.7043854	\N	Calle de Manuela Malasaña, 18, Madrid	f	2025-05-30 11:48:53.387+00	2025-05-30 11:48:53.387+00
08b1b716-3bc6-4877-941a-5b9df1b81f59	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b7f98f6d-0f44-4702-8ead-138342382694	location	Casa Labra		40.41717239999999	-3.704593	\N	Calle de Tetuán, 12, Madrid	f	2025-05-30 11:48:53.387+00	2025-05-30 11:48:53.387+00
b135abd7-42e5-42d2-a158-6af224656dc6	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	VP Jardín de Recoletos		40.4223075	-3.689168100000001	\N	Calle de Gil de Santivañes, 6, Madrid	f	2025-06-06 23:45:05.177+00	2025-06-06 23:45:05.177+00
af668981-8db6-4afb-b906-fec254e26024	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b7f98f6d-0f44-4702-8ead-138342382694	location	Casa Julio		40.4242824	-3.703693000000001	\N	Calle de la Madera, 37, Madrid	f	2025-05-30 11:48:53.387+00	2025-05-30 11:48:53.387+00
c2bae20a-43fd-4070-a965-3bde5ff9825a	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b7f98f6d-0f44-4702-8ead-138342382694	location	Beer Station		40.41968719999999	-3.7084798	\N	Cuesta de Santo Domingo, 22, Madrid	f	2025-05-30 11:48:53.387+00	2025-05-30 11:48:53.387+00
8b6a4315-34bc-4743-8cc5-d0c8637f97ac	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b7f98f6d-0f44-4702-8ead-138342382694	location	James Joyce Irish Pub Madrid		40.419919	-3.691314	\N	Calle Alcalá, 59, Madrid	f	2025-05-30 11:48:53.387+00	2025-05-30 11:48:53.387+00
c7890a4d-f562-4b89-8db9-f10bb381e176	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b7f98f6d-0f44-4702-8ead-138342382694	location	Mercado de la Reina 12		40.41962899999999	-3.6987696	\N	Gran Vía, 12, Madrid	f	2025-05-30 11:48:53.387+00	2025-05-30 11:48:53.387+00
26cceb01-84ed-4165-8dab-433eb8aa824d	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	e9781151-e27a-4c60-9819-49c095f03cd8	c1059558-561f-4720-805e-6468f73cf29c	location	Cinnamon Biocentro		40.4162816	-3.7022454	\N	Calle de Espoz y Mina, 3, Madrid	f	2025-05-30 11:50:14.281+00	2025-05-30 11:50:14.281+00
a2f1ad62-e75d-4a8d-a007-e338374239aa	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	e9781151-e27a-4c60-9819-49c095f03cd8	c1059558-561f-4720-805e-6468f73cf29c	location	Supermercado El Corte Inglés		40.417519	-3.704566999999999	\N	Calle de Preciados, 3, Madrid	f	2025-05-30 11:50:14.281+00	2025-05-30 11:50:14.281+00
9d95abf9-6f43-48b5-ab7a-23d4c52f4efd	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	e9781151-e27a-4c60-9819-49c095f03cd8	c1059558-561f-4720-805e-6468f73cf29c	location	Intertropico Alimentos Latino para el Mundo		40.4239116	-3.7098071	\N	Calle de los Reyes, 17, Madrid	f	2025-05-30 11:50:14.281+00	2025-05-30 11:50:14.281+00
92103bb3-1bbb-4f32-b6bd-9a93eaf9edd7	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	e9781151-e27a-4c60-9819-49c095f03cd8	c1059558-561f-4720-805e-6468f73cf29c	location	Dia		40.428121	-3.698695	\N	Calle de Sagasta, 18, Madrid	f	2025-05-30 11:50:14.281+00	2025-05-30 11:50:14.281+00
6d926676-7db5-42fa-90c5-7ee00c49bfab	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	e9781151-e27a-4c60-9819-49c095f03cd8	c1059558-561f-4720-805e-6468f73cf29c	location	Carrefour Express		40.4229332	-3.697187999999999	\N	Calle de Gravina, 13, Madrid	f	2025-05-30 11:50:14.281+00	2025-05-30 11:50:14.281+00
3a18664c-91a2-450f-b770-7424eae01b0d	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	e9781151-e27a-4c60-9819-49c095f03cd8	e5ca0ca4-cf59-4c0f-82ef-45a063075e9d	location	La Teletienda		40.4219565	-3.707943	\N	Calle de San Bernardo, 13, Oficina 6ºc, Madrid	f	2025-05-30 11:50:35.5+00	2025-05-30 11:50:35.5+00
e7c35186-e0d3-4aa7-b7dc-f86f074aac2c	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	e9781151-e27a-4c60-9819-49c095f03cd8	e5ca0ca4-cf59-4c0f-82ef-45a063075e9d	location	plaza del sol		40.4210556	-3.7084167	\N	Calle de San Bernardo, 5, Centro, Madrid	f	2025-05-30 11:50:35.5+00	2025-05-30 11:50:35.5+00
3887e4f6-5dbf-46cf-aea8-bb421909b083	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	e9781151-e27a-4c60-9819-49c095f03cd8	c1059558-561f-4720-805e-6468f73cf29c	location	Carrefour Express		40.418792	-3.701998399999999	\N	Calle de la Montera, 32, Madrid	t	2025-05-30 11:50:14.281+00	2025-05-30 11:50:14.281+00
41003516-9d76-4227-a8cf-300e474e8c6e	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	f97d7e65-87f5-471e-a120-c04c26394b54	b687c3eb-a033-4982-ae47-236697e027b1	location	LEIALTA Consultoría Empresarial y Social		40.4236243	-3.693851599999999	\N	Calle de Bárbara de Braganza, 2, Escalera B, 2ºB, Madrid	f	2025-05-30 11:51:12.446+00	2025-05-30 11:51:12.446+00
b340f08f-a724-4d1d-a75c-2f65b86af755	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	f97d7e65-87f5-471e-a120-c04c26394b54	b687c3eb-a033-4982-ae47-236697e027b1	location	Kutxabank		40.4196926	-3.6998482	\N	Gran Vía, 13, Madrid	f	2025-05-30 11:51:12.446+00	2025-05-30 11:51:12.446+00
7d93817f-2802-4a8e-9b63-af4d3dd5b929	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	f97d7e65-87f5-471e-a120-c04c26394b54	b687c3eb-a033-4982-ae47-236697e027b1	location	Bank of Spain		40.4186253	-3.6944076	\N	Calle Alcalá, 48, Madrid	f	2025-05-30 11:51:12.446+00	2025-05-30 11:51:12.446+00
8099562d-4896-4afb-999c-acd79c773193	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	f97d7e65-87f5-471e-a120-c04c26394b54	b687c3eb-a033-4982-ae47-236697e027b1	location	ABANCA - Particulares y Empresas		40.42061429999999	-3.6918681	\N	Paseo de Recoletos, 4, Madrid	f	2025-05-30 11:51:12.446+00	2025-05-30 11:51:12.446+00
8c681a6a-5614-4146-b940-46fc314fb8fd	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	a113f5c3-b32a-439f-961f-851c767f5bd5	location	Gran Vía		40.4198524	-3.7016062	\N	Madrid	f	2025-05-30 11:51:44.908+00	2025-05-30 11:51:44.908+00
d87d5477-ac23-4518-9497-4094b062a5af	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	a113f5c3-b32a-439f-961f-851c767f5bd5	location	Colón		40.42542	-3.69101	\N	Spain	f	2025-05-30 11:51:44.908+00	2025-05-30 11:51:44.908+00
a5f51e0e-ae04-448b-87c5-31854aaefa4d	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	a113f5c3-b32a-439f-961f-851c767f5bd5	location	Sol		40.41685	-3.702920000000001	\N	Spain	t	2025-05-30 11:51:44.908+00	2025-05-30 11:51:44.908+00
516ea439-7418-49c0-87eb-0ef77d8b8251	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	5922cd0e-8c11-448f-83c0-e785f83c31f5	a113f5c3-b32a-439f-961f-851c767f5bd5	location	Callao		40.4202472	-3.7057397	\N	Spain	t	2025-05-30 11:51:44.908+00	2025-05-30 11:51:44.908+00
65022e4f-c328-49f6-8b46-7ac8b53dcbaf	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	91125962-2260-4b09-a062-6aad5eff6101	b7f98f6d-0f44-4702-8ead-138342382694	location	Areia Club		40.4245406	-3.6980344	\N	Calle de Hortaleza, 92, Madrid	t	2025-05-30 11:48:53.387+00	2025-05-30 11:52:24.161+00
0d733376-3c2a-4480-800b-dbf68940d438	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	70a80113-e4cf-487b-8e39-bc5ed5fe7588	location	Honky Tonk Bar Room		40.4302247	-3.6976516	\N	Calle de Covarrubias, 24, Madrid	f	2025-05-30 11:52:24.161+00	2025-05-30 11:52:24.161+00
944063e9-7833-444f-87c1-717963bfd041	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	70a80113-e4cf-487b-8e39-bc5ed5fe7588	location	Pub Gris		40.4213119	-3.6978683	\N	Calle de San Marcos, 29, Madrid	f	2025-05-30 11:52:24.161+00	2025-05-30 11:52:24.161+00
cc55cbb7-a329-4c36-865b-b9bfee691a1c	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	70a80113-e4cf-487b-8e39-bc5ed5fe7588	location	Café Berlín		40.4195885	-3.707942999999999	\N	C, Costanilla de los Ángeles, 20, Madrid	t	2025-05-30 11:52:24.161+00	2025-05-30 11:52:24.161+00
4c98db1f-f791-4612-ba0b-f5bdacc59f10	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	81bb9ab7-25ad-483c-812d-6bdef1a0ee92	70a80113-e4cf-487b-8e39-bc5ed5fe7588	location	Clamores		40.431118	-3.700957700000001	\N	Calle de Alburquerque, 14, Madrid	t	2025-05-30 11:52:24.161+00	2025-05-30 11:52:24.161+00
d8e5612f-d019-4e73-8d90-4cb359332e4b	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Habana en Madrid		40.4260469	-3.6706989	\N	Calle de la Fuente del Berro, 15, Madrid	f	2025-06-14 09:27:52.523+00	2025-06-14 09:27:52.523+00
6a33d755-3d11-4785-9c73-9dadab473390	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	Manolo Bakes		40.4316021	-3.6749546	\N	Calle del Conde de Peñalver, 68, Madrid	f	2025-06-14 09:27:52.523+00	2025-06-14 09:27:52.523+00
381cd5aa-394d-4ffd-9c91-7160b2524360	5baac7e7-7ee6-4810-9760-7a79a5f7727a	307ef0bd-4363-425b-9a18-aad42fd1c81c	4581a08a-3e78-4800-b16c-575f5da81cba	4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7	info	\N	¡Hola! ¡Me alegra que te interese escribir sobre la ubicación de tu apartamento! \r\nAquí te dejo algunas sugerencias para que puedas resaltar este punto en tu descripción:\r\n\r\nTítulo: "Apartamento con ubicación privilegiada en el corazón de la ciudad"\r\n\r\nDescripción:\r\nNuestro apartamento se encuentra en una ubicación inigualable, en el corazón de la ciudad. A solo unos pocos pasos encontrarás restaurantes, tiendas, museos y todos los lugares de interés que la ciudad tiene para ofrecer. Además, la zona está bien comunicada con transporte público, lo que facilita desplazarse por la ciudad de manera rápida y cómoda. \r\n\r\nAprovecha esta ubicación estratégica para disfrutar al máximo de tu estancia en nuestra ciudad. ¡Te esperamos en nuestro acogedor apartamento! ¡Bienvenido!	\N	\N	\N	\N	f	2025-06-30 18:57:10.868043+00	2025-06-30 18:57:10.868043+00
4f01d559-1e89-4550-91d7-7247b0018cd9	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	45d9b160-4619-4e99-a9eb-f0c86768eb6e	location	EL tendido		40.43123870000001	-3.6593245	\N	C. Alcalá, 222, Cdad. Lineal, 28027 Madrid, Spain	t	2025-06-14 09:30:52.050086+00	2025-06-14 09:30:52.050086+00
20d01b82-cd51-4daa-8f7d-9d9aa14d9ece	5baac7e7-7ee6-4810-9760-7a79a5f7727a	5c08b642-ca42-45a1-9791-b6a91aba3cb3	4581a08a-3e78-4800-b16c-575f5da81cba	4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7	info	\N	¡Excelente! Puedes resaltar la conveniente ubicación de tu alojamiento mencionando lo siguiente:\r\n\r\n"Nuestro alojamiento goza de una ubicación privilegiada, situado en el corazón de [nombre de la ciudad/barrio]. A pocos pasos encontrarás una amplia variedad de restaurantes, tiendas y atracciones turísticas. Además, su cercanía a paradas de transporte público facilita desplazarse por la ciudad de forma cómoda y rápida. ¡Disfruta de todo lo que [nombre de la ciudad/barrio] tiene para ofrecer desde nuestra conveniente ubicación!"	\N	\N	\N	\N	f	2025-06-30 18:59:56.089674+00	2025-06-30 18:59:56.089674+00
1e307ab8-9524-49a7-ba7a-391ea271b517	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	b8c955ca-9c59-4e63-a4a8-d12721200a9b	location	Clinica Dental Doctor Francisco García Picazo		40.43763799999999	-3.6764531	\N	Avenida de América, 4, Bajo D, Madrid	f	2025-08-05 10:44:46.222+00	2025-08-05 10:44:46.222+00
978f6629-3028-4b96-b194-f8dc43c694ec	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	b8c955ca-9c59-4e63-a4a8-d12721200a9b	location	Clínica Dental Ortodoncia Rivero		40.43579709999999	-3.7011132	\N	Calle de Viriato, 24, Madrid	f	2025-08-05 10:44:46.222+00	2025-08-05 10:44:46.222+00
02fc4385-03d8-4cd4-9431-81e288d22a64	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	b8c955ca-9c59-4e63-a4a8-d12721200a9b	location	Dental clinic Odos		40.4336344	-3.715695699999999	\N	Calle de Gaztambide, 31, Madrid	f	2025-08-05 10:44:46.222+00	2025-08-05 10:44:46.222+00
e9c4e05d-4740-430b-935b-57e8ac5f9bcb	15863c76-fecb-4b87-8cac-8b258892e7d6	37a03a95-cd39-4d40-a22b-7628cbb50245	56e286de-42ec-42f8-b538-a266387f5c7c	b8c955ca-9c59-4e63-a4a8-d12721200a9b	location	Alfredo Saralegui Calvo		40.421478	-3.678433	\N	Calle de O'Donnell, 8, Madrid	t	2025-08-05 10:44:46.222+00	2025-08-05 10:44:46.222+00
a3604a7a-2f74-4fda-a6ab-ed65018da2d8	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	4581a08a-3e78-4800-b16c-575f5da81cba	4fc3c0a8-3bb5-4b3b-8de3-6230a07df8a7	info	\N	¡Bienvenido a nuestro alojamiento! Queremos que tengas una estadía cómoda y placentera, por eso te pedimos que sigas estas recomendaciones durante tu estancia:\r\n\r\n- Respeta el horario de silencio para no perturbar a otros huéspedes.\r\n- No se permite fumar dentro de las instalaciones, pero puedes hacerlo en las áreas designadas al aire libre.\r\n- Cuida de las instalaciones y del mobiliario como si fuera tu propio hogar.\r\n- Por favor, no invites a personas adicionales sin la autorización previa del anfitrión.\r\n- Recuerda cerrar con llave la puerta al salir y al ingresar al alojamiento.\r\n- Si necesitas ayuda o tienes alguna solicitud especial, no dudes en comunicarte con nosotros.\r\n\r\nEsperamos que estas indicaciones te ayuden a tener una estadía agradable. ¡Disfruta tu tiempo con nosotros y si necesitas algo, estamos aquí para ayudarte!	\N	\N	\N	\N	f	2025-07-26 12:05:14.383581+00	2025-10-08 15:15:15.647+00
0ed73c15-5b07-4009-b0d5-d569b46a74e8	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	Farmacia Plaza Bami		40.4302947	-3.6550752	\N	Plaza Bami, 26, Madrid	f	2025-10-08 15:15:46.354+00	2025-10-08 15:15:46.354+00
a2ca7df4-055a-4621-8e22-60867bfa934c	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	Farmacia Santa Prisca - Lda. Cristina Muñoz Garcia		40.427315	-3.64811	\N	Calle Santa Prisca, 9, Madrid	f	2025-10-08 15:15:46.354+00	2025-10-08 15:15:46.354+00
8dc99994-d970-48eb-8056-872f16f91324	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	56e286de-42ec-42f8-b538-a266387f5c7c	d86dd401-9a93-45e8-b4c2-47fa8f46398e	location	Farmacia Ciudad Lineal - Gda. Patricia Álvarez Calvo		40.4293658	-3.6553378	\N	Calle de Ramón Patuel, 1, Madrid	t	2025-10-08 15:15:46.354+00	2025-10-08 15:15:46.354+00
6045e951-5d80-48f9-b73d-5b6ca242fa39	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	4581a08a-3e78-4800-b16c-575f5da81cba	a1091bf8-4fe3-4ded-854b-fc08019d9296	info	\N	Para una mejor experiencia durante su estancia, aquí tienes una pequeña guía sobre cómo usar los horarios en mi casa Airbnb:\r\n\r\nCheck-in:\r\n- El horario de check-in es a partir de las 3:00 p. m.\r\n- Si llegas antes, es posible que puedas dejar tu equipaje en un lugar seguro hasta la hora de check-in.\r\n- Por favor, avísame con anticipación si planeas llegar fuera del horario establecido para coordinar tu llegada.\r\n\r\nCheck-out:\r\n- El horario de check-out es a las 11:00 a. m.\r\n- Si necesitas salir más tarde, por favor házmelo saber con anticipación para poder organizarlo si es posible.\r\n- En caso de salir antes del horario, puedes dejar las llaves en el lugar designado.\r\n\r\nPara tu comodidad:\r\n- Si tienes alguna restricción de horarios o necesitas mayor flexibilidad, házmelo saber para buscar la mejor solución.\r\n- Si planeas hacer alguna actividad especial durante tu estancia, con gusto te ayudaré a organizarte.\r\n\r\nRecuerda que mi objetivo es que tengas una estancia placentera, así que no dudes en comunicarte en caso de necesitar ayuda con los horarios. ¡Disfruta tu estadía en mi casa Airbnb!	\N	\N	\N	\N	f	2025-10-09 09:19:48.010285+00	2025-10-09 09:19:48.010285+00
8eb94dc3-f579-4c5a-93fe-e4e7b29b025b	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	4581a08a-3e78-4800-b16c-575f5da81cba	cd19040f-5160-49ac-b395-adab3ec2d919	info	\N	El reciclaje es importante. No dejes de hacerlo!!!	\N	\N	\N	\N	f	2025-10-09 15:19:58.703951+00	2025-10-09 15:20:13.889+00
3456ab95-be8d-456d-a062-ca31edaf58af	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Restaurante Milos - La Parrilla Griega		40.4321534	-3.671916	\N	Calle de Francisco Silvela, 30, Madrid	f	2025-05-31 11:57:47.062+00	2025-05-31 11:57:47.062+00
1a1fe4b3-daf0-46bb-a7b5-935cd4a51a2b	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	VP Madroño		40.43513129999999	-3.6765655	\N	Calle del General Díaz Porlier, 101, Madrid	f	2025-05-31 11:57:47.062+00	2025-05-31 11:57:47.062+00
a0ba63f5-9664-4a57-9973-a4d31bd32956	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Taberna Degusta		40.4368662	-3.6771567	\N	Calle de Francisco Silvela, 83, Madrid	f	2025-05-31 11:57:47.062+00	2025-05-31 11:57:47.062+00
917304ab-ca98-4c2e-80f5-678f04bf9ca7	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	7d77f635-9897-4ab0-8801-c3939a7f366b	location	Moulin Chocolat		40.420572	-3.686927999999999	\N	Calle Alcalá, 77, Madrid	f	2025-05-31 12:01:05.819+00	2025-05-31 12:01:05.819+00
5a726c64-de92-407e-8d7b-3a3aa46b2300	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	7d77f635-9897-4ab0-8801-c3939a7f366b	location	Pastelería Mallorca | Velazquez		40.429063	-3.684011	\N	Calle Velázquez, 59, Madrid	f	2025-05-31 12:01:05.819+00	2025-05-31 12:01:05.819+00
7bb3065c-8e35-4ed7-af91-f9e444407649	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	7d77f635-9897-4ab0-8801-c3939a7f366b	location	Pastelería Mallorca | Bravo Murillo		40.4345504	-3.7045487	\N	Calle de Bravo Murillo, 7, Madrid	f	2025-05-31 12:01:05.819+00	2025-05-31 12:01:05.819+00
0c569d3d-688d-408e-831a-1ceb3c060598	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	7d77f635-9897-4ab0-8801-c3939a7f366b	location	Pastelería Mallorca | Serrano		40.4213	-3.6883	\N	Calle de Serrano, 6, Madrid	f	2025-05-31 12:01:05.819+00	2025-05-31 12:01:05.819+00
38bd2a4e-6947-4dc4-af29-09a9fcac7442	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	7d77f635-9897-4ab0-8801-c3939a7f366b	location	Pastelería Formentor -Tienda de Hermosilla		40.42609959999999	-3.6775116	\N	Calle de Hermosilla, 81, Madrid	f	2025-05-31 12:01:05.819+00	2025-05-31 12:01:05.819+00
657eb75d-3d1c-4c6b-8bca-eb54036378fc	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Miyama		40.435713	-3.689798799999998	\N	Paseo de la Castellana, 45, Madrid	f	2025-06-06 23:45:05.177+00	2025-06-06 23:45:05.177+00
4cd40cfd-8b3f-4411-8262-46c0349e148c	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Rosewood Villa Magna		40.4299515	-3.688152499999999	\N	Paseo de la Castellana, 22, Madrid	f	2025-06-06 23:45:05.177+00	2025-06-06 23:45:05.177+00
1f55534d-f879-40ad-a671-9dcbe6672a99	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	ICON Wipton		40.4240272	-3.6854174	\N	Calle de Jorge Juan, 17, Madrid	f	2025-06-06 23:45:05.177+00	2025-06-06 23:45:05.177+00
7d85d9ed-938c-4446-a055-adc36eacb6b5	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Restaurante Fathe Pur		40.4179938	-3.673506100000001	\N	Calle de Ibiza, 42, Madrid	f	2025-06-06 23:45:05.177+00	2025-06-06 23:45:05.177+00
a17e20e0-5715-40bc-9bba-76e740b77eaa	396199c2-f192-49a1-a7e6-8e2d6709cd94	c04cbb8e-05ac-4be7-8e5e-ad2461fea0bd	91125962-2260-4b09-a062-6aad5eff6101	b9048ed1-ab96-4a10-b542-2f5ef4fb5e78	location	Hotel Único Madrid		40.428537	-3.6863313	\N	Calle de Claudio Coello, 67, Madrid	t	2025-06-06 23:45:05.177+00	2025-06-06 23:45:05.177+00
26e91180-c8bd-4dfb-8ca6-6cb2aa237708	396199c2-f192-49a1-a7e6-8e2d6709cd94	19541e45-edf5-402d-9be3-d5aca05e6baa	4581a08a-3e78-4800-b16c-575f5da81cba	0e04b6d5-72be-4f9b-9274-3526ff3f851a	info	\N	Para conectarte a la red WiFi en nuestra casa de Airbnb, sigue estos sencillos pasos:\r\n\r\n1. Enciende tu dispositivo y busca la red WiFi llamada "[Nombre de la red WiFi]" en la lista de redes disponibles.\r\n2. Selecciona esa red y escribe la contraseña que encontrarás en el manual de bienvenida o en un lugar visible en la casa.\r\n3. Una vez conectado, podrás navegar por Internet y disfrutar de la conexión en todas las áreas de la casa.\r\n4. Recuerda que la red WiFi es de uso exclusivo para los huéspedes, por lo que te pedimos que respetes las normas de uso.\r\n\r\nSi tienes algún problema para conectarte o necesitas ayuda adicional, no dudes en contactarnos. ¡Estaremos encantados de asistirte!\r\n\r\nEsperamos que esta información te sea útil y que disfrutes de tu estancia en nuestra casa de Airbnb. ¡Bienvenido!	\N	\N	\N	\N	f	2025-10-09 12:01:31.892981+00	2025-10-09 12:01:31.892981+00
\.


--
-- Data for Name: property_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."property_info" ("id", "property_id", "title", "content", "created_at", "updated_at", "category_id") FROM stdin;
\.


--
-- Data for Name: subscription_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."subscription_plans" ("id", "name", "price_cents", "interval") FROM stdin;
free	Free	0	month
premium	Premium	999	month
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."subscriptions" ("id", "user_id", "plan_id", "status", "current_period_start", "current_period_end", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: todo_list; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."todo_list" ("id", "created_at", "title", "urgent", "description", "done", "done_at", "owner") FROM stdin;
\.


--
-- Name: todo_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."todo_list_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
