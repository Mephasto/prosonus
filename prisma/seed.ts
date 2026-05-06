import { PrismaClient, Category } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    // Clean slate - delete in dependency order so re-runs never fail
    await tx.product.deleteMany();
    await tx.categories.deleteMany();

    // Categories
    await tx.categories.createMany({
      data: [
        { name: "Micrófonos", enum: "MICROPHONES" },
        { name: "Mezcladores", enum: "MIXERS" },
        { name: "Sistemas PA", enum: "PAS" },
        { name: "Equipos DJ", enum: "DJ" },
        { name: "Audífonos", enum: "HEADPHONES" },
        { name: "Cables", enum: "CABLES" },
        { name: "Accesorios", enum: "ACCESOSORIES" },
      ],
    });

    // Products
    await tx.product.createMany({
      data: [
        // MICROPHONES
        {
          name: "Shure SM58",
          brand: "Shure",
          price: 15,
          weight: 298,
          stock: 8,
          specs: "Cardioide dinámico, 50-15,000 Hz, XLR",
          description:
            "Micrófono vocal dinámico de referencia en la industria, ideal para presentaciones en vivo.",
          category: Category.MICROPHONES,
        },
        {
          name: "Sennheiser e835",
          brand: "Sennheiser",
          price: 12,
          weight: 330,
          stock: 6,
          specs: "Cardioide dinámico, 40-16,000 Hz, XLR",
          description:
            "Micrófono vocal dinámico con respuesta de frecuencia clara y rechazo superior de retroalimentación.",
          category: Category.MICROPHONES,
        },
        {
          name: "AKG C214",
          brand: "AKG",
          price: 25,
          weight: 900,
          stock: 4,
          specs:
            "Condensador de diafragma grande, 20-20,000 Hz, pad -20 dB, filtro HPF",
          description:
            "Micrófono de condensador profesional para grabación de voces, instrumentos acústicos y cuerdas.",
          category: Category.MICROPHONES,
        },
        {
          name: "Shure Beta 91A",
          brand: "Shure",
          price: 20,
          weight: 340,
          stock: 3,
          specs:
            "Semicardioide condensador, 20-20,000 Hz, pad -15 dB, montaje de superficie",
          description:
            "Micrófono de superficie para bombo y piano de cola, con rechazo excepcional de retroalimentación.",
          category: Category.MICROPHONES,
        },

        // MIXERS
        {
          name: "Yamaha MG16XU",
          brand: "Yamaha",
          price: 45,
          weight: 7400,
          stock: 3,
          specs:
            "16 canales, 10 preamplificadores XLR, efectos SPX, interfaz USB",
          description:
            "Consola analógica compacta con ecualizadores de alta calidad y efectos digitales integrados.",
          category: Category.MIXERS,
        },
        {
          name: "Allen & Heath ZEDi-10FX",
          brand: "Allen & Heath",
          price: 30,
          weight: 2100,
          stock: 4,
          specs:
            "10 canales, 4 preamplificadores AnalogiQ, efectos digitales, interfaz USB 2.0",
          description:
            "Mezcladora híbrida analógica-USB ligera para producción en vivo y grabación en estudio.",
          category: Category.MIXERS,
        },
        {
          name: "Behringer X32",
          brand: "Behringer",
          price: 80,
          weight: 15000,
          stock: 2,
          specs:
            "40 canales, 32 preamplificadores MIDAS, procesamiento de 24 bits/96 kHz, Ethernet AES50",
          description:
            "Consola digital de 40 canales con procesamiento de señal completo y opciones de expansión MIDAS.",
          category: Category.MIXERS,
        },

        // PAS
        {
          name: "QSC K12.2",
          brand: "QSC",
          price: 50,
          weight: 16300,
          stock: 6,
          specs: "12in 2 vías, 2000 W clase D, 131 dB SPL max, DSP integrado",
          description:
            "Altavoz activo de alto rendimiento con amplificación clase D y procesamiento DMT para eventos exigentes.",
          category: Category.PAS,
        },
        {
          name: "JBL PRX815W",
          brand: "JBL",
          price: 55,
          weight: 20000,
          stock: 4,
          specs:
            "15in 2 vías, 1500 W, 136 dB SPL max, Wi-Fi DSP, app de control",
          description:
            "Altavoz autoamplificado con conectividad Wi-Fi para control remoto desde dispositivos móviles.",
          category: Category.PAS,
        },
        {
          name: "RCF ART 715-A",
          brand: "RCF",
          price: 45,
          weight: 16500,
          stock: 5,
          specs: "15in 2 vías, 1400 W clase D, 132 dB SPL max, DSP FIR",
          description:
            "Monitor activo de alta potencia con filtros FIR de fase lineal para sonido preciso en directo.",
          category: Category.PAS,
        },

        // DJ
        {
          name: "Pioneer CDJ-2000NXS2",
          brand: "Pioneer DJ",
          price: 70,
          weight: 4500,
          stock: 4,
          specs:
            "Reproductor DJ Pro, pantalla táctil 9in, USB/SD, Pro DJ Link, rekordbox",
          description:
            "El reproductor DJ más utilizado en clubes y festivales de todo el mundo, estándar de la industria.",
          category: Category.DJ,
        },
        {
          name: "Pioneer DJM-900NXS2",
          brand: "Pioneer DJ",
          price: 75,
          weight: 5400,
          stock: 2,
          specs:
            "Mezcladora 4 canales, 96 kHz/24 bits, efectos Beat FX y Sound Color FX, interfaz USB",
          description:
            "Mezcladora DJ profesional de referencia con efectos integrados y calidad de audio excepcional.",
          category: Category.DJ,
        },
        {
          name: "Denon SC6000",
          brand: "Denon DJ",
          price: 60,
          weight: 4200,
          stock: 3,
          specs:
            "Reproductor DJ, pantalla táctil 10.1in, USB/SD, streaming Wi-Fi, 8 hot cues",
          description:
            "Reproductor DJ de alto rendimiento con pantalla táctil de gran tamaño y streaming de música en línea.",
          category: Category.DJ,
        },

        // HEADPHONES
        {
          name: "Sony MDR-7506",
          brand: "Sony",
          price: 8,
          weight: 230,
          stock: 10,
          specs:
            "Circumaural cerrado, 10-20,000 Hz, 106 dB/mW, impedancia 63 Ohm",
          description:
            "Auricular de monitorización profesional, referencia en estudios de grabación durante décadas.",
          category: Category.HEADPHONES,
        },
        {
          name: "Audio-Technica ATH-M50x",
          brand: "Audio-Technica",
          price: 10,
          weight: 285,
          stock: 8,
          specs:
            "Circumaural cerrado, 15-28,000 Hz, 99 dB/mW, impedancia 38 Ohm",
          description:
            "Auricular de estudio con graves potentes, sonido neutro y cómodo diseño plegable.",
          category: Category.HEADPHONES,
        },
        {
          name: "Sennheiser HD 280 Pro",
          brand: "Sennheiser",
          price: 9,
          weight: 285,
          stock: 7,
          specs:
            "Circumaural cerrado, 8-25,000 Hz, 113 dB/mW, impedancia 64 Ohm",
          description:
            "Auricular de monitorización con 32 dB de atenuación pasiva del ruido para entornos ruidosos.",
          category: Category.HEADPHONES,
        },

        // CABLES
        {
          name: "Cable XLR 3m",
          brand: "Generico Pro",
          price: 3,
          weight: 150,
          stock: 20,
          specs: "XLR macho a hembra, 3 conductores balanceados, longitud 3 m",
          description:
            "Cable de micrófono balanceado de 3 metros para conexiones profesionales de bajo ruido.",
          category: Category.CABLES,
        },
        {
          name: "Cable XLR 10m",
          brand: "Generico Pro",
          price: 5,
          weight: 400,
          stock: 15,
          specs: "XLR macho a hembra, 3 conductores balanceados, longitud 10 m",
          description:
            "Cable de micrófono balanceado de 10 metros, ideal para escenarios e instalaciones largas.",
          category: Category.CABLES,
        },
        {
          name: "Cable TRS 6.3mm 6m",
          brand: "Generico Pro",
          price: 4,
          weight: 250,
          stock: 12,
          specs: "TRS 6.3 mm macho a macho, balanceado, longitud 6 m",
          description:
            "Cable de instrumento balanceado de 6 metros para conexiones de linea y envios/retornos.",
          category: Category.CABLES,
        },

        // ACCESOSORIES
        {
          name: "Atril K&M 21090",
          brand: "Konig & Meyer",
          price: 5,
          weight: 2300,
          stock: 10,
          specs:
            "Altura 92-170 cm, boom 47-82 cm, carga max 6 kg, base de tripode",
          description:
            "Atril de micrófono profesional con brazo boom, regulable en altura y ángulo para cualquier posición.",
          category: Category.ACCESOSORIES,
        },
        {
          name: "Acondicionador Furman M-8x2",
          brand: "Furman",
          price: 15,
          weight: 2300,
          stock: 3,
          specs:
            "8 tomas AC, 15 A, filtrado de ruido AC, protección contra sobretensiones, 1U rack",
          description:
            "Acondicionador de energia en rack que filtra ruido AC y protege el equipo de sobretensiones.",
          category: Category.ACCESOSORIES,
        },
        {
          name: "DI Box Radial J48",
          brand: "Radial Engineering",
          price: 10,
          weight: 450,
          stock: 5,
          specs:
            "DI activa, alimentacion phantom 48 V, 20 Hz-40 kHz +/-0.5 dB, pad -15 dB",
          description:
            "Caja DI activa de referencia para convertir señales de instrumento desbalanceadas a XLR balanceada.",
          category: Category.ACCESOSORIES,
        },
      ],
    });
  });

  console.log("✅ Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
