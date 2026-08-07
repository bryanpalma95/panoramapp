// ============================================
// DATA MANAGEMENT & STATE
// ============================================

class ServiceManager {
    constructor() {
        this.services = this.loadFromStorage();
        // Load saved state or use defaults
        this.currentCategory = localStorage.getItem('currentCategory') || 'hoteles';
        this.currentCity = localStorage.getItem('currentCity') || 'villarrica';
        this.editingServiceId = null;
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupCitySelector();
        this.updateCityHeader();
        // Ensure the correct tab is active based on loaded state
        this.switchCategory(this.currentCategory);
        this.updateCounts();
    }

    // Local Storage Management
    loadFromStorage() {
        const stored = localStorage.getItem('cityServices');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading services:', e);
                return [];
            }
        }
        return this.getInitialData();
    }

    saveToStorage() {
        localStorage.setItem('cityServices', JSON.stringify(this.services));
    }

    getInitialData() {
        // Real data from Chilean tourist services - 52 services total
        return [
            // ========== HOTELES (11 hoteles) ==========
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'santiago',
                name: 'The Ritz-Carlton Santiago',
                address: 'El Alcalde 15, Las Condes, Santiago',
                phone: '+56 2 2470 8500',
                email: 'reservations.santiago@ritzcarlton.com',
                website: 'https://www.ritzcarlton.com/santiago',
                rating: 5,
                price: '$$$$',
                description: 'Hotel de lujo 5 estrellas en el corazón de Las Condes, con vistas panorámicas a la Cordillera de los Andes y servicios premium.',
                tags: ['lujo', 'spa', 'restaurante gourmet', 'piscina', 'gimnasio'],
                createdAt: new Date().toISOString()
            },
            // Hoteles Villarrica
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'villarrica',
                name: 'Hotel Terraza Suite',
                address: 'Julio Zegers 351, Villarrica',
                phone: '+56 45 241 4508',
                email: 'info@hotelterrazasuite.cl',
                website: 'https://www.hotelterrazasuite.cl',
                rating: 4,
                price: '$$',
                description: 'Hotel moderno en el centro de Villarrica con habitaciones amplias y vista al lago.',
                tags: ['céntrico', 'wifi gratis', 'desayuno', 'vista lago', 'familiar'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'villarrica',
                name: 'Hotel Villarrica',
                address: 'General Korner 255, Villarrica',
                phone: '+56 45 241 1641',
                email: 'reservas@hotelycabanasvillarrica.cl',
                website: 'https://www.hotelycabanasvillarrica.cl',
                rating: 4,
                price: '$$',
                description: 'Hotel tradicional con cabañas, ubicado cerca del lago Villarrica y el centro de la ciudad.',
                tags: ['cabañas', 'familiar', 'estacionamiento', 'wifi', 'cerca del lago'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'villarrica',
                name: 'Hotel Lago Villarrica',
                address: 'Pedro de Valdivia 327, Villarrica',
                phone: '+56 45 241 6105',
                email: 'h.lagovillarrica@gmail.com',
                website: 'https://www.hotellagovillarrica.cl',
                rating: 3,
                price: '$',
                description: 'Hotel acogedor y económico en el centro de Villarrica, ideal para familias.',
                tags: ['económico', 'familiar', 'céntrico', 'wifi', 'desayuno'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'villarrica',
                name: 'Park Lake Luxury Hotel',
                address: 'Camino Villarrica-Pucón Km 13, Villarrica',
                phone: '+56 45 252 7200',
                email: 'reservas@parklakeluxury.com',
                website: 'https://www.parklakeluxury.com',
                rating: 5,
                price: '$$$',
                description: 'Hotel de lujo frente al lago Villarrica con spa, restaurante gourmet y vistas espectaculares.',
                tags: ['lujo', 'spa', 'vista lago', 'restaurante', 'piscina'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'villarrica',
                name: 'Hotel Licanray',
                address: 'Gral. Urrutia 585, Licanray, Villarrica',
                phone: '+56 2 2947 9338',
                email: 'reservas@hotellicanray.cl',
                website: 'https://www.hotellicanray.cl',
                rating: 4,
                price: '$$',
                description: 'Hotel boutique en Licanray con acceso directo a la playa del lago Villarrica.',
                tags: ['playa', 'boutique', 'vista lago', 'tranquilo', 'romántico'],
                createdAt: new Date().toISOString()
            },

            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'santiago',
                name: 'Mandarin Oriental Santiago',
                address: 'Av. Presidente Kennedy 4601, Las Condes, Santiago',
                phone: '+56 2 2950 3088',
                email: 'mosgo-reservations@mohg.com',
                website: 'https://www.mandarinoriental.com/santiago',
                rating: 5,
                price: '$$$$',
                description: 'Elegante hotel 5 estrellas con diseño contemporáneo, spa de clase mundial y gastronomía excepcional.',
                tags: ['lujo', 'spa', 'piscina', 'centro de negocios', 'wifi gratis'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'santiago',
                name: 'W Santiago',
                address: 'Isidora Goyenechea 3000, Las Condes, Santiago',
                phone: '+56 2 2770 0000',
                email: 'reservations.santiago@whotels.com',
                website: 'https://www.marriott.com/wsantiago',
                rating: 5,
                price: '$$$$',
                description: 'Hotel boutique moderno con diseño vanguardista, rooftop bar y ambiente cosmopolita en el distrito financiero.',
                tags: ['moderno', 'rooftop', 'bar', 'piscina', 'diseño'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'santiago',
                name: 'NH Collection Plaza Santiago',
                address: 'Av. Vitacura 2610, Las Condes, Santiago',
                phone: '+56 2 2433 9000',
                email: 'nhcollectionplazasantiago@nh-hotels.com',
                website: 'https://www.nh-hotels.com',
                rating: 4,
                price: '$$$',
                description: 'Hotel en el centro financiero con vistas a la Cordillera de Los Andes, ideal para viajes de negocios y placer.',
                tags: ['negocios', 'wifi gratis', 'restaurante', 'gimnasio', 'estacionamiento'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'santiago',
                name: 'Hotel Plaza San Francisco',
                address: 'Alameda 816, Santiago Centro',
                phone: '+56 2 2639 3832',
                email: 'reservas@plazasanfrancisco.cl',
                website: 'https://www.plazasanfrancisco.cl',
                rating: 4,
                price: '$$',
                description: 'Hotel céntrico con 146 habitaciones, ubicado cerca de los principales atractivos culturales de Santiago.',
                tags: ['céntrico', 'wifi gratis', 'desayuno', 'bar', 'accesible'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'vina-del-mar',
                name: 'Hotel Enjoy Viña del Mar',
                address: 'Av. San Martín 199, Viña del Mar',
                phone: '+56 32 250 0500',
                email: 'hvm.reservas@enjoy.cl',
                website: 'https://www.enjoy.cl/vina-del-mar',
                rating: 5,
                price: '$$$',
                description: 'Resort 5 estrellas frente al mar con casino, spa, múltiples restaurantes y espectáculos en vivo.',
                tags: ['casino', 'spa', 'playa', 'entretenimiento', 'resort'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'vina-del-mar',
                name: 'Pullman Viña del Mar San Martín',
                address: 'Av. San Martín 667, Viña del Mar',
                phone: '+56 32 250 0600',
                email: 'h9562@accor.com',
                website: 'https://www.pullmanhotels.com/chile',
                rating: 4,
                price: '$$$',
                description: 'Hotel moderno frente al mar con piscina climatizada, restaurante gourmet y vistas al Pacífico.',
                tags: ['playa', 'piscina', 'vista al mar', 'moderno', 'wifi gratis'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'valparaiso',
                name: 'Hotel Diego de Almagro Valparaíso',
                address: 'Molina 76, Valparaíso',
                phone: '+56 32 236 3200',
                email: 'reservas.valparaiso@dahoteles.com',
                website: 'https://www.dahoteles.com/valparaiso',
                rating: 4,
                price: '$$',
                description: 'Hotel céntrico en Valparaíso con fácil acceso a los cerros patrimoniales y el puerto.',
                tags: ['céntrico', 'wifi gratis', 'desayuno', 'estacionamiento', 'negocios'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'valparaiso',
                name: 'Hotel Da Vinci Valparaíso',
                address: 'Urriola 426-428, Cerro Alegre, Valparaíso',
                phone: '+56 32 244 2477',
                email: 'contacto@davincivalparaiso.cl',
                website: 'https://www.davincivalparaiso.cl',
                rating: 4,
                price: '$$',
                description: 'Boutique hotel en el histórico Cerro Alegre con vistas panorámicas de la bahía y diseño artístico.',
                tags: ['boutique', 'patrimonio', 'vista bahía', 'arte', 'romántico'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'concepcion',
                name: 'Hotel Concepción',
                address: 'Ignacio Serrano 512, Concepción',
                phone: '+56 41 299 4000',
                email: 'reservas@hotelconcepcion.cl',
                website: 'https://www.hotelconcepcion.cl',
                rating: 4,
                price: '$$',
                description: 'Hotel moderno en el centro de Concepción, ideal para negocios y turismo.',
                tags: ['negocios', 'céntrico', 'wifi gratis', 'restaurante', 'estacionamiento'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'vina-del-mar',
                name: 'Hotel Villamar',
                address: '2 Pte. 440, Viña del Mar',
                phone: '+56 32 268 5646',
                email: 'reservas@hotelvillamar.cl',
                website: 'https://www.hotelvillamar.cl',
                rating: 3,
                price: '$',
                description: 'Hotel familiar y acogedor en Viña del Mar con excelente relación calidad-precio.',
                tags: ['familiar', 'económico', 'wifi gratis', 'desayuno', 'acogedor'],
                createdAt: new Date().toISOString()
            },

            // ========== RESTAURANTES (11 restaurantes) ==========
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'santiago',
                name: 'Boragó',
                address: 'Av. Nueva Costanera 3467, Vitacura, Santiago',
                phone: '+56 2 2953 8893',
                email: 'reservas@borago.cl',
                website: 'https://www.borago.cl',
                rating: 5,
                price: '$$$$',
                description: 'Mejor restaurante de Chile, reconocido mundialmente. Cocina experimental con ingredientes nativos y endémicos de Chile.',
                tags: ['alta cocina', 'innovador', 'ingredientes locales', 'experiencia gastronómica'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'santiago',
                name: 'Ambrosia Bistró',
                address: 'Nueva de Lyon 99, Providencia, Santiago',
                phone: '+56 2 2946 9649',
                email: 'reservas@ambrosiabistro.cl',
                website: 'https://www.ambrosiabistro.cl',
                rating: 5,
                price: '$$$',
                description: 'Fusión de sabores franceses y chilenos, reconocido como uno de los mejores de Latinoamérica.',
                tags: ['fusión', 'francés', 'chileno', 'vinos', 'romántico'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'valparaiso',
                name: 'Portofino Restaurant',
                address: 'Bellamar 301, Valparaíso',
                phone: '+56 32 223 8521',
                email: 'contacto@portofino.cl',
                website: 'https://www.portofino.cl',
                rating: 4,
                price: '$$$',
                description: 'Gastronomía mediterránea con productos del mar chilenos, originalidad y sofisticación frente al océano.',
                tags: ['mediterráneo', 'mariscos', 'vista al mar', 'terraza', 'vinos'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'valparaiso',
                name: 'Poesía de Sabor',
                address: 'Monte Alegre 181, Valparaíso',
                phone: '+56 32 249 4977',
                email: 'reservas@poesiadesabor.cl',
                website: 'https://www.poesiadesabor.cl',
                rating: 4,
                price: '$$',
                description: 'Cocina chilena con enfoque íntimo y nostálgico, platos caseros y recetas de familia en el corazón de Valparaíso.',
                tags: ['chileno', 'casero', 'tradicional', 'familiar', 'acogedor'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'vina-del-mar',
                name: 'La Cocina del Mar',
                address: 'Av. del Mar 2500, Viña del Mar',
                phone: '+56 32 268 3210',
                email: 'reservas@lacocinadelmar.cl',
                website: 'https://www.lacocinadelmar.cl',
                rating: 4,
                price: '$$$',
                description: 'Restaurante especializado en mariscos frescos con una vista espectacular al océano Pacífico.',
                tags: ['mariscos', 'pescados', 'vista al mar', 'terraza', 'reservas'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'concepcion',
                name: 'Rincón Marino',
                address: 'Colo Colo 454, Concepción',
                phone: '+56 41 222 4477',
                email: 'contacto@rinconmarino.cl',
                website: 'https://www.rinconmarino.cl',
                rating: 4,
                price: '$$',
                description: 'Restaurante de mariscos y pescados frescos en el corazón de Concepción.',
                tags: ['mariscos', 'pescados', 'tradicional', 'familiar', 'fresco'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'concepcion',
                name: 'Terralomas Restaurant',
                address: 'Ramón Carrasco 355, Concepción',
                phone: '+56 41 228 4888',
                email: 'reservas@terralomas.cl',
                website: 'https://www.terralomas.cl',
                rating: 4,
                price: '$$$',
                description: 'Restaurante gourmet con cocina contemporánea y excelente carta de vinos.',
                tags: ['gourmet', 'contemporáneo', 'vinos', 'elegante', 'romántico'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'concepcion',
                name: 'Battir Restaurante',
                address: 'Veteranos del 79 408, Concepción',
                phone: '+56 41 242 5678',
                email: 'contacto@battir.cl',
                website: 'https://www.battir.cl',
                rating: 4,
                price: '$$',
                description: 'Cocina mediterránea y árabe con sabores auténticos y ambiente acogedor.',
                tags: ['mediterráneo', 'árabe', 'vegetariano', 'acogedor', 'especias'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'vina-del-mar',
                name: 'Donde Willy',
                address: '6 Norte 353, Viña del Mar',
                phone: '+56 32 297 1471',
                email: 'contacto@dondewilly.cl',
                website: 'https://www.dondewilly.cl',
                rating: 4,
                price: '$$',
                description: 'Restaurante tradicional chileno con platos caseros y ambiente familiar.',
                tags: ['chileno', 'tradicional', 'casero', 'familiar', 'porciones generosas'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'vina-del-mar',
                name: 'Divino Pecado',
                address: 'San Martín 180 Esquina 3 Norte, Viña del Mar',
                phone: '+56 32 268 2655',
                email: 'reservas@divinopecado.cl',
                website: 'https://www.divinopecado.cl',
                rating: 5,
                price: '$$$',
                description: 'Alta cocina con ingredientes premium, carta de vinos exclusiva y ambiente sofisticado.',
                tags: ['alta cocina', 'vinos premium', 'elegante', 'romántico', 'gourmet'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'concepcion',
                name: 'Faro Belén Restorán',
                address: 'Av. Colón 5995, Concepción',
                phone: '+56 41 241 5555',
                email: 'reservas@farobelen.cl',
                website: 'https://www.farobelen.cl',
                rating: 4,
                price: '$$$',
                description: 'Especialistas en mariscos y pescados con vista panorámica y ambiente elegante.',
                tags: ['mariscos', 'pescados', 'vista panorámica', 'elegante', 'eventos'],
                createdAt: new Date().toISOString()
            },
            // Restaurantes Villarrica
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'villarrica',
                name: 'Fuego Patagón',
                address: 'Pedro Montt 40, Villarrica',
                phone: '+56 45 241 2207',
                email: 'contacto@fuegopatagon.cl',
                website: 'https://www.fuegopatagon.cl',
                rating: 4,
                price: '$$$',
                description: 'Parrilla especializada en carnes premium y cortes patagónicos con ambiente acogedor.',
                tags: ['parrilla', 'carnes', 'patagónico', 'vinos', 'familiar'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'villarrica',
                name: 'Café 2001',
                address: 'Camilo Henríquez 379, Villarrica',
                phone: '+56 45 241 1470',
                email: 'contacto@cafebar2001.cl',
                website: 'https://www.cafebar2001.cl',
                rating: 4,
                price: '$$',
                description: 'Café bar tradicional con ambiente familiar, ideal para desayunos y almuerzos.',
                tags: ['café', 'desayuno', 'almuerzo', 'tradicional', 'familiar'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'villarrica',
                name: 'La Mesa del Sur',
                address: 'Anfión Muñoz 999 esquina Catedral, Villarrica',
                phone: '+56 45 241 1547',
                email: 'contacto@lamesa delsur.cl',
                website: 'https://www.instagram.com/lamesadelsur',
                rating: 4,
                price: '$$',
                description: 'Comida casera chilena con menú diario y platos tradicionales de la región.',
                tags: ['chileno', 'casero', 'menú diario', 'tradicional', 'económico'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'villarrica',
                name: 'El Rey del Marisco',
                address: 'Pedro de Valdivia 640, Villarrica',
                phone: '+56 9 7206 6163',
                email: 'contacto@elreydelmarisco.cl',
                website: 'https://www.elreydelmarisco.cl',
                rating: 4,
                price: '$$$',
                description: 'Especialistas en pescados y mariscos frescos con preparaciones internacionales.',
                tags: ['mariscos', 'pescados', 'internacional', 'fresco', 'terraza'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'villarrica',
                name: 'Albertina Pizza',
                address: 'Pedro de Valdivia 1092, Villarrica',
                phone: '+56 9 3275 2444',
                email: 'contacto@albertinapizza.cl',
                website: 'https://www.instagram.com/albertinapizza',
                rating: 4,
                price: '$$',
                description: 'Pizzería artesanal con masa madre y panes horneados, ambiente moderno y acogedor.',
                tags: ['pizza', 'masa madre', 'artesanal', 'moderno', 'delivery'],
                createdAt: new Date().toISOString()
            },

            // ========== SERVICIOS TURÍSTICOS (10 servicios) ==========
            // SERVICIOS DE EMERGENCIA VILLARRICA
            {
                id: this.generateId(),
                category: 'servicios',
                city: 'villarrica',
                name: '🚨 Hospital de Villarrica',
                address: 'San Martín 460, Villarrica',
                phone: '131',
                email: 'hospital.villarrica@redsalud.gob.cl',
                website: 'https://www.hospitalvillarrica.cl',
                rating: 5,
                price: '$',
                description: 'Hospital público de Villarrica con atención de urgencias 24 horas. Llamar al 131 (SAMU) para emergencias médicas.',
                tags: ['emergencia', 'hospital', 'urgencias', '24 horas', 'salud'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                city: 'villarrica',
                name: '🚓 Carabineros de Chile - 7ma Comisaría',
                address: 'Manuel Antonio Matta 230, Villarrica',
                phone: '133',
                email: 'comisaria.villarrica@carabineros.cl',
                website: 'https://www.carabineros.cl',
                rating: 5,
                price: '$',
                description: 'Comisaría de Carabineros de Villarrica. Llamar al 133 para emergencias policiales o denuncias.',
                tags: ['emergencia', 'policía', 'seguridad', '24 horas', 'denuncias'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                city: 'villarrica',
                name: '🚒 Bomberos de Villarrica',
                address: 'Valentín Letelier 630, Centro, Villarrica',
                phone: '132',
                email: 'bomberos.villarrica@bomberos.cl',
                website: 'https://www.bomberos.cl',
                rating: 5,
                price: '$',
                description: 'Cuerpo de Bomberos de Villarrica. Llamar al 132 para emergencias de incendios, rescates y accidentes.',
                tags: ['emergencia', 'bomberos', 'incendios', 'rescate', '24 horas'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                city: 'villarrica',
                name: '🔍 PDI - Policía de Investigaciones',
                address: 'José Miguel Carrera 825, Villarrica',
                phone: '134',
                email: 'brigada.villarrica@investigaciones.cl',
                website: 'https://www.pdichile.cl',
                rating: 5,
                price: '$',
                description: 'Brigada de Investigación Criminal de Villarrica. Llamar al 134 para denuncias e investigaciones.',
                tags: ['emergencia', 'investigaciones', 'denuncias', 'seguridad', 'PDI'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                city: 'villarrica',
                name: '🚑 SAMU - Servicio de Atención Médica de Urgencia',
                address: 'Servicio móvil de emergencias médicas',
                phone: '131',
                email: 'samu.araucania@minsal.cl',
                website: 'https://www.samu.cl',
                rating: 5,
                price: '$',
                description: 'Servicio de Atención Médica de Urgencia. Ambulancias y atención pre-hospitalaria 24/7.',
                tags: ['emergencia', 'ambulancia', 'urgencias', '24 horas', 'médico'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                city: 'villarrica',
                name: '📞 Emergencias Municipales Villarrica',
                address: 'Municipalidad de Villarrica',
                phone: '+56 9 5802 6520',
                email: 'emergencias@villarrica.cl',
                website: 'https://www.villarrica.cl',
                rating: 5,
                price: '$',
                description: 'Línea de emergencias municipales de Villarrica, habilitada 24 horas para emergencias locales y coordinación.',
                tags: ['emergencia', 'municipal', '24 horas', 'coordinación', 'ayuda'],
                createdAt: new Date().toISOString()
            },

            {
                id: this.generateId(),
                category: 'servicios',
                city: 'santiago',
                name: 'Turistik Chile',
                address: 'Infocenters en Aeropuerto, Costanera Center, Plaza de Armas',
                phone: '+56 2 2364 6355',
                email: 'contacto@turistik.com',
                website: 'https://www.turistik.com',
                rating: 5,
                price: '$$',
                description: 'Tours exclusivos a la montaña, costa y viñedos. Autobús oficial Hop-On Hop-Off de Santiago.',
                tags: ['city tours', 'viñedos', 'montaña', 'hop-on hop-off', 'tickets'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                city: 'santiago',
                name: 'Lucero Travel Chile',
                address: 'Av. Providencia 2653, Providencia, Santiago',
                phone: '+56 2 2231 6000',
                email: 'info@lucerotravelchile.cl',
                website: 'https://www.lucerotravelchile.cl',
                rating: 4,
                price: '$$',
                description: 'Especializados en tours en Santiago y alrededores: City Tour, Valparaíso, viñedos Concha y Toro.',
                tags: ['city tour', 'valparaíso', 'viñedos', 'tours privados', 'safaris'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                city: 'santiago',
                name: 'CHIRAK Chile',
                address: 'Galvarino Gallardo 1941, Providencia, Santiago',
                phone: '+56 9 7707 5563',
                email: 'contacto@chirak.cl',
                website: 'https://www.chirak.cl',
                rating: 5,
                price: '$$$',
                description: 'Tour operador con programas para Norte, Islas, Centro, Sur, Patagonia y Antártica. Multidestinos nacionales.',
                tags: ['patagonia', 'isla de pascua', 'atacama', 'torres del paine', 'multidestino'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                name: 'GoChile',
                address: 'Av. Apoquindo 4775, Las Condes, Santiago',
                phone: '+56 2 2430 3000',
                email: 'info@gochile.cl',
                website: 'https://www.gochile.cl',
                rating: 4,
                price: '$$',
                description: 'Agencia de viajes con hoteles, tours, rent a car, cruceros y paquetes por todo Chile.',
                tags: ['tours', 'hoteles', 'rent a car', 'cruceros', 'paquetes'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                name: 'Destino Chile',
                address: 'Huérfanos 1160, Oficina 1102, Santiago',
                phone: '+56 9 7143 9595',
                email: 'contacto@destinochile.cl',
                website: 'https://www.destinochile.cl',
                rating: 4,
                price: '$$',
                description: 'Operador mayorista con más de 25 años. Tours en San Pedro de Atacama, Isla de Pascua, Torres del Paine.',
                tags: ['atacama', 'isla de pascua', 'torres del paine', 'city tour', 'mayorista'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                name: 'Hertz Rent a Car',
                address: 'Av. Isidora Goyenechea 2897, Las Condes, Santiago',
                phone: '+56 2 2712 8787',
                email: 'reservas@hertz.cl',
                website: 'https://www.hertz.cl',
                rating: 5,
                price: '$$',
                description: 'Arriendo de autos con oficinas en aeropuerto y ciudad. Flota moderna y seguros completos.',
                tags: ['rent a car', 'aeropuerto', 'seguros', 'flota moderna', 'gps'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                name: 'Budget Rent a Car',
                address: 'Luz 2934, Las Condes, Santiago',
                phone: '+56 2 2795 3900',
                email: 'reservas@budget.cl',
                website: 'https://www.budget.cl',
                rating: 4,
                price: '$',
                description: 'Arriendo de vehículos económicos con excelente servicio y múltiples sucursales.',
                tags: ['rent a car', 'económico', 'aeropuerto', 'ciudad', 'ofertas'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                name: 'Avis Rent a Car',
                address: 'Av. Providencia 1971, Santiago',
                phone: '+56 2 2795 3900',
                email: 'reservas@avis.cl',
                website: 'https://www.avis.cl',
                rating: 4,
                price: '$$',
                description: 'Empresa internacional de arriendo de autos con amplia cobertura en Chile.',
                tags: ['rent a car', 'internacional', 'aeropuerto', 'seguros', 'asistencia 24/7'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                name: 'Europcar Chile',
                address: 'Morandé 26, Nivel -1, Santiago Centro',
                phone: '+56 2 2299 8980',
                email: 'reservas@europcar.cl',
                website: 'https://www.europcar.cl',
                rating: 4,
                price: '$$',
                description: 'Arriendo de autos con servicio premium y vehículos de última generación.',
                tags: ['rent a car', 'premium', 'vehículos nuevos', 'aeropuerto', 'whatsapp'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'servicios',
                name: 'Chilean Rent a Car',
                address: 'Bellavista 0183, Santiago',
                phone: '+56 2 2963 8760',
                email: 'reservas@chileanrentacar.cl',
                website: 'https://www.chileanrentacar.cl',
                rating: 4,
                price: '$',
                description: 'Empresa chilena de arriendo de autos con tarifas competitivas y atención personalizada.',
                tags: ['rent a car', 'local', 'económico', 'personalizado', 'flexible'],
                createdAt: new Date().toISOString()
            },

            // ========== ATRACTIVOS TURÍSTICOS (10 atractivos) ==========
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'santiago',
                name: 'Museo Nacional de Bellas Artes',
                address: 'José Miguel de la Barra 650, Parque Forestal, Santiago',
                phone: '+56 2 2499 1600',
                email: 'mnba@mnba.cl',
                website: 'https://www.mnba.cl',
                rating: 5,
                price: '$',
                description: 'Principal museo de arte de Chile con colecciones de arte chileno y latinoamericano. Entrada gratuita.',
                tags: ['museo', 'arte', 'cultura', 'gratuito', 'exposiciones'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                name: 'Parque Nacional Torres del Paine',
                address: 'Región de Magallanes, 145 km de Puerto Natales',
                phone: '+56 61 269 1931',
                email: 'torresdelpaine.oirs@conaf.cl',
                website: 'https://www.torresdelpaine.com',
                rating: 5,
                price: '$$',
                description: 'Uno de los parques más espectaculares del mundo con glaciares, montañas y fauna única de la Patagonia.',
                tags: ['naturaleza', 'trekking', 'glaciares', 'montañas', 'patagonia'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'santiago',
                name: 'Museo de la Memoria y los Derechos Humanos',
                address: 'Matucana 501, Santiago',
                phone: '+56 2 2597 9600',
                email: 'contacto@museodelamemoria.cl',
                website: 'https://www.museodelamemoria.cl',
                rating: 5,
                price: '$',
                description: 'Museo dedicado a las víctimas de violaciones de derechos humanos durante la dictadura militar. Entrada gratuita.',
                tags: ['museo', 'historia', 'cultura', 'gratuito', 'educativo'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                name: 'Monumento Natural La Portada',
                address: 'Km 18 al norte de Antofagasta, Ruta 1',
                phone: '+56 55 223 8382',
                email: 'antofagasta.oirs@conaf.cl',
                website: 'https://www.conaf.cl',
                rating: 5,
                price: '$',
                description: 'Icónico arco de piedra natural en el océano Pacífico, símbolo de la región de Antofagasta. Entrada gratuita.',
                tags: ['naturaleza', 'fotografía', 'playa', 'gratuito', 'paisaje'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                name: 'Parque Nacional Conguillío',
                address: 'Región de La Araucanía, comunas de Curacautín y Melipeuco',
                phone: '+56 45 297 3200',
                email: 'conguillio.oirs@conaf.cl',
                website: 'https://www.conaf.cl',
                rating: 5,
                price: '$$',
                description: 'Parque con volcán Llaima activo, bosques de araucarias milenarias y lagunas de origen volcánico.',
                tags: ['volcán', 'araucarias', 'trekking', 'naturaleza', 'camping'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'valparaiso',
                name: 'Museo de Historia Natural de Valparaíso',
                address: 'Condell 1546, Valparaíso',
                phone: '+56 32 254 4840',
                email: 'mhnv@mhnv.gob.cl',
                website: 'https://www.mhnv.gob.cl',
                rating: 4,
                price: '$',
                description: 'Museo con colecciones de historia natural, paleontología y biodiversidad de Chile. Entrada gratuita.',
                tags: ['museo', 'naturaleza', 'ciencia', 'gratuito', 'educativo'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'valparaiso',
                name: 'Museo Palacio Baburizza',
                address: 'Paseo Yugoslavo 176, Cerro Alegre, Valparaíso',
                phone: '+56 32 225 2332',
                email: 'museo@museobaburizza.cl',
                website: 'https://www.museobaburizza.cl',
                rating: 5,
                price: '$',
                description: 'Museo de Bellas Artes en palacio histórico con vistas panorámicas de Valparaíso.',
                tags: ['museo', 'arte', 'patrimonio', 'vista panorámica', 'arquitectura'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'concepcion',
                name: 'Museo de Historia Natural de Concepción',
                address: 'Maipú 2359, Plaza Acevedo, Concepción',
                phone: '+56 41 231 0095',
                email: 'mhnconcepcion@mhnconcepcion.gob.cl',
                website: 'https://www.mhnconcepcion.gob.cl',
                rating: 4,
                price: '$',
                description: 'Museo con colecciones de fauna, flora y geología de la región del Biobío. Entrada gratuita.',
                tags: ['museo', 'naturaleza', 'ciencia', 'gratuito', 'regional'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'concepcion',
                name: 'Galería de la Historia de Concepción',
                address: 'Hospicio 40, esquina Lincoyán, Concepción',
                phone: '+56 41 274 1114',
                email: 'contacto@ghconcepcion.cl',
                website: 'https://www.ghconcepcion.cl',
                rating: 4,
                price: '$',
                description: 'Museo interactivo que recorre la historia de Concepción desde sus orígenes.',
                tags: ['museo', 'historia', 'interactivo', 'educativo', 'familia'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'concepcion',
                name: 'Parque Museo Pedro del Río Zañartu',
                address: 'Fundo Hualpén S/N, Camino a la Desembocadura, Hualpén',
                phone: '+56 41 241 5222',
                email: 'contacto@prz.cl',
                website: 'https://www.prz.cl',
                rating: 5,
                price: '$',
                description: 'Parque histórico con museo, jardines botánicos y colecciones arqueológicas.',
                tags: ['parque', 'museo', 'jardines', 'historia', 'naturaleza'],
                createdAt: new Date().toISOString()
            },
            // Atractivos Turísticos Villarrica/Pucón
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'villarrica',
                name: 'Parque Nacional Villarrica',
                address: '8 km al suroeste de Pucón, Región de La Araucanía',
                phone: '+56 45 297 3200',
                email: 'villarrica.oirs@conaf.cl',
                website: 'https://www.conaf.cl',
                rating: 5,
                price: '$$',
                description: 'Parque nacional con el volcán Villarrica activo, bosques de araucarias y centro de esquí. Ideal para trekking y observación de fauna.',
                tags: ['volcán', 'trekking', 'naturaleza', 'esquí', 'araucarias'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'villarrica',
                name: 'Termas Geométricas',
                address: 'Km 16 camino Coñaripe a Palguín, Parque Nacional Villarrica',
                phone: '+56 45 241 9090',
                email: 'info@termasgeometricas.cl',
                website: 'https://www.termasgeometricas.cl',
                rating: 5,
                price: '$$$',
                description: 'Complejo termal único con 18 piscinas de piedra sobre pasarelas de madera roja en medio del bosque nativo.',
                tags: ['termas', 'relax', 'naturaleza', 'diseño', 'bosque'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'pucon',
                name: 'Ojos del Caburgua',
                address: 'Ruta Pucón-Caburgua S-905 Km 17, Pucón',
                phone: '+56 9 8765 4321',
                email: 'info@ojosdelcaburgua.cl',
                website: 'https://www.caburgua.com',
                rating: 5,
                price: '$',
                description: 'Pozones y cascadas de agua turquesa formados por el desagüe subterráneo del Lago Caburgua, rodeados de bosque nativo.',
                tags: ['cascadas', 'naturaleza', 'fotografía', 'trekking', 'familia'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'pucon',
                name: 'Parque Nacional Huerquehue',
                address: 'Camino Pucón-Caburgua, desvío a Paillaco, Pucón',
                phone: '+56 45 297 3200',
                email: 'huerquehue.oirs@conaf.cl',
                website: 'https://www.conaf.cl',
                rating: 5,
                price: '$$',
                description: 'Parque con impresionantes bosques de araucarias milenarias, lagos cristalinos y senderos panorámicos.',
                tags: ['trekking', 'araucarias', 'lagos', 'naturaleza', 'fotografía'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'pucon',
                name: 'Centro de Ski Pucón',
                address: 'Camino El Volcán Km 16, Parque Nacional Villarrica, Pucón',
                phone: '+56 45 244 1901',
                email: 'info@centropillan.cl',
                website: 'https://www.centropillan.cl',
                rating: 4,
                price: '$$$',
                description: 'Centro de esquí en las faldas del Volcán Villarrica con pistas para todos los niveles y vistas espectaculares.',
                tags: ['esquí', 'snowboard', 'invierno', 'volcán', 'deportes'],
                createdAt: new Date().toISOString()
            },

            // ========== AGENCIAS DE VIAJE (10 agencias) ==========
            {
                id: this.generateId(),
                category: 'agencias',
                city: 'santiago',
                name: 'Cocha',
                address: 'Av. Apoquindo 3000, Oficina 401, Las Condes, Santiago',
                phone: '+56 2 2464 1300',
                email: 'contacto@cocha.com',
                website: 'https://www.cocha.com',
                rating: 5,
                price: '$$$',
                description: 'Una de las agencias más importantes de Chile con más de 70 años de trayectoria. Atención 24 horas.',
                tags: ['experiencia', 'confiable', 'emergencias 24/7', 'corporativo', 'vacacional'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                name: 'Turavion',
                address: 'Carmencita 10, Las Condes, Santiago',
                phone: '+56 2 2330 0800',
                email: 'vacaciones@turavion.com',
                website: 'https://www.turavion.com',
                rating: 5,
                price: '$$$',
                description: 'Más de 90 años de experiencia en viajes vacacionales y corporativos. Oficinas en casa matriz y aeropuerto.',
                tags: ['experiencia', 'vacacional', 'corporativo', 'aeropuerto', 'confiable'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                name: 'My Horizon',
                address: 'Av. Vitacura 2939, Oficina 301, Las Condes, Santiago',
                phone: '+56 22 566 8917',
                email: 'contacto@myhorizon.cl',
                website: 'https://www.myhorizon.cl',
                rating: 4,
                price: '$$',
                description: 'Agencia boutique con atención personalizada y diversos paquetes turísticos a medida.',
                tags: ['personalizado', 'boutique', 'paquetes', 'asesoría', 'a medida'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                name: 'Viajes El Corte Inglés',
                address: 'Cerro Colorado 5030, Piso 9, Las Condes, Santiago',
                phone: '+56 600 600 0100',
                email: 'info@viajeselcorteingles.cl',
                website: 'https://www.viajeselcorteingles.cl',
                rating: 4,
                price: '$$$',
                description: 'Agencia reconocida por su asesoría de calidad en viajes internacionales y nacionales.',
                tags: ['internacional', 'asesoría', 'calidad', 'europa', 'paquetes'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                name: 'Travel Security',
                address: 'Av. Apoquindo 3180, Las Condes, Santiago',
                phone: '+56 2 2584 3400',
                email: 'asistenciaweb@security.cl',
                website: 'https://www.travelsecurity.cl',
                rating: 4,
                price: '$$',
                description: 'Agencia de viajes con respaldo de Banco Security, especializada en viajes corporativos y vacacionales.',
                tags: ['corporativo', 'seguro', 'banco', 'asistencia', 'confiable'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                name: 'Blanco Viajes',
                address: 'Av. Providencia 1760, Providencia, Santiago',
                phone: '+56 2 2233 1000',
                email: 'contacto@blancoviajes.com',
                website: 'https://www.blancoviajes.com',
                rating: 4,
                price: '$$',
                description: 'Agencia especializada en viajes corporativos e incentivos con servicio personalizado.',
                tags: ['corporativo', 'incentivos', 'personalizado', 'eventos', 'grupos'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                name: 'Altotravel',
                address: 'Av. Providencia 2653, Oficina 508, Providencia, Santiago',
                phone: '+56 2 2231 5500',
                email: 'gerencia@altotravel.cl',
                website: 'https://www.altotravel.cl',
                rating: 4,
                price: '$$$',
                description: 'Tour operador mayorista enfocado en turismo emisivo con programas a todo el mundo.',
                tags: ['mayorista', 'internacional', 'grupos', 'cruceros', 'peregrinaciones'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                name: 'Party Travel',
                address: 'Rafael Cañas 50, Oficina D4, Providencia, Santiago',
                phone: '+56 9 5893 6585',
                email: 'contacto@partytravel.cl',
                website: 'https://www.partytravel.cl',
                rating: 4,
                price: '$$',
                description: 'Agencia y tour operador con paquetes turísticos y tickets aéreos a destinos nacionales e internacionales.',
                tags: ['paquetes', 'tickets aéreos', 'jóvenes', 'grupos', 'ofertas'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                city: 'santiago',
                name: 'TAC Turismo',
                address: 'Doctor Barros Borgoño 160, Santiago',
                phone: '+56 9 6353 0267',
                email: 'contacto@tacturismo.cl',
                website: 'https://www.tacturismo.cl',
                rating: 4,
                price: '$$',
                description: 'Especialistas en tours y excursiones en Santiago y sus alrededores.',
                tags: ['tours', 'excursiones', 'santiago', 'viñedos', 'valparaíso'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'agencias',
                city: 'santiago',
                name: 'Andina del Sud',
                address: 'Av. Las Condes 10690, Las Condes, Santiago',
                phone: '+56 2 2445 2000',
                email: 'reservas@andinadelsud.cl',
                website: 'https://www.andinadelsud.cl',
                rating: 5,
                price: '$$$',
                description: 'Tour operador receptivo con más de 60 años de experiencia en turismo en Chile y Sudamérica.',
                tags: ['receptivo', 'experiencia', 'sudamérica', 'lujo', 'personalizado'],
                createdAt: new Date().toISOString()
            },
            // Puerto Varas
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'puerto-varas',
                name: 'Hotel Cabaña del Lago',
                address: 'Klenner 195, Puerto Varas',
                phone: '+56 65 220 0100',
                email: 'reservas@cabanasdelago.cl',
                website: 'https://www.hotelcabanadellago.cl',
                rating: 5,
                price: '$$$',
                description: 'Hotel icónico con vista panorámica al lago Llanquihue y volcanes. Arquitectura alemana y spa.',
                tags: ['vista lago', 'spa', 'tradicional', 'piscina', 'alemán'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'puerto-varas',
                name: 'Hotel Bellavista',
                address: 'Vicente Pérez Rosales 60, Puerto Varas',
                phone: '+56 65 220 6200',
                email: 'reservas@hotelbellavista.cl',
                website: 'https://www.hotelbellavista.cl',
                rating: 4,
                price: '$$$',
                description: 'Ubicación privilegiada frente al lago, gastronomía de excelencia y salones de eventos.',
                tags: ['frente al lago', 'céntrico', 'eventos', 'gastronomía', 'clásico'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'puerto-varas',
                name: 'Casa Valdés',
                address: 'Santa Rosa 040, Puerto Varas',
                phone: '+56 65 223 2060',
                email: 'reservas@casavaldes.cl',
                website: 'https://www.casavaldes.cl',
                rating: 5,
                price: '$$$$',
                description: 'Especialidad en pescados y mariscos con influencia vasca. Reconocido por su calidad y servicio.',
                tags: ['mariscos', 'vasco', 'gourmet', 'elegante', 'vinos'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'puerto-varas',
                name: 'La Marca',
                address: 'Santa Rosa 539, Puerto Varas',
                phone: '+56 65 223 2020',
                email: 'contacto@lamarca.cl',
                website: 'https://www.lamarca.cl',
                rating: 4,
                price: '$$$',
                description: 'Las mejores carnes a las brasas en un ambiente rústico y acogedor típico del sur.',
                tags: ['carnes', 'parrilla', 'rústico', 'vinos', 'sur'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'puerto-varas',
                name: 'Lago Llanquihue',
                address: 'Costanera de Puerto Varas',
                phone: '+56 65 236 1175',
                email: 'turismo@ptovaras.cl',
                website: 'https://www.ptovaras.cl',
                rating: 5,
                price: '$',
                description: 'Segundo lago más grande de Chile, ofrece vistas espectaculares a los volcanes Osorno y Calbuco.',
                tags: ['lago', 'naturaleza', 'fotografía', 'paseos', 'gratuito'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'puerto-varas',
                name: 'Saltos del Petrohué',
                address: 'Ruta 225 Km 64, Parque Nacional Vicente Pérez Rosales',
                phone: '+56 65 223 6150',
                email: 'vicenteperezrosales.oirs@conaf.cl',
                website: 'https://www.conaf.cl',
                rating: 5,
                price: '$',
                description: 'Cascadas de agua color esmeralda sobre roca volcánica, uno de los paisajes más bellos del sur.',
                tags: ['cascadas', 'naturaleza', 'trekking', 'fotografía', 'parque nacional'],
                createdAt: new Date().toISOString()
            },

            // La Serena
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'la-serena',
                name: 'Hotel Club La Serena',
                address: 'Av. del Mar 1000, La Serena',
                phone: '+56 51 222 1262',
                email: 'reservas@clublaserena.com',
                website: 'https://www.clublaserena.com',
                rating: 4,
                price: '$$$',
                description: 'Hotel frente al mar con amplios jardines, piscina y acceso directo a la playa.',
                tags: ['playa', 'jardines', 'piscina', 'familiar', 'eventos'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'hoteles',
                city: 'la-serena',
                name: 'Hotel Costa Real',
                address: 'Av. Francisco de Aguirre 170, La Serena',
                phone: '+56 51 222 1010',
                email: 'reservas@costareal.cl',
                website: 'https://www.costareal.cl',
                rating: 4,
                price: '$$',
                description: 'Hotel clásico en el centro de la ciudad, combina arquitectura colonial con comodidades modernas.',
                tags: ['céntrico', 'colonial', 'negocios', 'restaurante', 'confort'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'la-serena',
                name: 'Bakulic',
                address: 'Av. del Mar 5700, La Serena',
                phone: '+56 51 224 5755',
                email: 'reservas@bakulic.cl',
                website: 'https://www.bakulic.cl',
                rating: 5,
                price: '$$$',
                description: 'Restaurante con vista al mar especializado en pescados y mariscos de la zona.',
                tags: ['vista al mar', 'mariscos', 'terraza', 'elegante', 'romántico'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'restaurantes',
                city: 'la-serena',
                name: 'Huentelauquén',
                address: 'Av. del Mar 4500, La Serena',
                phone: '+56 51 221 1234',
                email: 'contacto@huentelauquen.cl',
                website: 'https://www.huentelauquen.cl',
                rating: 4,
                price: '$$',
                description: 'Famoso por sus empanadas de queso y pizzas, un clásico de la Avenida del Mar.',
                tags: ['empanadas', 'pizza', 'familiar', 'casual', 'playa'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'la-serena',
                name: 'Faro Monumental',
                address: 'Av. del Mar con Francisco de Aguirre, La Serena',
                phone: '+56 51 220 6600',
                email: 'turismo@laserena.cl',
                website: 'https://www.laserena.cl',
                rating: 5,
                price: '$',
                description: 'Icono de la ciudad, monumento histórico y mirador turístico frente al océano.',
                tags: ['monumento', 'historia', 'fotografía', 'gratuito', 'icono'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'atractivos',
                city: 'la-serena',
                name: 'Valle del Elqui',
                address: 'Ruta 41, Interior de La Serena',
                phone: '+56 51 222 5199',
                email: 'info@valledelelqui.cl',
                website: 'https://www.turismoregiondecoquimbo.cl',
                rating: 5,
                price: '$',
                description: 'Valle místico conocido por sus viñedos, producción de pisco y cielos más limpios del mundo para astronomía.',
                tags: ['naturaleza', 'astronomía', 'pisco', 'místico', 'paisaje'],
                createdAt: new Date().toISOString()
            },

            // ========== SUPERMERCADOS (6 supermercados) ==========
            {
                id: this.generateId(),
                category: 'supermercados',
                city: 'villarrica',
                name: 'Líder Villarrica',
                address: 'Pedro de Valdivia 1060, Villarrica',
                phone: '+56 600 600 5000',
                email: 'contacto@lider.cl',
                website: 'https://www.lider.cl',
                rating: 4,
                price: '$$',
                description: 'Supermercado con amplia variedad de productos, sección gourmet y servicios adicionales como farmacia.',
                tags: ['abierto hasta tarde', 'estacionamiento', 'farmacia', 'panadería', 'carnes'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'supermercados',
                city: 'villarrica',
                name: 'Tottus Villarrica',
                address: 'Av. Vicuña Mackenna 1170, Villarrica',
                phone: '+56 600 611 0000',
                email: 'contacto@tottus.cl',
                website: 'https://www.tottus.cl',
                rating: 4,
                price: '$$',
                description: 'Supermercado con productos frescos, sección orgánica y precios competitivos.',
                tags: ['productos orgánicos', 'frutas y verduras', 'pescadería', 'wifi', 'cajeros automáticos'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'supermercados',
                city: 'santiago',
                name: 'Jumbo Kennedy',
                address: 'Av. Kennedy 9001, Las Condes, Santiago',
                phone: '+56 2 3333 0000',
                email: 'contacto@jumbo.cl',
                website: 'https://www.jumbo.cl',
                rating: 5,
                price: '$$$',
                description: 'Hipermercado premium con sección gourmet, productos importados y servicios completos.',
                tags: ['24 horas', 'importados', 'gourmet', 'estacionamiento subterráneo', 'delivery'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'supermercados',
                city: 'santiago',
                name: 'Santa Isabel Providencia',
                address: 'Av. Providencia 2594, Providencia, Santiago',
                phone: '+56 600 600 2000',
                email: 'contacto@santaisabel.cl',
                website: 'https://www.santaisabel.cl',
                rating: 4,
                price: '$$',
                description: 'Supermercado de barrio con productos frescos y buen servicio al cliente.',
                tags: ['céntrico', 'fiambrería', 'panadería', 'frutas frescas', 'estacionamiento'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'supermercados',
                city: 'valparaiso',
                name: 'Montserrat Valparaíso',
                address: 'Av. Argentina 475, Valparaíso',
                phone: '+56 32 225 5000',
                email: 'contacto@montserrat.cl',
                website: 'https://www.montserrat.cl',
                rating: 4,
                price: '$$',
                description: 'Supermercado local con productos del mar frescos y especialidades de la región.',
                tags: ['productos locales', 'mariscos frescos', 'pan artesanal', 'familiar', 'estacionamiento'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'supermercados',
                city: 'concepcion',
                name: 'Unimarc Concepción Centro',
                address: 'Barros Arana 565, Concepción',
                phone: '+56 600 600 8000',
                email: 'contacto@unimarc.cl',
                website: 'https://www.unimarc.cl',
                rating: 4,
                price: '$$',
                description: 'Supermercado céntrico con variedad de productos y programa de fidelización.',
                tags: ['céntrico', 'tarjeta de puntos', 'ofertas', 'panadería', 'carnicería'],
                createdAt: new Date().toISOString()
            },

            // ========== TIENDAS (6 tiendas) ==========
            {
                id: this.generateId(),
                category: 'tiendas',
                city: 'villarrica',
                name: 'Feria Artesanal Villarrica',
                address: 'Costanera Villarrica, frente al lago',
                phone: '+56 45 241 1860',
                email: 'feria@villarrica.cl',
                website: 'https://www.villarrica.cl/turismo',
                rating: 5,
                price: '$$',
                description: 'Feria artesanal con productos locales: tejidos mapuche, tallados en madera, cerámica y souvenirs únicos.',
                tags: ['artesanía', 'mapuche', 'souvenirs', 'productos locales', 'regalos'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'tiendas',
                city: 'villarrica',
                name: 'Outdoor Villarrica',
                address: 'Pedro de Valdivia 950, Villarrica',
                phone: '+56 45 241 2580',
                email: 'info@outdoorvillarrica.cl',
                website: 'https://www.outdoorvillarrica.cl',
                rating: 4,
                price: '$$$',
                description: 'Tienda especializada en equipamiento outdoor: trekking, camping, escalada y deportes de aventura.',
                tags: ['outdoor', 'camping', 'trekking', 'montañismo', 'deportes aventura'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'tiendas',
                city: 'santiago',
                name: 'Costanera Center',
                address: 'Av. Andrés Bello 2425, Providencia, Santiago',
                phone: '+56 2 2916 9200',
                email: 'info@costaneracenter.cl',
                website: 'https://www.costaneracenter.cl',
                rating: 5,
                price: '$$$',
                description: 'El mall más grande de Sudamérica con más de 300 tiendas, cines y la Torre Sky Costanera.',
                tags: ['shopping', 'mall', 'marcas internacionales', 'cine', 'restaurantes'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'tiendas',
                city: 'santiago',
                name: 'Pueblito Los Dominicos',
                address: 'Av. Apoquindo 9085, Las Condes, Santiago',
                phone: '+56 2 2215 1623',
                email: 'contacto@pueblitolosdominicos.cl',
                website: 'https://www.pueblitolosdominicos.cl',
                rating: 5,
                price: '$$',
                description: 'Feria artesanal con más de 160 artesanos que ofrecen cerámica, orfebrería, tejidos y productos típicos chilenos.',
                tags: ['artesanía', 'cerámica', 'tejidos', 'souvenirs', 'productos chilenos'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'tiendas',
                city: 'valparaiso',
                name: 'Paseo Yugoslavo Tiendas',
                address: 'Paseo Yugoslavo, Cerro Alegre, Valparaíso',
                phone: '+56 32 249 6000',
                email: 'info@paseoyu goslavo.cl',
                website: 'https://www.valparaisoturismo.cl',
                rating: 4,
                price: '$$',
                description: 'Zona de tiendas y galerías de arte con productos artesanales y souvenirs porteños.',
                tags: ['arte', 'galerías', 'souvenirs', 'patrimonio', 'productos locales'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'tiendas',
                city: 'vina-del-mar',
                name: 'Marina Arauco',
                address: 'Av. Libertad 1348, Viña del Mar',
                phone: '+56 32 288 3000',
                email: 'informaciones@parquearauco.cl',
                website: 'https://www.marinaarauco.cl',
                rating: 5,
                price: '$$$',
                description: 'Centro comercial premium con tiendas de lujo, restaurantes y entretenimiento.',
                tags: ['mall', 'marcas premium', 'cine', 'restaurantes', 'estacionamiento'],
                createdAt: new Date().toISOString()
            },

            // ========== ACTIVIDADES (6 actividades) ==========
            {
                id: this.generateId(),
                category: 'actividades',
                city: 'villarrica',
                name: 'Ascenso al Volcán Villarrica',
                address: 'Salida desde Centro de Ski Pucón',
                phone: '+56 45 244 1070',
                email: 'info@summitchile.com',
                website: 'https://www.summitchile.com',
                rating: 5,
                price: '$$$$ ',
                description: 'Ascenso guiado al cráter del volcán Villarrica activo. Incluye equipo completo y guía certificado.',
                tags: ['montañismo', 'volcán', 'aventura', 'trekking', 'guía incluido'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'actividades',
                city: 'villarrica',
                name: 'Kayak en Lago Villarrica',
                address: 'Playa Grande, Villarrica',
                phone: '+56 9 8765 4321',
                email: 'reservas@kayakvillarrica.cl',
                website: 'https://www.kayakvillarrica.cl',
                rating: 5,
                price: '$$',
                description: 'Alquiler de kayaks y tours guiados por el lago Villarrica con vistas al volcán.',
                tags: ['kayak', 'lago', 'tour guiado', 'naturaleza', 'familia'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'actividades',
                city: 'santiago',
                name: 'Tour a Pie por el Centro Histórico',
                address: 'Plaza de Armas, Santiago Centro',
                phone: '+56 2 2633 6000',
                email: 'tours@santiagowalk ing.cl',
                website: 'https://www.santiagowalking.cl',
                rating: 5,
                price: '$',
                description: 'Tour gratuito a pie por los principales monumentos del centro histórico de Santiago.',
                tags: ['walking tour', 'historia', 'gratis', 'cultura', 'guía español'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'actividades',
                city: 'santiago',
                name: 'Ski en Valle Nevado',
                address: 'Valle Nevado, Cordillera de los Andes',
                phone: '+56 2 2477 7000',
                email: 'info@vallenevado.com',
                website: 'https://www.vallenevado.com',
                rating: 5,
                price: '$$$$',
                description: 'Centro de ski de clase mundial a 60 km de Santiago. Incluye pistas para todos los niveles.',
                tags: ['ski', 'snowboard', 'montaña', 'nieve', 'alquiler equipos'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'actividades',
                city: 'valparaiso',
                name: 'Tour en Trolley Patrimonial',
                address: 'Muelle Prat, Valparaíso',
                phone: '+56 32 225 9197',
                email: 'info@trolleyvalparaiso.cl',
                website: 'https://www.valparaisotours.cl',
                rating: 4,
                price: '$$',
                description: 'Recorrido en trolleybus por los cerros patrimoniales de Valparaíso con comentarios turísticos.',
                tags: ['tour', 'cerros', 'patrimonio', 'turístico', 'cultural'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'actividades',
                city: 'pucon',
                name: 'Rafting en Río Trancura',
                address: 'Río Trancura, Pucón',
                phone: '+56 45 244 4066',
                email: 'info@raftingpucon.cl',
                website: 'https://www.raftingpucon.cl',
                rating: 5,
                price: '$$$',
                description: 'Rafting de clase III y IV en el río Trancura. Incluye equipo, transporte y guía.',
                tags: ['rafting', 'aventura', 'río', 'adrenalina', 'grupo'],
                createdAt: new Date().toISOString()
            },

            // ========== EVENTOS (6 eventos) ==========
            {
                id: this.generateId(),
                category: 'eventos',
                city: 'villarrica',
                name: 'Muestra Cultural Mapuche',
                address: 'Centro Cultural de Villarrica',
                phone: '+56 45 2411800',
                email: 'cultura@villarrica.cl',
                website: 'https://www.villarrica.cl/eventos',
                rating: 5,
                price: '$',
                description: 'Evento anual que celebra la cultura mapuche con música, danza, artesanía y gastronomía tradicional.',
                tags: ['mapuche', 'cultura', 'música', 'danza', 'gratuito'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'eventos',
                city: 'villarrica',
                name: 'Feria Costumbrista de Villarrica',
                address: 'Plaza de Armas de Villarrica',
                phone: '+56 45 241 1800',
                email: 'turismo@villarrica.cl',
                website: 'https://www.villarrica.cl',
                rating: 5,
                price: '$',
                description: 'Feria tradicional con comida típica chilena, música folclórica y artesanía local. Enero y febrero.',
                tags: ['feria', 'comida típica', 'folclor', 'verano', 'familiar'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'eventos',
                city: 'santiago',
                name: 'Lollapalooza Chile',
                address: 'Parque Bicentenario de Cerrillos, Santiago',
                phone: '+56 2 3333 7000',
                email: 'info@lollapaloozacl.com',
                website: 'https://www.lollapalooza.cl',
                rating: 5,
                price: '$$$$',
                description: 'Festival de música internacional con artistas de rock, pop, electrónica y más. Marzo de cada año.',
                tags: ['festival', 'música', 'internacional', 'concierto', 'artistas'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'eventos',
                city: 'santiago',
                name: 'Fiestas Patrias - Fondas',
                address: 'Parque O\'Higgins, Santiago',
                phone: '+56 2 2544 5000',
                email: 'fondas@parqueohiggins.cl',
                website: 'https://www.parqueohiggins.cl',
                rating: 5,
                price: '$$',
                description: 'Celebración nacional del 18 de septiembre con ramadas, comida típica, música y bailes tradicionales.',
                tags: ['fiestas patrias', 'fondas', 'tradicional', 'cueca', 'empanadas'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'eventos',
                city: 'valparaiso',
                name: 'Año Nuevo en Valparaíso',
                address: 'Bahía de Valparaíso - Vista desde Cerros',
                phone: '+56 32 293 9262',
                email: 'turismo@valparaiso.cl',
                website: 'https://www.ciudaddevalparaiso.cl',
                rating: 5,
                price: '$',
                description: 'Espectacular show pirotécnico de año nuevo en la bahía de Valparaíso, el más grande de Sudamérica.',
                tags: ['año nuevo', 'fuegos artificiales', 'celebración', 'nocturno', 'multitudinario'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'eventos',
                city: 'vina-del-mar',
                name: 'Festival de Viña del Mar',
                address: 'Quinta Vergara, Viña del Mar',
                phone: '+56 32 218 5889',
                email: 'festival@festivaldelvina.cl',
                website: 'https://www.festivaldevina.cl',
                rating: 5,
                price: '$$$$',
                description: 'El festival de música más importante de Latinoamérica. Febrero de cada año.',
                tags: ['festival', 'música', 'internacional', 'competencia', 'televisado'],
                createdAt: new Date().toISOString()
            },

            // ========== TRANSPORTE (6 servicios de transporte) ==========
            {
                id: this.generateId(),
                category: 'transporte',
                city: 'santiago',
                name: 'Metro de Santiago',
                address: 'Red de Metro, Santiago',
                phone: '+56 2 2937 2000',
                email: 'info@metro.cl',
                website: 'https://www.metro.cl',
                rating: 5,
                price: '$',
                description: 'Sistema de transporte masivo más moderno de Latinoamérica. 7 líneas que cubren toda la ciudad.',
                tags: ['transporte público', 'metro', 'rápido', 'tarjeta bip', 'wifi'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'transporte',
                city: 'santiago',
                name: 'Uber Santiago',
                address: 'Servicio en toda la ciudad de Santiago',
                phone: 'App móvil',
                email: 'support@uber.com',
                website: 'https://www.uber.com',
                rating: 4,
                price: '$$',
                description: 'Servicio de transporte privado disponible 24/7 en toda la Región Metropolitana.',
                tags: ['taxi', 'app', '24 horas', 'tarjeta de crédito', 'seguro'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'transporte',
                city: 'valparaiso',
                name: 'Ascensores de Valparaíso',
                address: 'Diversos cerros, Valparaíso',
                phone: '+56 32 293 9262',
                email: 'turismo@valparaiso.cl',
                website: 'https://www.valparaisoturismo.cl',
                rating: 5,
                price: '$',
                description: 'Históricos ascensores funiculares que conectan el plan con los cerros. Patrimonio de la Humanidad.',
                tags: ['histórico', 'patrimonio', 'turístico', 'cerros', 'económico'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'transporte',
                city: 'villarrica',
                name: 'Transfer Villarrica-Pucón',
                address: 'Terminal de Buses Villarrica',
                phone: '+56 45 241 1890',
                email: 'info@transfervillarrica.cl',
                website: 'https://www.transfervillarrica.cl',
                rating: 4,
                price: '$$',
                description: 'Servicio de transfer privado y compartido entre Villarrica, Pucón y aeropuerto de Temuco.',
                tags: ['transfer', 'aeropuerto', 'puerta a puerta', 'equipaje', 'reserva online'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'transporte',
                city: 'santiago',
                name: 'Bike Santiago',
                address: 'Estaciones en toda la ciudad',
                phone: '+56 2 2820 5000',
                email: 'contacto@bikesantiago.cl',
                website: 'https://www.bikesantiago.cl',
                rating: 4,
                price: '$',
                description: 'Sistema de bicicletas públicas compartidas con más de 200 estaciones en Santiago.',
                tags: ['bicicleta', 'ecológico', 'saludable', 'ciclovías', 'app móvil'],
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                category: 'transporte',
                city: 'santiago',
                name: 'Turbus',
                address: 'Terminal Alameda, Av. Libertador Bernardo O\'Higgins 3850',
                phone: '+56 600 660 6600',
                email: 'contacto@turbus.cl',
                website: 'https://www.turbus.cl',
                rating: 4,
                price: '$$',
                description: 'Principal empresa de buses interurbanos de Chile. Servicios a todas las regiones del país.',
                tags: ['buses', 'interurbano', 'wifi', 'cómodo', 'nacional'],
                createdAt: new Date().toISOString()
            }
        ];
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // CRUD Operations
    addService(serviceData) {
        const newService = {
            id: this.generateId(),
            ...serviceData,
            createdAt: new Date().toISOString()
        };
        this.services.push(newService);
        this.saveToStorage();
        this.renderServices();
        this.updateCounts();
        this.showNotification('Servicio agregado exitosamente', 'success');
    }

    updateService(id, serviceData) {
        const index = this.services.findIndex(s => s.id === id);
        if (index !== -1) {
            this.services[index] = {
                ...this.services[index],
                ...serviceData,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage();
            this.renderServices();
            this.updateCounts();
            this.showNotification('Servicio actualizado exitosamente', 'success');
        }
    }

    deleteService(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
            this.services = this.services.filter(s => s.id !== id);
            this.saveToStorage();
            this.renderServices();
            this.updateCounts();
            this.showNotification('Servicio eliminado', 'info');
        }
    }

    getService(id) {
        return this.services.find(s => s.id === id);
    }

    // Filtering & Search
    getFilteredServices() {
        let filtered = this.services.filter(s => s.category === this.currentCategory);

        // Filter by city if not "all"
        if (this.currentCity && this.currentCity !== 'all') {
            filtered = filtered.filter(s => s.city === this.currentCity);
        }

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(s =>
                s.name.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query) ||
                s.address.toLowerCase().includes(query) ||
                s.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return filtered;
    }

    // UI Updates
    updateCounts() {
        const categories = ['hoteles', 'restaurantes', 'supermercados', 'tiendas', 'actividades', 'eventos', 'transporte', 'servicios', 'atractivos', 'agencias'];
        categories.forEach(category => {
            const count = this.services.filter(s => s.category === category).length;
            const countElement = document.getElementById(`count-${category}`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }

    renderServices() {
        const grid = document.getElementById('services-grid');
        const emptyState = document.getElementById('empty-state');
        const services = this.getFilteredServices();

        if (services.length === 0) {
            grid.innerHTML = '';
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
            grid.innerHTML = services.map((service, index) => this.createServiceCard(service, index)).join('');
        }
    }

    createServiceCard(service, index) {
        const icon = this.getCategoryIcon(service.category);
        const stars = '⭐'.repeat(service.rating);
        const tags = service.tags.slice(0, 4).map(tag =>
            `<span class="tag">${tag}</span>`
        ).join('');

        return `
            <div class="service-card collapsed" style="animation-delay: ${index * 0.1}s;" data-service-id="${service.id}" onclick="serviceManager.toggleServiceCard(this, '${service.id}')">
                <!-- Contenido siempre visible (Vista compacta) -->
                <div class="service-card-header">
                    <div class="service-icon">${icon}</div>
                    <div class="service-header-info">
                        <h3 class="service-name">${this.escapeHtml(service.name)}</h3>
                        <span class="service-category-badge">${this.getCategoryName(service.category)}</span>
                    </div>
                </div>
                
                <div class="service-rating">
                    <span class="stars">${stars}</span>
                    <span class="price-range">${service.price}</span>
                </div>

                <!-- Contenido que se expande (Vista detallada) -->
                <div class="service-details-expandable">
                    <div class="service-info">
                        ${service.address ? `
                            <div class="service-info-item">
                                📍 ${this.escapeHtml(service.address)}
                            </div>
                        ` : ''}
                        ${service.phone ? `
                            <div class="service-info-item">
                                📞 ${this.escapeHtml(service.phone)}
                            </div>
                        ` : ''}
                        ${service.email ? `
                            <div class="service-info-item">
                                ✉️ ${this.escapeHtml(service.email)}
                            </div>
                        ` : ''}
                    </div>
                    
                    ${service.description ? `
                        <p class="service-description">${this.escapeHtml(service.description)}</p>
                    ` : ''}
                    
                    ${service.tags.length > 0 ? `
                        <div class="service-tags">
                            ${tags}
                        </div>
                    ` : ''}
                    
                    <div class="service-actions" onclick="event.stopPropagation()">
                        <button class="btn-icon-only" onclick="serviceManager.viewServiceDetails('${service.id}')" title="Ver detalles completos">
                            👁️
                        </button>
                        <button class="btn-icon-only" onclick="serviceManager.editService('${service.id}')" title="Editar">
                            ✏️
                        </button>
                        <button class="btn-icon-only delete" onclick="serviceManager.deleteService('${service.id}')" title="Eliminar">
                            🗑️
                        </button>
                    </div>
                </div>

                <!-- Indicador de expansión -->
                <div class="expand-indicator">
                    <span class="expand-icon">▼</span>
                    <span class="expand-text">Click para ver más</span>
                </div>
            </div>
        `;
    }

    toggleServiceCard(cardElement, serviceId) {
        const isCollapsed = cardElement.classList.contains('collapsed');

        if (isCollapsed) {
            // Primer clic: Expandir la tarjeta
            cardElement.classList.remove('collapsed');
            cardElement.classList.add('expanded');
        } else {
            // Segundo clic: Abrir modal
            this.viewServiceDetails(serviceId);
        }
    }

    getCategoryIcon(category) {
        const icons = {
            'hoteles': '🏨',
            'restaurantes': '🍽️',
            'supermercados': '🛒',
            'tiendas': '🛍️',
            'actividades': '🎯',
            'eventos': '🎉',
            'transporte': '🚌',
            'servicios': '🛠️',
            'atractivos': '🎭',
            'agencias': '✈️'
        };
        return icons[category] || '📌';
    }

    getCategoryName(category) {
        const names = {
            'hoteles': 'Hoteles',
            'restaurantes': 'Restaurantes',
            'supermercados': 'Supermercados',
            'tiendas': 'Tiendas',
            'actividades': 'Actividades',
            'eventos': 'Eventos',
            'transporte': 'Transporte',
            'servicios': 'Servicios',
            'atractivos': 'Atractivos',
            'agencias': 'Agencias de Viaje'
        };
        return names[category] || category;
    }

    getCityName(cityCode) {
        const names = {
            'all': 'Chile',
            'villarrica': 'Villarrica',
            'santiago': 'Santiago',
            'valparaiso': 'Valparaíso',
            'vina-del-mar': 'Viña del Mar',
            'concepcion': 'Concepción',
            'pucon': 'Pucón',
            'puerto-varas': 'Puerto Varas',
            'la-serena': 'La Serena'
        };
        return names[cityCode] || 'Chile';
    }

    getCityIcon(cityCode) {
        const icons = {
            'all': '🗺️',
            'villarrica': '🌋',
            'santiago': '🏙️',
            'valparaiso': '🎨',
            'vina-del-mar': '🌊',
            'concepcion': '🏛️',
            'pucon': '⛰️',
            'puerto-varas': '🏔️',
            'la-serena': '🏖️'
        };
        return icons[cityCode] || '🗺️';
    }

    getCityColors(city) {
        const colors = {
            'villarrica': { start: 'hsl(145, 65%, 35%)', end: 'hsl(200, 85%, 45%)', bg: 'hsl(145, 25%, 15%)' }, // Verde bosque a Azul lago
            'pucon': { start: 'hsl(200, 85%, 45%)', end: 'hsl(280, 65%, 40%)', bg: 'hsl(260, 25%, 15%)' }, // Azul lago a Púrpura volcán
            'santiago': { start: 'hsl(220, 40%, 40%)', end: 'hsl(25, 85%, 55%)', bg: 'hsl(220, 20%, 12%)' }, // Gris urbano a Naranja atardecer
            'valparaiso': { start: 'hsl(200, 90%, 40%)', end: 'hsl(340, 85%, 55%)', bg: 'hsl(200, 25%, 12%)' }, // Azul puerto a Rosa vibrante
            'vina-del-mar': { start: 'hsl(190, 90%, 45%)', end: 'hsl(260, 85%, 60%)', bg: 'hsl(190, 25%, 12%)' }, // Turquesa a Púrpura
            'concepcion': { start: 'hsl(210, 80%, 30%)', end: 'hsl(150, 70%, 35%)', bg: 'hsl(210, 25%, 12%)' }, // Azul río a Verde
            'puerto-varas': { start: 'hsl(210, 60%, 40%)', end: 'hsl(350, 60%, 50%)', bg: 'hsl(210, 25%, 13%)' }, // Azul lluvia a Rojo teja
            'la-serena': { start: 'hsl(40, 80%, 50%)', end: 'hsl(190, 70%, 45%)', bg: 'hsl(40, 20%, 13%)' }, // Ocre desierto a Azul mar
            'all': { start: 'hsl(260, 85%, 60%)', end: 'hsl(320, 85%, 60%)', bg: 'hsl(240, 15%, 8%)' } // Default
        };
        return colors[city] || colors['all'];
    }

    applyCityBackground(city) {
        const colors = this.getCityColors(city);
        const header = document.querySelector('.hero-header');
        const body = document.body;
        const root = document.documentElement;

        if (header) {
            header.style.background = `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`;
        }

        if (body) {
            body.style.backgroundColor = colors.bg;
        }

        // Set CSS custom properties for dynamic tab colors
        if (root) {
            root.style.setProperty('--city-color-start', colors.start);
            root.style.setProperty('--city-color-end', colors.end);
        }
    }

    updateCityHeader() {
        const titleElement = document.querySelector('.main-title');
        const subtitleElement = document.querySelector('.subtitle');

        if (titleElement && subtitleElement) {
            const cityName = this.getCityName(this.currentCity);
            const cityIcon = this.getCityIcon(this.currentCity);

            titleElement.innerHTML = `
                <span class="title-icon">${cityIcon}</span>
                ${cityName}
            `;

            if (this.currentCity === 'all') {
                subtitleElement.textContent = 'Descubre los mejores servicios turísticos de Chile';
            } else {
                subtitleElement.textContent = `Guía completa de servicios turísticos en ${cityName}`;
            }

            // Update colors
            const colors = this.getCityColors(this.currentCity);
            document.documentElement.style.setProperty('--header-gradient-start', colors.start);
            document.documentElement.style.setProperty('--header-gradient-end', colors.end);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Modal Management
    openModal(serviceId = null) {
        const overlay = document.getElementById('modal-overlay');
        const form = document.getElementById('service-form');
        const title = document.getElementById('modal-title');
        const submitText = document.getElementById('btn-submit-text');

        this.editingServiceId = serviceId;

        if (serviceId) {
            const service = this.getService(serviceId);
            if (service) {
                title.textContent = 'Editar Servicio';
                submitText.textContent = 'Actualizar Servicio';
                this.populateForm(service);
            }
        } else {
            title.textContent = 'Agregar Nuevo Servicio';
            submitText.textContent = 'Guardar Servicio';
            form.reset();
            document.getElementById('service-category').value = this.currentCategory;

            if (this.currentCity && this.currentCity !== 'all') {
                const citySelect = document.getElementById('service-city');
                if (citySelect) {
                    citySelect.value = this.currentCity;
                }
            }
        }

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.editingServiceId = null;
        document.getElementById('service-form').reset();
    }

    populateForm(service) {
        document.getElementById('service-category').value = service.category;
        const citySelect = document.getElementById('service-city');
        if (citySelect) {
            citySelect.value = service.city || '';
        }
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-address').value = service.address || '';
        document.getElementById('service-phone').value = service.phone || '';
        document.getElementById('service-email').value = service.email || '';
        document.getElementById('service-website').value = service.website || '';
        document.getElementById('service-rating').value = service.rating;
        document.getElementById('service-price').value = service.price;
        document.getElementById('service-description').value = service.description || '';
        document.getElementById('service-tags').value = service.tags.join(', ');
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const formData = {
            category: document.getElementById('service-category').value,
            city: document.getElementById('service-city').value,
            name: document.getElementById('service-name').value.trim(),
            address: document.getElementById('service-address').value.trim(),
            phone: document.getElementById('service-phone').value.trim(),
            email: document.getElementById('service-email').value.trim(),
            website: document.getElementById('service-website').value.trim(),
            rating: parseInt(document.getElementById('service-rating').value),
            price: document.getElementById('service-price').value,
            description: document.getElementById('service-description').value.trim(),
            tags: document.getElementById('service-tags').value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0)
        };

        if (this.editingServiceId) {
            this.updateService(this.editingServiceId, formData);
        } else {
            this.addService(formData);
        }

        this.closeModal();
    }

    editService(id) {
        this.openModal(id);
    }

    viewServiceDetails(id) {
        const service = this.getService(id);
        if (!service) return;

        const overlay = document.getElementById('detail-modal-overlay');
        const title = document.getElementById('detail-title');
        const content = document.getElementById('detail-content');

        title.textContent = service.name;

        const stars = '⭐'.repeat(service.rating);
        const tags = service.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        content.innerHTML = `
            <div class="detail-section">
                <div class="service-rating">
                    <span class="stars">${stars}</span>
                    <span class="price-range">${service.price}</span>
                </div>
                <span class="service-category-badge">${this.getCategoryName(service.category)}</span>
            </div>

            ${service.description ? `
                <div class="detail-section">
                    <h3>Descripción</h3>
                    <p style="color: var(--color-text-secondary); line-height: 1.8;">
                        ${this.escapeHtml(service.description)}
                    </p>
                </div>
            ` : ''}

            <div class="detail-section">
                <h3>Información de Contacto</h3>
                <div class="detail-grid">
                    ${service.address ? `
                        <div class="detail-item">
                            <div class="detail-item-label">📍 Dirección</div>
                            <div class="detail-item-value">
                                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}" 
                                   target="_blank" 
                                   style="color: var(--color-primary-light); text-decoration: none; transition: color 0.2s;"
                                   onmouseover="this.style.color='var(--color-primary)'"
                                   onmouseout="this.style.color='var(--color-primary-light)'">
                                    ${this.escapeHtml(service.address)} 🗺️
                                </a>
                            </div>
                        </div>
                    ` : ''}
                    ${service.phone ? `
                        <div class="detail-item">
                            <div class="detail-item-label">📞 Teléfono</div>
                            <div class="detail-item-value">
                                <a href="tel:${service.phone.replace(/\s/g, '')}" 
                                   style="color: var(--color-primary-light); text-decoration: none; transition: color 0.2s;"
                                   onmouseover="this.style.color='var(--color-primary)'"
                                   onmouseout="this.style.color='var(--color-primary-light)'">
                                    ${this.escapeHtml(service.phone)}
                                </a>
                            </div>
                        </div>
                    ` : ''}
                    ${service.email ? `
                        <div class="detail-item">
                            <div class="detail-item-label">✉️ Email</div>
                            <div class="detail-item-value">
                                <a href="mailto:${this.escapeHtml(service.email)}" 
                                   style="color: var(--color-primary-light); text-decoration: none; transition: color 0.2s;"
                                   onmouseover="this.style.color='var(--color-primary)'"
                                   onmouseout="this.style.color='var(--color-primary-light)'">
                                    ${this.escapeHtml(service.email)}
                                </a>
                            </div>
                        </div>
                    ` : ''}
                    ${service.website ? `
                        <div class="detail-item">
                            <div class="detail-item-label">🌐 Sitio Web</div>
                            <div class="detail-item-value">
                                <a href="${this.escapeHtml(service.website)}" 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   style="color: var(--color-primary-light); text-decoration: none; transition: color 0.2s;"
                                   onmouseover="this.style.color='var(--color-primary)'"
                                   onmouseout="this.style.color='var(--color-primary-light)'">
                                    Visitar sitio web 🔗
                                </a>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>

            ${service.tags.length > 0 ? `
                <div class="detail-section">
                    <h3>Características</h3>
                    <div class="service-tags">
                        ${tags}
                    </div>
                </div>
            ` : ''}

            <div class="detail-section">
                <div class="form-actions">
                    <button class="btn-secondary" onclick="serviceManager.closeDetailModal()">Cerrar</button>
                    <button class="btn-primary" onclick="serviceManager.editService('${service.id}'); serviceManager.closeDetailModal();">
                        <span>✏️</span>
                        <span>Editar Servicio</span>
                    </button>
                </div>
            </div>
        `;

        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeDetailModal() {
        const overlay = document.getElementById('detail-modal-overlay');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners
    setupEventListeners() {
        // Category tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = btn.dataset.category;
                this.switchCategory(category);
            });
        });

        // Add service button
        document.getElementById('btn-add-service').addEventListener('click', () => {
            this.openModal();
        });

        // Search input
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.renderServices();
        });

        // Modal close buttons
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('btn-cancel').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('detail-modal-close').addEventListener('click', () => {
            this.closeDetailModal();
        });

        // Close modal on overlay click
        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });

        document.getElementById('detail-modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'detail-modal-overlay') {
                this.closeDetailModal();
            }
        });

        // Form submit
        document.getElementById('service-form').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDetailModal();
            }
        });
    }

    setupCitySelector() {
        const citySelect = document.getElementById('city-select');
        if (citySelect) {
            citySelect.value = this.currentCity;
            // Apply initial city colors
            this.applyCityBackground(this.currentCity);

            citySelect.addEventListener('change', (e) => {
                this.currentCity = e.target.value;
                localStorage.setItem('currentCity', this.currentCity); // Save state
                this.applyCityBackground(this.currentCity);
                this.updateCityHeader();
                this.renderServices();
                this.updateCounts();
            });
        }
    }

    switchCategory(category) {
        this.currentCategory = category;
        localStorage.setItem('currentCategory', category); // Save state

        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Find the button with matching data-category attribute
        const activeBtn = document.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Clear search
        this.searchQuery = '';
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        // Render services
        this.renderServices();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            font-weight: 600;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// ============================================
// ANIMATIONS
// ============================================

// Add notification animations to the page
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// INITIALIZE APP
// ============================================

let serviceManager;

document.addEventListener('DOMContentLoaded', () => {
    serviceManager = new ServiceManager();
    console.log('🏙️ Directorio de Servicios iniciado correctamente');
});
