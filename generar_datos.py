# -*- coding: utf-8 -*-
"""
Generador de datos de PanoramApp.
Actualiza ciudades.json, clima.json, feriados.json y panoramas.json
desde APIs públicas gratuitas (sin API key).

Ejecutar: python generar_datos.py
"""
import json
import os
import sys
import urllib.request
import ssl
from datetime import datetime, timedelta

# Windows: forzar salida UTF-8 para emojis en consola
try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

BASE = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(BASE, "datos")

# ── 16 ciudades de Chile (capitales regionales + principales) ────────────────
CIUDADES = [
    {
        "id": "arica", "nombre": "Arica", "region": "Región de Arica y Parinacota",
        "lat": -18.4783, "lon": -70.3213,
        "descripcion": "La ciudad de la eterna primavera, puerta de entrada al norte grande con playas y el Morro de Arica.",
        "turismo": [
            {"titulo": "Morro de Arica", "costo": "Gratis", "detalle": "Mirador histórico con vista panorámica a la ciudad y el océano."},
            {"titulo": "Playa Chinchorro", "costo": "Gratis", "detalle": "La playa urbana más larga de Chile, ideal para caminatas al atardecer."},
            {"titulo": "Museo Arqueológico San Miguel de Azapa", "costo": "Pago", "detalle": "Guarda las momias más antiguas del mundo (civilización Chinchorro)."},
            {"titulo": "Valle de Azapa", "costo": "Gratis", "detalle": "Recorrido por olivos milenarios, piscinas y la cultura Chinchorro."},
        ],
        "transporte": [
            "La locomoción colectiva es el medio principal; las líneas A, B y C cubren todo el centro.",
            "Aeropuerto Chacalluta a 18 km, con buses desde el terminal rodoviario.",
            "Taxis y aplicaciones disponibles en el centro y zonas turísticas.",
            "El terminal rodoviario conecta con Iquique, Calama y resto del país.",
            "Bicicletas: la ciclovía costera une el centro con la playa Chinchorro.",
        ],
    },
    {
        "id": "iquique", "nombre": "Iquique", "region": "Región de Tarapacá",
        "lat": -20.2170, "lon": -70.1553,
        "descripcion": "Ciudad costera del norte con playas urbanas, arquitectura georgiana y la zona franca.",
        "turismo": [
            {"titulo": "Playa Cavancha", "costo": "Gratis", "detalle": "La playa más popular de la ciudad, con paseo peatonal y deportes náuticos."},
            {"titulo": "Zona Franca (ZOFRI)", "costo": "Gratis", "detalle": "Un polo comercial con productos a menor precio, ideal para compras."},
            {"titulo": "Humberstone", "costo": "Pago", "detalle": "Ex oficina salitrera, Patrimonio de la Humanidad de la UNESCO."},
            {"titulo": "Paseo Baquedano", "costo": "Gratis", "detalle": "Calle con casonas de estilo georgiano que conservan el Iquique antiguo."},
            {"titulo": "Museo Corbeta Esmeralda", "costo": "Pago", "detalle": "Réplica de la nave histórica del Combate Naval de Iquique."},
        ],
        "transporte": [
            "Colectivos y buses urbanos conectan el centro con Playa Cavancha y ZOFRI.",
            "Aeropuerto Diego Aracena a 45 km, con traslados frecuentes en bus.",
            "El terminal rodoviario tiene servicios a Arica, Calama y Antofagasta.",
            "Se puede recorrer el centro a pie; el casco histórico es compacto.",
            "Arriendos de bicicletas en la costanera.",
        ],
    },
    {
        "id": "antofagasta", "nombre": "Antofagasta", "region": "Región de Antofagasta",
        "lat": -23.6509, "lon": -70.3975,
        "descripcion": "La Perla del Norte, capital minera con costanera y el corazón del desierto más árido del mundo.",
        "turismo": [
            {"titulo": "La Portada", "costo": "Gratis", "detalle": "Monumento natural de roca volcánica esculpida por el mar, a 18 km al norte."},
            {"titulo": "Costanera de Antofagasta", "costo": "Gratis", "detalle": "Paseo marítimo con vista al océano, ideal para trotar al atardecer."},
            {"titulo": "Museo Regional de Antofagasta", "costo": "Gratis", "detalle": "Historia minera y cultural de la región."},
            {"titulo": "Ruta de las Iglesias", "costo": "Gratis", "detalle": "Recorrido por templos históricos del centro, incluida la Catedral."},
            {"titulo": "Expedición al Desierto de Atacama", "costo": "Pago", "detalle": "Full-day a San Pedro de Atacama, Valle de la Luna y geisers del Tatio."},
        ],
        "transporte": [
            "El transporte urbano es de buses (línea 6, 15 principalmente) que cruzan la ciudad.",
            "Aeropuerto Andrés Sabella a 30 km, con buses a la ciudad.",
            "Terminal rodoviario con salidas a Calama, Iquique y Santiago.",
            "El centro y la costanera son caminables.",
            "Taxis y aplicaciones disponibles en todo el radio urbano.",
        ],
    },
    {
        "id": "copiapo", "nombre": "Copiapó", "region": "Región de Atacama",
        "lat": -27.3668, "lon": -70.3322,
        "descripcion": "Capital minera de Atacama, puerta al Valle de Copiapó y al desierto florido.",
        "turismo": [
            {"titulo": "Catedral de Copiapó", "costo": "Gratis", "detalle": "Templo neoclásico del siglo XIX, ícono del casco histórico."},
            {"titulo": "Museo Minero de Tierra Amarilla", "costo": "Pago", "detalle": "Recorrido por una mina real de cobre a 20 km de la ciudad."},
            {"titulo": "Desierto Florido (estación)", "costo": "Gratis", "detalle": "Fenómeno natural que cubre el desierto de flores tras lluvias."},
            {"titulo": "Valle de Copiapó", "costo": "Gratis", "detalle": "Viñedos del desierto y pueblos históricos como Tierra Amarilla."},
        ],
        "transporte": [
            "Colectivos recorren el centro y alrededores.",
            "Aeródromo cerca de Chamonate para vuelos regionales.",
            "Terminal de buses con conexiones a Vallenar, La Serena y Santiago.",
            "El centro es compacto y se recorre fácil a pie.",
            "Buses rurales al Valle de Copiapó y pueblos mineros.",
        ],
    },
    {
        "id": "la-serena", "nombre": "La Serena", "region": "Región de Coquimbo",
        "lat": -29.9027, "lon": -71.2519,
        "descripcion": "Ciudad colonial con iglesias de piedra, playas y el Observatorio Mamalluca.",
        "turismo": [
            {"titulo": "Observatorio Mamalluca", "costo": "Pago", "detalle": "Observación astronómica con telescopios, a 50 km del valle de Elqui."},
            {"titulo": "Playa El Faro", "costo": "Gratis", "detalle": "Playas urbanas de arena fina junto al icónico faro."},
            {"titulo": "Casco Histórico", "costo": "Gratis", "detalle": "Iglesias de piedra, plaza de armas y arquitectura colonial del siglo XVI."},
            {"titulo": "Valle de Elqui", "costo": "Gratis", "detalle": "Pueblos mágicos, pisco artesanal y cielos ideales para la astronomía."},
            {"titulo": "Acuario Yeco", "costo": "Pago", "detalle": "Vida marina de la costa de Coquimbo, en el sector de Península."},
        ],
        "transporte": [
            "Colectivos y micros urbanos recorren La Serena y Coquimbo como un área metropolitana.",
            "Aeropuerto La Florida a 6 km del centro, con buses y taxis.",
            "Terminal de buses con conexiones a Ovalle, Vicuña y Santiago.",
            "Se puede caminar entre la plaza de armas y la playa en 15 minutos.",
            "Ruta Elqui: buses a Paihuano y Vicuña desde el terminal.",
        ],
    },
    {
        "id": "valparaiso", "nombre": "Valparaíso", "region": "Región de Valparaíso",
        "lat": -33.0472, "lon": -71.6127,
        "descripcion": "Ciudad patrimonio de la humanidad, famosa por sus cerros coloridos, ascensores y arte callejero.",
        "turismo": [
            {"titulo": "Cerro Alegre y Concepción", "costo": "Gratis", "detalle": "Sube en ascensor para recorrer callejones, murales y miradores."},
            {"titulo": "Ascensor Artillería", "costo": "Pago", "detalle": "El clásico funicular 1904 desde el plan hasta el paseo 21 de Mayo."},
            {"titulo": "La Sebastiana", "costo": "Pago", "detalle": "Casa museo de Pablo Neruda con vista panorámica al puerto."},
            {"titulo": "Paseo Yugoslavo", "costo": "Gratis", "detalle": "Mirador que une los cerros de la ciudad patrimonio."},
            {"titulo": "Puerto y Mercado", "costo": "Gratis", "detalle": "Vida portuaria, ferias de artesanía y restaurantes frente al mar."},
        ],
        "transporte": [
            "Ascensores (funculares históricos) conectan el plan con los cerros.",
            "Metro Valparaíso (MERVAL) une Valparaíso con Viña del Mar hasta Limache.",
            "Colectivos y trolebuses recorren el plan y cerros periféricos.",
            "Terminal de buses de Valparaíso con conexiones a todo Chile.",
            "Se camina mucho: usar calzado cómodo por las escaleras y pendientes.",
        ],
    },
    {
        "id": "vina-del-mar", "nombre": "Viña del Mar", "region": "Región de Valparaíso",
        "lat": -33.0153, "lon": -71.5508,
        "descripcion": "La Ciudad Jardín, con playas, casinos, el reloj de flores y el festival musical más famoso de Chile.",
        "turismo": [
            {"titulo": "Playa Reñaca", "costo": "Gratis", "detalle": "La playa más concurrida, con bares, restaurantes y sunset views."},
            {"titulo": "Reloj de Flores", "costo": "Gratis", "detalle": "Ícono floral construido en 1962 para el Mundial de fútbol."},
            {"titulo": "Quinta Vergara", "costo": "Gratis", "detalle": "Parque con el Palacio Vergara y su Anfiteatro del Festival."},
            {"titulo": "Casino Municipal", "costo": "Pago", "detalle": "El casino más tradicional de Chile, junto al jardín de juegos."},
            {"titulo": "Castillo Wulff", "costo": "Gratis", "detalle": "Castillo de estilo alemán frente al mar, hoy sede cultural."},
        ],
        "transporte": [
            "Metro MERVAL recorre la avenida costera hacia Valparaíso y Limache.",
            "Colectivos y micros conectan todas las playas y barrios.",
            "Buses a Santiago salen cada 15 minutos desde el terminal Rodoviario.",
            "Se puede caminar por la costanera entre el Reloj y el Casino.",
            "Taxis y apps de transporte cubren toda la ciudad.",
        ],
    },
    {
        "id": "santiago", "nombre": "Santiago", "region": "Región Metropolitana",
        "lat": -33.4489, "lon": -70.6693,
        "descripcion": "La capital de Chile: un valle rodeado de cordillera con cultura, gastronomía y una red de metro eficiente.",
        "turismo": [
            {"titulo": "Cerro San Cristóbal", "costo": "Gratis", "detalle": "Sube en funicular y visita el santuario y mirador con vista a la cordillera."},
            {"titulo": "Plaza de Armas y Catedral", "costo": "Gratis", "detalle": "El corazón histórico de Santiago, rodeado de edificios coloniales."},
            {"titulo": "Museo de Bellas Artes", "costo": "Gratis", "detalle": "Colección de arte chileno en un palacio de 1910 en el Parque Forestal."},
            {"titulo": "Barrio Lastarria", "costo": "Gratis", "detalle": "Calles con gastronomía, librerías y vida cultural nocturna."},
            {"titulo": "Sky Costanera", "costo": "Pago", "detalle": "Mirador a 300 m de altura, el más alto de Sudamérica, en Providencia."},
        ],
        "transporte": [
            "Metro de Santiago: 7 líneas que cubren toda la ciudad, con tarjeta bip!.",
            "Red Metropolitana de Movilidad (buses) en casi todas las comunas.",
            "La bicicleta es cada vez más popular; hay ciclovías en el centro y Providencia.",
            "Se puede caminar por el centro histórico y Barrio Lastarria.",
            "Aeropuerto Arturo Merino Benítez a 26 km con buses 555 y traslados.",
        ],
    },
    {
        "id": "rancagua", "nombre": "Rancagua", "region": "Región del Libertador General Bernardo O'Higgins",
        "lat": -34.1708, "lon": -70.7444,
        "descripcion": "Capital agrícola del valle central, a 87 km de Santiago, cuna de la chilenidad y los huasos.",
        "turismo": [
            {"titulo": "Plaza de Los Héroes", "costo": "Gratis", "detalle": "Plaza histórica donde se libró la Batalla de Rancagua en 1814."},
            {"titulo": "Museo Regional de Rancagua", "costo": "Gratis", "detalle": "Casa colonial del siglo XIX que conserva la historia de la región."},
            {"titulo": "Viña Santa Cruz (Peralillo)", "costo": "Pago", "detalle": "Recorrido por museos temáticos y observatorio astronómico."},
            {"titulo": "Ruta del Vino Colchagua", "costo": "Pago", "detalle": "Viñedos premiados en Santa Cruz a 45 minutos de la ciudad."},
        ],
        "transporte": [
            "El Tren Rancagua-Express une la ciudad con Santiago en 1 hora.",
            "Metrotren y buses interurbanos frecuentes hacia la capital.",
            "Micros urbanas cubren la ciudad y alrededores.",
            "El centro es compacto y caminable."
        ],
    },
    {
        "id": "talca", "nombre": "Talca", "region": "Región del Maule",
        "lat": -35.4264, "lon": -71.6554,
        "descripcion": "La capital del Maule, rodeada de viñedos, a 250 km de Santiago, punto de paso a la costa y la cordillera.",
        "turismo": [
            {"titulo": "Plaza de Armas de Talca", "costo": "Gratis", "detalle": "Plaza arbolada con la Catedral y los históricos portales."},
            {"titulo": "Mercado Central de Talca", "costo": "Gratis", "detalle": "Gastronomía típica maulina, ideal para probar el chancho en piedra."},
            {"titulo": "Ruta del Vino Maule", "costo": "Pago", "detalle": "Viñedos centenarios en San Clemente y el secano interior."},
            {"titulo": "Termas de Panimávida (Linares)", "costo": "Pago", "detalle": "Centro termal a 40 km, en un entorno de montaña."},
        ],
        "transporte": [
            "Buses interurbanos frecuentes hacia el sur y Santiago.",
            "Tren Talca-Constitución, uno de los ramales históricos de Chile.",
            "Colectivos y micros urbanas conectan la ciudad.",
            "Ruta a la costa (Constitución): buses cada hora."
        ],
    },
    {
        "id": "concepcion", "nombre": "Concepción", "region": "Región del Biobío",
        "lat": -36.8270, "lon": -73.0503,
        "descripcion": "Capital del Gran Concepción, ciudad universitaria con ríos, costa y una potente escena musical.",
        "turismo": [
            {"titulo": "Plaza de la Independencia", "costo": "Gratis", "detalle": "Plaza histórica con la Catedral y el Edificio de los Portales."},
            {"titulo": "Parque Ecuador", "costo": "Gratis", "detalle": "Pulmón verde sobre el río Biobío con miradores y senderos."},
            {"titulo": "Museo de Historia Natural", "costo": "Gratis", "detalle": "Colección paleontológica y natural de la zona."},
            {"titulo": "Universidad de Concepción", "costo": "Gratis", "detalle": "Campus patrimonial con el mural de O'Higgins en la Casa del Arte."},
            {"titulo": "Costa de Penco y Lirquén", "costo": "Gratis", "detalle": "Playas y caletas con mariscos frescos a 20 minutos."},
        ],
        "transporte": [
            "Buses urbanos (BioBús) cruzan el Gran Concepción junto a colectivos.",
            "Aeropuerto Carriel Sur a 7 km del centro.",
            "Tren local a Talcahuano y estaciones cercanas.",
            "El centro universitario y comercial es caminable."
        ],
    },
    {
        "id": "temuco", "nombre": "Temuco", "region": "Región de la Araucanía",
        "lat": -38.7359, "lon": -72.5904,
        "descripcion": "Capital de la Araucanía, corazón de la cultura mapuche, puerta a los lagos y volcanes del sur.",
        "turismo": [
            {"titulo": "Mercado Municipal", "costo": "Gratis", "detalle": "Artesanía mapuche en plata, lana y madera."},
            {"titulo": "Cerro Ñielol", "costo": "Pago", "detalle": "Reserva natural con senderos, en plena ciudad."},
            {"titulo": "Museo Regional de la Araucanía", "costo": "Gratis", "detalle": "Historia del pueblo mapuche y la colonización en el sur."},
            {"titulo": "Lago Villarrica (a 1h)", "costo": "Pago", "detalle": "Excursión clásica: el volcán más activo de Sudamérica."},
        ],
        "transporte": [
            "Bus interurbano a todas las ciudades del sur y a Santiago.",
            "Micros y colectivos urbanos con amplia cobertura.",
            "Aeropuerto Maquehue a 5 km del centro.",
            "El centro es compacto y caminable."
        ],
    },
    {
        "id": "valdivia", "nombre": "Valdivia", "region": "Región de Los Ríos",
        "lat": -39.8142, "lon": -73.2459,
        "descripcion": "Ciudad de los ríos y cervezas artesanales, reconstruida con tradición alemana tras el terremoto de 1960.",
        "turismo": [
            {"titulo": "Mercado Fluvial", "costo": "Gratis", "detalle": "Lonkos en el río Calle-Calle con pescados y mariscos frescos."},
            {"titulo": "Fuerte Niebla", "costo": "Pago", "detalle": "Fuerte español del siglo XVII con vista a la bahía de Corral."},
            {"titulo": "Costanera y Torreón del Barro", "costo": "Gratis", "detalle": "Paseo por el río con el mítico Torreón español."},
            {"titulo": "Cervecerías Kunstmann y Austral", "costo": "Pago", "detalle": "La capital de la cerveza artesanal chilena, tours de fabricación."},
            {"titulo": "Parque Saval", "costo": "Gratis", "detalle": "Selva valdiviana en plena ciudad, ideal para picnic."},
        ],
        "transporte": [
            "Se recorre a pie por el centro y costanera.",
            "Barcazas (lanchas) cruzan el río al sector de Isla Teja.",
            "Aeropuerto Pichoy a 30 km, con buses de conexión.",
            "Terminal de buses con conexiones a Temuco, Osorno y Pto. Montt."
        ],
    },
    {
        "id": "puerto-montt", "nombre": "Puerto Montt", "region": "Región de Los Lagos",
        "lat": -41.4689, "lon": -72.9411,
        "descripcion": "Puerta a la Patagonia chilena, con el volcán Osorno, el lago Llanquihue y los canales australes.",
        "turismo": [
            {"titulo": "Barrio Puerto y Mercado Angelmó", "costo": "Gratis", "detalle": "Gastronomía marina y artesanía en madera en el mercado más famoso del sur."},
            {"titulo": "Lago Llanquihue y Puerto Varas", "costo": "Gratis", "detalle": "Vista al volcán Osorno, ciudad alemana a 20 minutos."},
            {"titulo": "Parque Nacional Alerce Andino", "costo": "Pago", "detalle": "Bosque de alerces milenarios con senderos."},
            {"titulo": "Isla Tenglo", "costo": "Gratis", "detalle": "Travesía en lancha, senderos y vista panorámica del puerto."},
            {"titulo": "Cruce a Chiloé", "costo": "Pago", "detalle": "La Ruta CH-5 termina en Pargua (ferry a la Isla Grande de Chiloé)."},
        ],
        "transporte": [
            "Aeropuerto El Tepual a 16 km, con buses a la ciudad.",
            "Terminal de buses con salidas a toda la Patagonia (Chile y Argentina).",
            "Ferries desde Pargua hacia Chiloé y desde Puerto Montt hacia Chaitén.",
            "Micros y colectivos urbanos conectan Angelmó con el centro."
        ],
    },
    {
        "id": "coyhaique", "nombre": "Coyhaique", "region": "Región de Aysén",
        "lat": -45.5712, "lon": -72.0663,
        "descripcion": "Capital de la Patagonia norte, rodeada de ríos y montañas, base para la Carretera Austral.",
        "turismo": [
            {"titulo": "Catedral de Mármol", "costo": "Pago", "detalle": "Formaciones de mármol en el Lago General Carrera, a 3 horas."},
            {"titulo": "Reserva Coyhaique", "costo": "Gratis", "detalle": "Bosques nativos y miradores a 3 km del centro."},
            {"titulo": "Villa Cerro Castillo", "costo": "Gratis", "detalle": "Montañas icónicas de la Carretera Austral, a 80 km al norte."},
            {"titulo": "Río Simpson", "costo": "Gratis", "detalle": "Pesca deportiva y picnic en orillas del río."},
        ],
        "transporte": [
            "Aeropuerto de Balmaceda a 55 km con buses coordinados.",
            "La Carretera Austral (Ruta 7) es el eje vial; se arrienda auto o se usan buses patagónicos.",
            "Taxis y colectivos en el centro.",
            "Para destinos lejanos: buses rurales desde el terminal."
        ],
    },
    {
        "id": "punta-arenas", "nombre": "Punta Arenas", "region": "Región de Magallanes",
        "lat": -53.1638, "lon": -70.9171,
        "descripcion": "La ciudad más austral del mundo, puerta a la Patagonia y a la Antártica, con historia de estancieros y marinos.",
        "turismo": [
            {"titulo": "Parque del Estrecho de Magallanes", "costo": "Pago", "detalle": "Exhibición del paso histórico de Magallanes y vista al estrecho."},
            {"titulo": "Reserva Nacional Magallanes", "costo": "Gratis", "detalle": "Senderos entre lengas y ñirres, a 10 minutos del centro."},
            {"titulo": "Plaza Muñoz Gamero", "costo": "Gratis", "detalle": "Plaza histórica rodeada de palacetes de los estancieros."},
            {"titulo": "Museo Nao Victoria", "costo": "Pago", "detalle": "Réplicas de barcos históricos, incluido el Beagle de Darwin."},
            {"titulo": "Cerro de la Cruz", "costo": "Gratis", "detalle": "Mirador con vista completa de la ciudad y el estrecho."},
        ],
        "transporte": [
            "Aeropuerto Carlos Ibáñez del Campo a 20 km de la ciudad.",
            "Buses urbanos y taxis en el radio céntrico.",
            "La ciudad se camina fácilmente; el centro es limitado.",
            "Para Torres del Paine y Tierra del Fuego: buses desde el terminal."
        ],
    },
]

# ── Emergencia (números nacionales + local por ciudad) ────────────────────────
EMERGENCIA_NACIONAL = [
    {"nombre": "Carabineros de Chile", "numero": "133", "detalle": "Emergencias policiales en todo el territorio."},
    {"nombre": "Bomberos", "numero": "132", "detalle": "Incendios y rescates."},
    {"nombre": "SAMU (Ambulancia)", "numero": "131", "detalle": "Emergencia médica y rescate."},
    {"nombre": "PDI", "numero": "134", "detalle": "Policía de Investigaciones."},
    {"nombre": "Emergencia Marítima", "numero": "137", "detalle": "Rescate en costas y navegación."},
]

HOSPITALES = {
    "arica": {"nombre": "Hospital Dr. Juan Noé", "numero": "+56 58 220 5950", "detalle": "Hospital base de la ciudad."},
    "iquique": {"nombre": "Hospital Dr. Ernesto Torres Galdames", "numero": "+56 57 240 4400", "detalle": "Hospital regional."},
    "antofagasta": {"nombre": "Hospital Regional de Antofagasta", "numero": "+56 55 265 6000", "detalle": "Hospital de alta complejidad."},
    "copiapo": {"nombre": "Hospital Regional de Copiapó", "numero": "+56 52 232 5000", "detalle": "Hospital regional de Atacama."},
    "la-serena": {"nombre": "Hospital de La Serena", "numero": "+56 51 233 6000", "detalle": "Hospital regional de Coquimbo."},
    "valparaiso": {"nombre": "Hospital Carlos Van Buren", "numero": "+56 32 236 1000", "detalle": "Hospital público de referencia."},
    "vina-del-mar": {"nombre": "Hospital Gustavo Fricke", "numero": "+56 32 251 4004", "detalle": "Hospital de la red de salud."},
    "santiago": {"nombre": "Hospital Clínico de la U. de Chile", "numero": "+56 2 2978 8000", "detalle": "Centro de referencia nacional."},
    "rancagua": {"nombre": "Hospital Regional de Rancagua", "numero": "+56 72 265 1000", "detalle": "Hospital base de O'Higgins."},
    "talca": {"nombre": "Hospital Regional de Talca", "numero": "+56 71 220 3400", "detalle": "Hospital regional del Maule."},
    "concepcion": {"nombre": "Hospital Regional Guillermo Grant Benavente", "numero": "+56 41 272 2500", "detalle": "Hospital base del Biobío."},
    "temuco": {"nombre": "Hospital Regional Dr. Hernán Henríquez Aravena", "numero": "+56 45 296 3300", "detalle": "Hospital de la Araucanía."},
    "valdivia": {"nombre": "Hospital Base de Valdivia", "numero": "+56 63 229 8000", "detalle": "Hospital regional de Los Ríos."},
    "puerto-montt": {"nombre": "Hospital Puerto Montt", "numero": "+56 65 248 6000", "detalle": "Hospital regional de Los Lagos."},
    "coyhaique": {"nombre": "Hospital Regional de Coyhaique", "numero": "+56 67 241 1200", "detalle": "Hospital de Aysén."},
    "punta-arenas": {"nombre": "Hospital Clínico Magallanes", "numero": "+56 61 220 5000", "detalle": "Hospital regional de Magallanes."},
}

# ── Open-Meteo: clima sin API key ─────────────────────────────────────────────
def obtener_clima(lat, lon, dias=5):
    """Consulta pronóstico a Open-Meteo (gratis, sin key)."""
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
        f"&timezone=America/Santiago&forecast_days={dias}"
    )
    try:
        ctx = ssl.create_default_context()
        req = urllib.request.Request(url, headers={"User-Agent": "PanoramApp/1.0"})
        with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        print(f"  ⚠️ Clima falló para ({lat},{lon}): {e}")
        return None

CODES = {
    0: "☀️ Despejado", 1: "🌤️ Mayormente despejado", 2: "⛅ Parcialmente nublado", 3: "☁️ Nublado",
    45: "🌫️ Niebla", 48: "🌫️ Niebla helada", 51: "🌦️ Lluvia ligera", 53: "🌦️ Lluvia moderada",
    55: "🌧️ Lluvia fuerte", 61: "🌧️ Lluvia ligera", 63: "🌧️ Lluvia moderada", 65: "🌧️ Lluvia intensa",
    71: "🌨️ Nieve ligera", 73: "🌨️ Nieve moderada", 75: "❄️ Nieve intensa", 80: "🌦️ Chubascos",
    81: "🌧️ Chubascos moderados", 82: "🌧️ Chubascos violentos", 95: "⛈️ Tormenta", 96: "⛈️ Tormenta con granizo",
    99: "⛈️ Tormenta fuerte",
}

def estado_clima(code):
    return CODES.get(code, "🌡️ Variable")

# ── Feriados de Chile ─────────────────────────────────────────────────────────
def obtener_feriados():
    """Feriados chilenos desde la API gratuita de la Biblioteca del Congreso / datos.gob.cl."""
    url = "https://apis.digital.gob.cl/fl/feriados"
    try:
        ctx = ssl.create_default_context()
        req = urllib.request.Request(url, headers={"User-Agent": "PanoramApp/1.0"})
        with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        print(f"  ⚠️ Feriados falló: {e}")
        return None

# ── Generar panoramas dinámicos (clima + feriados) ───────────────────────────
def generar_panoramas(ciudades, clima_map, feriados):
    """Genera panoramas combinando clima (mejores días) y feriados."""
    panoramas = []
    idx = 0

    # Próximos feriados → panoramas de tipo "Feriado"
    hoy = datetime.now().date()
    feriados_futuros = []
    if feriados:
        for f in feriados:
            try:
                d = datetime.strptime(f.get("fecha", ""), "%Y-%m-%d").date()
                if d >= hoy:
                    feriados_futuros.append({"fecha": d, "nombre": f.get("nombre", "Feriado")})
            except Exception:
                continue
    feriados_futuros.sort(key=lambda x: x["fecha"])
    feriados_futuros = feriados_futuros[:6]

    for f in feriados_futuros:
        # Elegir la ciudad con mejor clima ese día (usando pronóstico)
        mejor = None
        for c in ciudades:
            cl = clima_map.get(c["id"])
            if not cl:
                continue
            for i, dia in enumerate(cl.get("daily", {}).get("time", [])):
                if dia == f["fecha"].isoformat():
                    prob = cl["daily"]["precipitation_probability_max"][i]
                    if mejor is None or prob < mejor[1]:
                        mejor = (c, prob)
                    break
        if mejor is None:
            mejor = (ciudades[7], 50)  # Santiago por defecto
        ciudad, _ = mejor
        idx += 1
        panoramas.append({
            "id": "feriado-" + str(idx),
            "titulo": f"📅 {f['nombre']}",
            "categoria": "Feriado",
            "precio": False,
            "descripcion": f"Celebración oficial en {ciudad['nombre']}. Una buena oportunidad para conocer la ciudad.",
            "ubicacion": ciudad["nombre"] + ", Chile",
            "fecha": f["fecha"].isoformat() + "T09:00:00-04:00",
            "imagen": "",
            "url": "https://www.google.com/search?q=" + f["nombre"].replace(" ", "+"),
            "fuente": "Feriados de Chile",
        })

    # Top 6 ciudades con mejor clima en los próximos 3 días → panoramas al aire libre
    futuros = []
    for c in ciudades:
        cl = clima_map.get(c["id"])
        if not cl:
            continue
        dias = cl.get("daily", {})
        for i, dia in enumerate(dias.get("time", [])):
            if i >= 3:
                break
            prob = dias["precipitation_probability_max"][i]
            tmax = dias["temperature_2m_max"][i]
            futuros.append({"ciudad": c, "dia": dia, "prob": prob, "tmax": tmax})
    futuros.sort(key=lambda x: x["prob"])
    for item in futuros[:6]:
        idx += 1
        c = item["ciudad"]
        clima_txt = estado_clima(0)  # para el top días estará despejado
        panoramas.append({
            "id": "clima-" + str(idx),
            "titulo": f"🌤️ Mejor día en {c['nombre']}",
            "categoria": "Aire libre",
            "precio": False,
            "descripcion": f"Pronóstico favorable: {clima_txt} y {item['tmax']}°C. Ideal para recorrer {c['nombre']}.",
            "ubicacion": c["nombre"] + ", Chile",
            "fecha": item["dia"] + "T10:00:00-04:00",
            "imagen": "",
            "url": "https://www.google.com/search?q=panoramas+" + c["nombre"].replace(" ", "+"),
            "fuente": "Pronóstico del clima",
        })

    # + algunos turismo recomendado por ciudad
    for c in ciudades[:4]:
        for t in c["turismo"][:1]:
            idx += 1
            panoramas.append({
                "id": "tour-" + str(idx),
                "titulo": f"🏛️ {t['titulo']} ({c['nombre']})",
                "categoria": "Turismo",
                "precio": t["costo"] != "Gratis",
                "descripcion": t["detalle"],
                "ubicacion": c["nombre"] + ", Chile",
                "fecha": "",
                "imagen": "",
                "url": "https://www.google.com/search?q=" + t["titulo"].replace(" ", "+") + "+" + c["nombre"].replace(" ", "+"),
                "fuente": "Guía turística",
            })

    return panoramas


def main():
    os.makedirs(DATOS, exist_ok=True)

    # 1. Guía de ciudades
    print("📦 Generando guía de ciudades…")
    for c in CIUDADES:
        c["emergencia"] = EMERGENCIA_NACIONAL + [dict(HOSPITALES[c["id"]])]
    ciudades_path = os.path.join(DATOS, "ciudades.json")
    with open(ciudades_path, "w", encoding="utf-8") as f:
        json.dump({"actualizado": datetime.now().isoformat(), "ciudades": CIUDADES}, f, ensure_ascii=False, indent=2)
    print(f"  ✅ {len(CIUDADES)} ciudades → ciudades.json")

    # 2. Clima
    print("🌤️ Consultando clima (Open-Meteo)…")
    clima_map = {}
    for c in CIUDADES:
        print(f"  · {c['nombre']}…")
        cl = obtener_clima(c["lat"], c["lon"])
        if cl:
            clima_map[c["id"]] = cl
    clima_data = {
        "actualizado": datetime.now().isoformat(),
        "fuente": "Open-Meteo (gratis, sin API key)",
        "ciudades": clima_map,
    }
    with open(os.path.join(DATOS, "clima.json"), "w", encoding="utf-8") as f:
        json.dump(clima_data, f, ensure_ascii=False, indent=2)
    print(f"  ✅ Clima para {len(clima_map)} de {len(CIUDADES)} ciudades")

    # 3. Feriados
    print("📅 Consultando feriados (data.gob.cl)…")
    feriados = obtener_feriados()
    if feriados:
        with open(os.path.join(DATOS, "feriados.json"), "w", encoding="utf-8") as f:
            json.dump({"actualizado": datetime.now().isoformat(), "fuente": "apis.digital.gob.cl", "feriados": feriados}, f, ensure_ascii=False, indent=2)
        print(f"  ✅ {len(feriados)} feriados")
    else:
        print("  ⚠️ No se pudo obtener feriados, usando lista de respaldo")
        feriados_respaldo = [
            {"nombre": "Año Nuevo", "fecha": "2026-01-01"},
            {"nombre": "Navidad", "fecha": "2026-12-25"},
            {"nombre": "Fiestas Patrias", "fecha": "2026-09-18"},
        ]
        with open(os.path.join(DATOS, "feriados.json"), "w", encoding="utf-8") as f:
            json.dump({"actualizado": datetime.now().isoformat(), "fuente": "respaldo", "feriados": feriados_respaldo}, f, ensure_ascii=False, indent=2)
        print("  ✅ Feriados de respaldo")

    # 4. Panoramas
    print("🎉 Generando panoramas dinámicos…")
    panoramas = generar_panoramas(CIUDADES, clima_map, feriados)
    if not panoramas:
        # Respaldo: turismo de las primeras ciudades
        for c in CIUDADES[:6]:
            for t in c["turismo"]:
                panoramas.append({
                    "id": "tour-" + c["id"] + "-1",
                    "titulo": f"{t['titulo']} ({c['nombre']})",
                    "categoria": "Turismo",
                    "precio": t["costo"] != "Gratis",
                    "descripcion": t["detalle"],
                    "ubicacion": c["nombre"] + ", Chile",
                    "fecha": "",
                    "imagen": "",
                    "url": "https://www.google.com/search?q=" + t["titulo"].replace(" ", "+"),
                    "fuente": "Guía turística",
                })
    with open(os.path.join(DATOS, "panoramas.json"), "w", encoding="utf-8") as f:
        json.dump({"actualizado": datetime.now().isoformat(), "ciudad": "Chile", "panoramas": panoramas}, f, ensure_ascii=False, indent=2)
    print(f"  ✅ {len(panoramas)} panoramas")

    print("\n✨ ¡Datos actualizados!")


if __name__ == "__main__":
    main()