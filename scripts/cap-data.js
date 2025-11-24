/**
 * CAP Schadentool - Gebührendaten
 * Modulare Struktur für einfache Erweiterung um zusätzliche Kantone
 *
 * Datenquelle: Kantonale Gebührenverordnungen, PKV-Tarife
 * Stand: 2016/2024
 */

const CAP_DATA = {
    meta: {
        version: '1.0.0',
        mwst: 0.077,           // 7.7% MwSt
        spesen_prozent: 0.03,  // 3% Spesen auf Honorar
        stundensatz_intern: 230,
        stundensatz_anwalt_default: 250
    },

    // Bemessungskriterien für Honorarausschöpfung
    bemessungskriterien: {
        zeitaufwand: [
            { wert: 0, label: { de: 'minimal', fr: 'minimal' } },
            { wert: 2, label: { de: 'unterdurchschnittlich', fr: 'inférieur à la moyenne' } },
            { wert: 4, label: { de: 'durchschnittlich', fr: 'moyen' } },
            { wert: 6, label: { de: 'überdurchschnittlich', fr: 'supérieur à la moyenne' } },
            { wert: 8, label: { de: 'sehr hoch', fr: 'très élevé' } }
        ],
        bedeutung: [
            { wert: 0, label: { de: 'gering', fr: 'faible' } },
            { wert: 2, label: { de: 'unterdurchschnittlich', fr: 'inférieur à la moyenne' } },
            { wert: 4, label: { de: 'durchschnittlich', fr: 'moyen' } },
            { wert: 6, label: { de: 'überdurchschnittlich', fr: 'supérieur à la moyenne' } },
            { wert: 8, label: { de: 'sehr hoch', fr: 'très élevé' } }
        ],
        schwierigkeit: [
            { wert: 0, label: { de: 'einfach', fr: 'simple' } },
            { wert: 2, label: { de: 'unterdurchschnittlich', fr: 'inférieur à la moyenne' } },
            { wert: 4, label: { de: 'durchschnittlich', fr: 'moyen' } },
            { wert: 6, label: { de: 'überdurchschnittlich', fr: 'supérieur à la moyenne' } },
            { wert: 8, label: { de: 'komplex', fr: 'complexe' } }
        ]
    },

    erfolgsaussichten: [
        { wert: 'optimistisch', faktor: 0.5, label: { de: 'Optimistisch (Vergleich)', fr: 'Optimiste (transaction)' } },
        { wert: 'neutral', faktor: 0.75, label: { de: 'Neutral', fr: 'Neutre' } },
        { wert: 'pessimistisch', faktor: 1.0, label: { de: 'Pessimistisch (Totalverlust)', fr: 'Pessimiste (perte totale)' } }
    ],

    verfahrensarten: [
        { id: 'ordentlich', label: { de: 'Ordentliches/Vereinfachtes Verfahren', fr: 'Procédure ordinaire/simplifiée' } },
        { id: 'summarisch', label: { de: 'Summarisches Verfahren', fr: 'Procédure sommaire' } }
    ],

    // Kantone mit Gebührentabellen (aus CAP Excel extrahiert)
    kantone: {
        BE: {
            name: { de: 'Bern', fr: 'Berne' },
            rechtsgrundlage: 'Dekret über die Kosten in Zivil-, Straf- und Verwaltungsverfahren (VBR)',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 300, mittel: 300, max: 2500 },
                    { streitwert: 5000, min: 600, mittel: 1200, max: 2500 },
                    { streitwert: 10000, min: 900, mittel: 1700, max: 7500 },
                    { streitwert: 20000, min: 1000, mittel: 3000, max: 7500 },
                    { streitwert: 30000, min: 1000, mittel: 4100, max: 7500 },
                    { streitwert: 50000, min: 1000, mittel: 5700, max: 12500 },
                    { streitwert: 100000, min: 2000, mittel: 8000, max: 20000 },
                    { streitwert: 200000, min: 3000, mittel: 12500, max: 30000 },
                    { streitwert: 500000, min: 5000, mittel: 22000, max: 50000 },
                    { streitwert: 1000000, min: 8000, mittel: 35000, max: 80000 },
                    { streitwert: 2000000, min: 12000, mittel: 50000, max: 100000 },
                    { streitwert: 5000000, min: 20000, mittel: 80000, max: 150000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 300, mittel: 300, max: 7500 },
                    { streitwert: 10000, min: 1350, mittel: 2175, max: 7500 },
                    { streitwert: 20000, min: 1500, mittel: 3000, max: 7500 },
                    { streitwert: 50000, min: 2000, mittel: 5250, max: 12500 },
                    { streitwert: 100000, min: 3000, mittel: 8250, max: 20000 },
                    { streitwert: 200000, min: 4500, mittel: 13500, max: 30000 },
                    { streitwert: 500000, min: 7500, mittel: 26250, max: 60000 },
                    { streitwert: 1000000, min: 12000, mittel: 42000, max: 100000 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 10000, min: 500, mittel: 590, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1056, max: 5000 },
                    { streitwert: 50000, min: 1500, mittel: 2000, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 },
                    { streitwert: 200000, min: 3000, mittel: 4000, max: 8000 },
                    { streitwert: 500000, min: 4000, mittel: 6000, max: 10000 },
                    { streitwert: 1000000, min: 5000, mittel: 8000, max: 15000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 600, mittel: 600, max: 1200 },
                    { streitwert: 5000, min: 1600, mittel: 2700, max: 3800 },
                    { streitwert: 10000, min: 2700, mittel: 4600, max: 6500 },
                    { streitwert: 20000, min: 3200, mittel: 5550, max: 7900 },
                    { streitwert: 30000, min: 3800, mittel: 7050, max: 10300 },
                    { streitwert: 50000, min: 4700, mittel: 9350, max: 14000 },
                    { streitwert: 100000, min: 6500, mittel: 14250, max: 22000 },
                    { streitwert: 200000, min: 9000, mittel: 22000, max: 35000 },
                    { streitwert: 500000, min: 14000, mittel: 39500, max: 65000 },
                    { streitwert: 1000000, min: 21000, mittel: 60500, max: 100000 }
                ],
                summarisch: [
                    { streitwert: 0, min: 180, mittel: 270, max: 360 },
                    { streitwert: 5000, min: 480, mittel: 1215, max: 1710 },
                    { streitwert: 10000, min: 810, mittel: 2070, max: 2925 },
                    { streitwert: 20000, min: 960, mittel: 2498, max: 4740 },
                    { streitwert: 50000, min: 1410, mittel: 4208, max: 6300 },
                    { streitwert: 100000, min: 1950, mittel: 6413, max: 9900 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 180, mittel: 270, max: 720 },
                    { streitwert: 10000, min: 810, mittel: 2070, max: 4388 },
                    { streitwert: 20000, min: 960, mittel: 2498, max: 4740 },
                    { streitwert: 50000, min: 1410, mittel: 4208, max: 8400 },
                    { streitwert: 100000, min: 1950, mittel: 6413, max: 13200 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 500, mittel: 500, max: 2000 },
                    { streitwert: 20000, min: 1500, mittel: 2750, max: 6000 },
                    { streitwert: 50000, min: 2500, mittel: 4500, max: 10000 },
                    { streitwert: 100000, min: 3500, mittel: 7000, max: 15000 },
                    { streitwert: 500000, min: 8000, mittel: 18000, max: 40000 }
                ]
            },
            schlichtung: [
                { bis: 15000, gebuehr: 300 },
                { bis: 30000, gebuehr: 500 },
                { bis: 100000, gebuehr: 800 },
                { bis: null, gebuehr: 1000 }
            ]
        },

        ZH: {
            name: { de: 'Zürich', fr: 'Zurich' },
            rechtsgrundlage: 'Gebührenverordnung des Obergerichts (GebV OG)',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 200, mittel: 300, max: 1500 },
                    { streitwert: 5000, min: 400, mittel: 900, max: 1500 },
                    { streitwert: 10000, min: 750, mittel: 1500, max: 6000 },
                    { streitwert: 20000, min: 750, mittel: 2500, max: 6000 },
                    { streitwert: 30000, min: 750, mittel: 3500, max: 6000 },
                    { streitwert: 50000, min: 1000, mittel: 5000, max: 10000 },
                    { streitwert: 100000, min: 1500, mittel: 8000, max: 18000 },
                    { streitwert: 200000, min: 2500, mittel: 13000, max: 30000 },
                    { streitwert: 500000, min: 4000, mittel: 25000, max: 60000 },
                    { streitwert: 1000000, min: 6000, mittel: 40000, max: 100000 },
                    { streitwert: 2000000, min: 10000, mittel: 60000, max: 150000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 200, mittel: 400, max: 2000 },
                    { streitwert: 10000, min: 1000, mittel: 2000, max: 8000 },
                    { streitwert: 20000, min: 1000, mittel: 3000, max: 8000 },
                    { streitwert: 50000, min: 1500, mittel: 6000, max: 15000 },
                    { streitwert: 100000, min: 2500, mittel: 10000, max: 25000 },
                    { streitwert: 200000, min: 4000, mittel: 17000, max: 40000 },
                    { streitwert: 500000, min: 6000, mittel: 35000, max: 80000 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1056, max: 5000 },
                    { streitwert: 50000, min: 1500, mittel: 2000, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 },
                    { streitwert: 200000, min: 3000, mittel: 4000, max: 8000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 600, mittel: 800, max: 1500 },
                    { streitwert: 5000, min: 1500, mittel: 2500, max: 4000 },
                    { streitwert: 10000, min: 2500, mittel: 4200, max: 6000 },
                    { streitwert: 20000, min: 3000, mittel: 5200, max: 7500 },
                    { streitwert: 30000, min: 3500, mittel: 6500, max: 10000 },
                    { streitwert: 50000, min: 4500, mittel: 9000, max: 14000 },
                    { streitwert: 100000, min: 6000, mittel: 13500, max: 22000 },
                    { streitwert: 200000, min: 8500, mittel: 21000, max: 35000 },
                    { streitwert: 500000, min: 13000, mittel: 38000, max: 65000 },
                    { streitwert: 1000000, min: 20000, mittel: 58000, max: 100000 }
                ],
                summarisch: [
                    { streitwert: 0, min: 200, mittel: 300, max: 500 },
                    { streitwert: 10000, min: 750, mittel: 1900, max: 2700 },
                    { streitwert: 20000, min: 900, mittel: 2340, max: 3400 },
                    { streitwert: 50000, min: 1350, mittel: 4050, max: 6000 },
                    { streitwert: 100000, min: 1800, mittel: 6075, max: 9900 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 200, mittel: 400, max: 1000 },
                    { streitwert: 20000, min: 900, mittel: 2340, max: 4500 },
                    { streitwert: 50000, min: 1350, mittel: 4050, max: 8000 },
                    { streitwert: 100000, min: 1800, mittel: 6075, max: 12000 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 500, mittel: 500, max: 2000 },
                    { streitwert: 20000, min: 1500, mittel: 2750, max: 6000 },
                    { streitwert: 50000, min: 2500, mittel: 4500, max: 10000 },
                    { streitwert: 100000, min: 3500, mittel: 7000, max: 15000 }
                ]
            },
            schlichtung: [
                { bis: 2000, gebuehr: 50 },
                { bis: 10000, gebuehr: 100 },
                { bis: 30000, gebuehr: 200 },
                { bis: 100000, gebuehr: 400 },
                { bis: null, gebuehr: 600 }
            ]
        },

        AG: {
            name: { de: 'Aargau', fr: 'Argovie' },
            rechtsgrundlage: 'Dekret über die Verfahrenskosten (221.150)',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 450, mittel: 900, max: 1350 },
                    { streitwert: 5000, min: 725, mittel: 1450, max: 2175 },
                    { streitwert: 10000, min: 1110, mittel: 2220, max: 3330 },
                    { streitwert: 20000, min: 1610, mittel: 3220, max: 4830 },
                    { streitwert: 30000, min: 1940, mittel: 3880, max: 5820 },
                    { streitwert: 50000, min: 2605, mittel: 5210, max: 7815 },
                    { streitwert: 100000, min: 3885, mittel: 7770, max: 11655 },
                    { streitwert: 200000, min: 5660, mittel: 11320, max: 16980 },
                    { streitwert: 500000, min: 9210, mittel: 18420, max: 27630 },
                    { streitwert: 1000000, min: 13460, mittel: 26920, max: 40380 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 350, mittel: 700, max: 1050 },
                    { streitwert: 20000, min: 1250, mittel: 2500, max: 3750 },
                    { streitwert: 50000, min: 2000, mittel: 4000, max: 6000 },
                    { streitwert: 100000, min: 3000, mittel: 6000, max: 9000 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1500, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 500, mittel: 750, max: 1500 },
                    { streitwert: 10000, min: 2000, mittel: 4000, max: 6000 },
                    { streitwert: 20000, min: 2800, mittel: 5000, max: 7500 },
                    { streitwert: 50000, min: 4000, mittel: 8000, max: 12000 },
                    { streitwert: 100000, min: 5500, mittel: 12000, max: 20000 }
                ]
            },
            schlichtung: [
                { bis: 10000, gebuehr: 150 },
                { bis: 30000, gebuehr: 300 },
                { bis: 100000, gebuehr: 500 },
                { bis: null, gebuehr: 800 }
            ]
        },

        BS: {
            name: { de: 'Basel-Stadt', fr: 'Bâle-Ville' },
            rechtsgrundlage: 'Verordnung über die Gerichtsgebühren',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 75, mittel: 150, max: 360 },
                    { streitwert: 5000, min: 300, mittel: 600, max: 1200 },
                    { streitwert: 10000, min: 600, mittel: 1200, max: 2400 },
                    { streitwert: 20000, min: 900, mittel: 2400, max: 4800 },
                    { streitwert: 30000, min: 1050, mittel: 3150, max: 6300 },
                    { streitwert: 50000, min: 1200, mittel: 4200, max: 8400 },
                    { streitwert: 100000, min: 1500, mittel: 5400, max: 10800 },
                    { streitwert: 200000, min: 2100, mittel: 7500, max: 15000 },
                    { streitwert: 500000, min: 3000, mittel: 12000, max: 24000 },
                    { streitwert: 1000000, min: 4200, mittel: 18000, max: 36000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 100, mittel: 200, max: 500 },
                    { streitwert: 20000, min: 700, mittel: 1800, max: 3600 },
                    { streitwert: 50000, min: 900, mittel: 3150, max: 6300 },
                    { streitwert: 100000, min: 1125, mittel: 4050, max: 8100 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1500, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 500, mittel: 800, max: 1500 },
                    { streitwert: 10000, min: 2200, mittel: 4200, max: 6500 },
                    { streitwert: 20000, min: 3000, mittel: 5500, max: 8000 },
                    { streitwert: 50000, min: 4500, mittel: 9000, max: 14000 },
                    { streitwert: 100000, min: 6000, mittel: 13000, max: 22000 }
                ]
            },
            schlichtung: [
                { bis: 10000, gebuehr: 100 },
                { bis: 30000, gebuehr: 200 },
                { bis: null, gebuehr: 400 }
            ]
        },

        LU: {
            name: { de: 'Luzern', fr: 'Lucerne' },
            rechtsgrundlage: 'Justiz-Kostenverordnung (JusKV)',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 500, mittel: 500, max: 3000 },
                    { streitwert: 5000, min: 583, mittel: 750, max: 3000 },
                    { streitwert: 10000, min: 1000, mittel: 1750, max: 5000 },
                    { streitwert: 20000, min: 1500, mittel: 3000, max: 6000 },
                    { streitwert: 30000, min: 1750, mittel: 4000, max: 7000 },
                    { streitwert: 50000, min: 2000, mittel: 5000, max: 8000 },
                    { streitwert: 100000, min: 2500, mittel: 6500, max: 8000 },
                    { streitwert: 200000, min: 3500, mittel: 9000, max: 12000 },
                    { streitwert: 500000, min: 5500, mittel: 14000, max: 20000 },
                    { streitwert: 1000000, min: 8000, mittel: 22000, max: 35000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 400, mittel: 600, max: 2500 },
                    { streitwert: 20000, min: 1200, mittel: 2500, max: 5000 },
                    { streitwert: 50000, min: 1600, mittel: 4000, max: 7000 },
                    { streitwert: 100000, min: 2000, mittel: 5500, max: 7000 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1500, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 500, mittel: 700, max: 1200 },
                    { streitwert: 10000, min: 2000, mittel: 3800, max: 5500 },
                    { streitwert: 20000, min: 2800, mittel: 4800, max: 7000 },
                    { streitwert: 50000, min: 4000, mittel: 7500, max: 11000 },
                    { streitwert: 100000, min: 5500, mittel: 11000, max: 18000 }
                ]
            },
            schlichtung: [
                { bis: 10000, gebuehr: 100 },
                { bis: 30000, gebuehr: 200 },
                { bis: 100000, gebuehr: 400 },
                { bis: null, gebuehr: 600 }
            ]
        },

        GE: {
            name: { de: 'Genf', fr: 'Genève' },
            rechtsgrundlage: 'Règlement fixant le tarif des frais et dépens (RTFMC)',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 200, mittel: 200, max: 4000 },
                    { streitwert: 5000, min: 600, mittel: 1100, max: 4000 },
                    { streitwert: 10000, min: 800, mittel: 2200, max: 8000 },
                    { streitwert: 20000, min: 1000, mittel: 4000, max: 10000 },
                    { streitwert: 30000, min: 1200, mittel: 5200, max: 12000 },
                    { streitwert: 50000, min: 1400, mittel: 6500, max: 14000 },
                    { streitwert: 100000, min: 1500, mittel: 8000, max: 16000 },
                    { streitwert: 200000, min: 2000, mittel: 12000, max: 24000 },
                    { streitwert: 500000, min: 3000, mittel: 20000, max: 40000 },
                    { streitwert: 1000000, min: 4000, mittel: 30000, max: 60000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 200, mittel: 400, max: 4000 },
                    { streitwert: 20000, min: 800, mittel: 3200, max: 8000 },
                    { streitwert: 50000, min: 1100, mittel: 5200, max: 11000 },
                    { streitwert: 100000, min: 1200, mittel: 6400, max: 13000 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1500, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 600, mittel: 1000, max: 2000 },
                    { streitwert: 10000, min: 2500, mittel: 5000, max: 8000 },
                    { streitwert: 20000, min: 3500, mittel: 6500, max: 10000 },
                    { streitwert: 50000, min: 5000, mittel: 10000, max: 16000 },
                    { streitwert: 100000, min: 7000, mittel: 15000, max: 25000 }
                ]
            },
            schlichtung: [
                { bis: 10000, gebuehr: 150 },
                { bis: 30000, gebuehr: 300 },
                { bis: 100000, gebuehr: 500 },
                { bis: null, gebuehr: 800 }
            ]
        },

        SG: {
            name: { de: 'St. Gallen', fr: 'Saint-Gall' },
            rechtsgrundlage: 'Gerichtsgebührenverordnung',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 400, mittel: 500, max: 2000 },
                    { streitwert: 5000, min: 1000, mittel: 1250, max: 5000 },
                    { streitwert: 10000, min: 2400, mittel: 3000, max: 12000 },
                    { streitwert: 20000, min: 4400, mittel: 5500, max: 22000 },
                    { streitwert: 30000, min: 6000, mittel: 7500, max: 30000 },
                    { streitwert: 50000, min: 8000, mittel: 10000, max: 40000 },
                    { streitwert: 100000, min: 9600, mittel: 12000, max: 48000 },
                    { streitwert: 200000, min: 12800, mittel: 16000, max: 64000 },
                    { streitwert: 500000, min: 18400, mittel: 23000, max: 92000 },
                    { streitwert: 1000000, min: 24800, mittel: 31000, max: 124000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 300, mittel: 400, max: 1500 },
                    { streitwert: 20000, min: 3300, mittel: 4125, max: 16500 },
                    { streitwert: 50000, min: 6000, mittel: 7500, max: 30000 },
                    { streitwert: 100000, min: 7200, mittel: 9000, max: 36000 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1500, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 600, mittel: 800, max: 1500 },
                    { streitwert: 10000, min: 2500, mittel: 4500, max: 7000 },
                    { streitwert: 20000, min: 3200, mittel: 5500, max: 8500 },
                    { streitwert: 50000, min: 4500, mittel: 9000, max: 14000 },
                    { streitwert: 100000, min: 6000, mittel: 13000, max: 22000 }
                ]
            },
            schlichtung: [
                { bis: 10000, gebuehr: 100 },
                { bis: 30000, gebuehr: 200 },
                { bis: 100000, gebuehr: 400 },
                { bis: null, gebuehr: 600 }
            ]
        },

        VD: {
            name: { de: 'Waadt', fr: 'Vaud' },
            rechtsgrundlage: 'Tarif des frais judiciaires civils (TFJC)',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 360, mittel: 360, max: 360 },
                    { streitwert: 5000, min: 750, mittel: 750, max: 750 },
                    { streitwert: 10000, min: 1400, mittel: 1400, max: 1400 },
                    { streitwert: 20000, min: 2700, mittel: 2700, max: 2700 },
                    { streitwert: 30000, min: 3700, mittel: 3700, max: 3700 },
                    { streitwert: 50000, min: 5100, mittel: 5100, max: 5100 },
                    { streitwert: 100000, min: 7000, mittel: 7000, max: 7000 },
                    { streitwert: 200000, min: 10000, mittel: 10000, max: 10000 },
                    { streitwert: 500000, min: 18000, mittel: 18000, max: 18000 },
                    { streitwert: 1000000, min: 28000, mittel: 28000, max: 28000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 270, mittel: 270, max: 270 },
                    { streitwert: 20000, min: 2025, mittel: 2025, max: 2025 },
                    { streitwert: 50000, min: 3825, mittel: 3825, max: 3825 },
                    { streitwert: 100000, min: 5250, mittel: 5250, max: 5250 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1500, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 500, mittel: 750, max: 1500 },
                    { streitwert: 10000, min: 2000, mittel: 4000, max: 6000 },
                    { streitwert: 20000, min: 2800, mittel: 5000, max: 7500 },
                    { streitwert: 50000, min: 4000, mittel: 8000, max: 12000 },
                    { streitwert: 100000, min: 5500, mittel: 12000, max: 20000 }
                ]
            },
            schlichtung: [
                { bis: 10000, gebuehr: 100 },
                { bis: 30000, gebuehr: 200 },
                { bis: 100000, gebuehr: 400 },
                { bis: null, gebuehr: 600 }
            ]
        },

        VS: {
            name: { de: 'Wallis', fr: 'Valais' },
            rechtsgrundlage: 'Gebührentarif für die Gerichte (GTar)',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 180, mittel: 215, max: 2000 },
                    { streitwert: 5000, min: 775, mittel: 1013, max: 3000 },
                    { streitwert: 10000, min: 1200, mittel: 2150, max: 6000 },
                    { streitwert: 20000, min: 1500, mittel: 3250, max: 8000 },
                    { streitwert: 30000, min: 1800, mittel: 4000, max: 10000 },
                    { streitwert: 50000, min: 2200, mittel: 5000, max: 12000 },
                    { streitwert: 100000, min: 2700, mittel: 6250, max: 16000 },
                    { streitwert: 200000, min: 3600, mittel: 9000, max: 22000 },
                    { streitwert: 500000, min: 5400, mittel: 15000, max: 35000 },
                    { streitwert: 1000000, min: 7200, mittel: 22000, max: 50000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 150, mittel: 180, max: 1600 },
                    { streitwert: 20000, min: 1200, mittel: 2600, max: 6400 },
                    { streitwert: 50000, min: 1760, mittel: 4000, max: 9600 },
                    { streitwert: 100000, min: 2160, mittel: 5000, max: 12800 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1500, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 500, mittel: 700, max: 1200 },
                    { streitwert: 10000, min: 2000, mittel: 3800, max: 5500 },
                    { streitwert: 20000, min: 2800, mittel: 4800, max: 7000 },
                    { streitwert: 50000, min: 4000, mittel: 7500, max: 11000 },
                    { streitwert: 100000, min: 5500, mittel: 11000, max: 18000 }
                ]
            },
            schlichtung: [
                { bis: 10000, gebuehr: 100 },
                { bis: 30000, gebuehr: 200 },
                { bis: 100000, gebuehr: 400 },
                { bis: null, gebuehr: 600 }
            ]
        },

        TI: {
            name: { de: 'Tessin', fr: 'Tessin' },
            rechtsgrundlage: 'Legge sulla tariffa giudiziaria (LTG)',
            gerichtskosten: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 500, mittel: 650, max: 4000 },
                    { streitwert: 5000, min: 833, mittel: 1083, max: 4000 },
                    { streitwert: 10000, min: 1167, mittel: 2167, max: 8000 },
                    { streitwert: 20000, min: 1833, mittel: 3667, max: 8000 },
                    { streitwert: 30000, min: 2167, mittel: 4833, max: 8000 },
                    { streitwert: 50000, min: 2500, mittel: 5500, max: 8000 },
                    { streitwert: 100000, min: 3000, mittel: 6500, max: 8000 },
                    { streitwert: 200000, min: 4000, mittel: 9000, max: 12000 },
                    { streitwert: 500000, min: 6000, mittel: 14000, max: 20000 },
                    { streitwert: 1000000, min: 8000, mittel: 20000, max: 30000 }
                ],
                berufung_2inst: [
                    { streitwert: 0, min: 400, mittel: 520, max: 3200 },
                    { streitwert: 20000, min: 1467, mittel: 2933, max: 6400 },
                    { streitwert: 50000, min: 2000, mittel: 4400, max: 6400 },
                    { streitwert: 100000, min: 2400, mittel: 5200, max: 6400 }
                ],
                bundesgericht: [
                    { streitwert: 0, min: 200, mittel: 200, max: 5000 },
                    { streitwert: 20000, min: 1000, mittel: 1500, max: 5000 },
                    { streitwert: 100000, min: 2000, mittel: 3000, max: 5000 }
                ]
            },
            anwaltshonorare: {
                ordentlich_1inst: [
                    { streitwert: 0, min: 500, mittel: 750, max: 1500 },
                    { streitwert: 10000, min: 2200, mittel: 4000, max: 6000 },
                    { streitwert: 20000, min: 3000, mittel: 5200, max: 8000 },
                    { streitwert: 50000, min: 4200, mittel: 8500, max: 13000 },
                    { streitwert: 100000, min: 5800, mittel: 12500, max: 20000 }
                ]
            },
            schlichtung: [
                { bis: 10000, gebuehr: 100 },
                { bis: 30000, gebuehr: 200 },
                { bis: 100000, gebuehr: 400 },
                { bis: null, gebuehr: 600 }
            ]
        }

        // Weitere Kantone können hier einfach hinzugefügt werden
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CAP_DATA;
}
