/**
 * Gerichtskostenrechner - Swiss Court Fee Calculator
 * With canton-specific fee structures
 */

/**
 * Canton list with names
 */
const CANTONS = {
    ZH: { de: 'Zürich', fr: 'Zurich' },
    BE: { de: 'Bern', fr: 'Berne' },
    LU: { de: 'Luzern', fr: 'Lucerne' },
    UR: { de: 'Uri', fr: 'Uri' },
    SZ: { de: 'Schwyz', fr: 'Schwytz' },
    OW: { de: 'Obwalden', fr: 'Obwald' },
    NW: { de: 'Nidwalden', fr: 'Nidwald' },
    GL: { de: 'Glarus', fr: 'Glaris' },
    ZG: { de: 'Zug', fr: 'Zoug' },
    FR: { de: 'Freiburg', fr: 'Fribourg' },
    SO: { de: 'Solothurn', fr: 'Soleure' },
    BS: { de: 'Basel-Stadt', fr: 'Bâle-Ville' },
    BL: { de: 'Basel-Landschaft', fr: 'Bâle-Campagne' },
    SH: { de: 'Schaffhausen', fr: 'Schaffhouse' },
    AR: { de: 'Appenzell Ausserrhoden', fr: 'Appenzell Rhodes-Extérieures' },
    AI: { de: 'Appenzell Innerrhoden', fr: 'Appenzell Rhodes-Intérieures' },
    SG: { de: 'St. Gallen', fr: 'Saint-Gall' },
    GR: { de: 'Graubünden', fr: 'Grisons' },
    AG: { de: 'Aargau', fr: 'Argovie' },
    TG: { de: 'Thurgau', fr: 'Thurgovie' },
    TI: { de: 'Tessin', fr: 'Tessin' },
    VD: { de: 'Waadt', fr: 'Vaud' },
    VS: { de: 'Wallis', fr: 'Valais' },
    NE: { de: 'Neuenburg', fr: 'Neuchâtel' },
    GE: { de: 'Genf', fr: 'Genève' },
    JU: { de: 'Jura', fr: 'Jura' }
};

/**
 * Canton-specific fee multipliers (relative to Zürich base fees)
 * Based on official cantonal fee regulations research (November 2025)
 * 1.0 = Zürich reference, >1.0 = more expensive, <1.0 = less expensive
 *
 * Sources: Official cantonal fee regulations (Gebührenverordnungen)
 * See KOSTEN.md for detailed references
 */
const CANTON_FEE_MULTIPLIERS = {
    ZH: 1.00,  // Zürich - reference (GebV OG)
    BE: 1.50,  // Bern - expensive (VBRS: 12k for 100k Streitwert)
    LU: 0.65,  // Luzern - moderate (2.5-8k for 50-100k)
    UR: 1.50,  // Uri - expensive! (12k for 100k Streitwert)
    SZ: 0.90,  // Schwyz - moderate estimate
    OW: 0.80,  // Obwalden - moderate estimate
    NW: 0.80,  // Nidwalden - moderate estimate
    GL: 0.85,  // Glarus - moderate estimate
    ZG: 1.25,  // Zug - higher (5-15k for 100k)
    FR: 1.20,  // Fribourg - higher (max 500k for appeals)
    SO: 0.90,  // Solothurn - moderate
    BS: 1.10,  // Basel-Stadt - higher
    BL: 0.95,  // Basel-Landschaft - moderate
    SH: 0.90,  // Schaffhausen - moderate
    AR: 0.85,  // Appenzell AR - moderate
    AI: 0.90,  // Appenzell IR - moderate
    SG: 1.00,  // St. Gallen - same as ZH (8k for 50k)
    GR: 2.50,  // Graubünden - very expensive! (up to 30k for 100k)
    AG: 0.96,  // Aargau - moderate (7.7k for 100k)
    TG: 0.50,  // Thurgau - cheapest! (4k for 100k)
    TI: 0.90,  // Tessin - moderate
    VD: 0.80,  // Waadt - relatively cheaper for high amounts
    VS: 0.90,  // Wallis - moderate
    NE: 1.00,  // Neuenburg - average
    GE: 1.30,  // Genf - expensive
    JU: 1.20   // Jura - higher
};

/**
 * Base fee tables (average/reference values)
 */
const BASE_FEE_TABLES = {
    // Schlichtungsverfahren (Conciliation)
    schlichtung: [
        { max: 2000, min: 100, mid: 150 },
        { max: 5000, min: 150, mid: 200 },
        { max: 10000, min: 200, mid: 300 },
        { max: 30000, min: 300, mid: 400 },
        { max: 100000, min: 400, mid: 600 },
        { max: 250000, min: 500, mid: 800 },
        { max: Infinity, min: 600, mid: 1000 }
    ],

    // Vereinfachtes Verfahren (Simplified procedure, up to CHF 30'000)
    vereinfacht: [
        { max: 5000, min: 500, mid: 800 },
        { max: 10000, min: 800, mid: 1200 },
        { max: 20000, min: 1200, mid: 1800 },
        { max: 30000, min: 1500, mid: 2500 }
    ],

    // Ordentliches Verfahren (Ordinary procedure)
    ordentlich: [
        { max: 10000, min: 1500, mid: 2500 },
        { max: 30000, min: 2500, mid: 4000 },
        { max: 50000, min: 3500, mid: 5500 },
        { max: 100000, min: 5000, mid: 8000 },
        { max: 200000, min: 7000, mid: 12000 },
        { max: 500000, min: 12000, mid: 22000 },
        { max: 1000000, min: 20000, mid: 35000 },
        { max: 2000000, min: 30000, mid: 55000 },
        { max: 5000000, min: 50000, mid: 90000 },
        { max: 10000000, min: 80000, mid: 160000 },
        { max: Infinity, min: 120000, mid: 280000 }
    ],

    // Summarisches Verfahren (Summary procedure)
    summarisch: [
        { max: 10000, min: 300, mid: 600 },
        { max: 30000, min: 500, mid: 1000 },
        { max: 100000, min: 800, mid: 2000 },
        { max: 500000, min: 1500, mid: 4000 },
        { max: Infinity, min: 3000, mid: 8000 }
    ]
};

// Legacy export for compatibility
const FEE_TABLES = BASE_FEE_TABLES;

/**
 * Cases that are free of court fees (Art. 113 f. ZPO)
 */
const FREE_PROCEEDINGS = {
    arbeitsrecht_30k: {
        de: 'Arbeitsrecht bis CHF 30\'000',
        fr: 'Droit du travail jusqu\'à CHF 30\'000',
        maxStreitwert: 30000
    },
    miete: {
        de: 'Miete und Pacht von Wohn- und Geschäftsräumen',
        fr: 'Bail à loyer et à ferme d\'habitations et de locaux commerciaux',
        maxStreitwert: Infinity
    },
    gleichstellung: {
        de: 'Gleichstellungsgesetz',
        fr: 'Loi sur l\'égalité',
        maxStreitwert: Infinity
    },
    mitwirkung: {
        de: 'Mitwirkungsgesetz',
        fr: 'Loi sur la participation',
        maxStreitwert: Infinity
    }
};

/**
 * Get canton-adjusted fee table
 * @param {string} verfahrensart - Type of procedure
 * @param {string} canton - Canton code (e.g., 'ZH', 'BE')
 * @returns {Array} Adjusted fee table
 */
function getCantonFeeTable(verfahrensart, canton = 'ZH') {
    const baseTable = BASE_FEE_TABLES[verfahrensart];
    if (!baseTable) return null;

    const multiplier = CANTON_FEE_MULTIPLIERS[canton] || 1.0;

    return baseTable.map(range => ({
        max: range.max,
        min: Math.round(range.min * multiplier),
        mid: Math.round(range.mid * multiplier)
    }));
}

/**
 * Calculate estimated court fees
 * @param {number} streitwert - Amount in dispute (CHF)
 * @param {string} verfahrensart - Type of procedure
 * @param {object} options - Additional options (canton, sachgebiet)
 * @returns {object} Calculation result with fee estimates
 */
function calculateCourtFees(streitwert, verfahrensart, options = {}) {
    // Validate input
    if (typeof streitwert !== 'number' || streitwert < 0) {
        return { error: 'Ungültiger Streitwert / Valeur litigieuse invalide' };
    }

    if (streitwert === 0) {
        return { error: 'Streitwert muss grösser als 0 sein / La valeur litigieuse doit être supérieure à 0' };
    }

    // Check for vereinfacht with Streitwert > 30k
    if (verfahrensart === 'vereinfacht' && streitwert > 30000) {
        return {
            error: 'Vereinfachtes Verfahren nur bis CHF 30\'000 / Procédure simplifiée uniquement jusqu\'à CHF 30\'000',
            suggestion: 'ordentlich'
        };
    }

    // Get canton-specific fee table
    const canton = options.canton || 'ZH';
    const feeTable = getCantonFeeTable(verfahrensart, canton);

    if (!feeTable) {
        return { error: 'Ungültige Verfahrensart / Type de procédure invalide' };
    }

    // Find applicable fee range
    const feeRange = feeTable.find(range => streitwert <= range.max);

    if (!feeRange) {
        return { error: 'Streitwert ausserhalb des Berechnungsbereichs' };
    }

    // Calculate estimated fees
    const minFee = feeRange.min;
    const maxFee = Math.round(feeRange.mid * 1.5);
    const estimatedFee = feeRange.mid;

    // Check for free proceedings
    let isFree = false;
    let freeReason = null;

    if (options.sachgebiet) {
        const freeCase = FREE_PROCEEDINGS[options.sachgebiet];
        if (freeCase && streitwert <= freeCase.maxStreitwert) {
            isFree = true;
            freeReason = freeCase;
        }
    }

    return {
        streitwert,
        verfahrensart,
        canton,
        cantonName: CANTONS[canton],
        fees: {
            min: minFee,
            estimated: estimatedFee,
            max: maxFee
        },
        isFree,
        freeReason,
        kostenvorschuss: Math.round(estimatedFee / 2),
        note: 'Richtwerte - tatsächliche Gebühren können abweichen'
    };
}

/**
 * Calculate total process costs including lawyer fees (rough estimate)
 * @param {number} streitwert - Amount in dispute
 * @param {string} verfahrensart - Type of procedure
 * @param {object} options - Additional options (canton)
 * @returns {object} Total cost estimate
 */
function calculateTotalProcessCosts(streitwert, verfahrensart, options = {}) {
    const courtFees = calculateCourtFees(streitwert, verfahrensart, options);

    if (courtFees.error) {
        return courtFees;
    }

    // Lawyer fee multiplier (decreases with higher amounts)
    let lawyerMultiplier;
    if (streitwert <= 10000) {
        lawyerMultiplier = 2.5;
    } else if (streitwert <= 50000) {
        lawyerMultiplier = 2.0;
    } else if (streitwert <= 200000) {
        lawyerMultiplier = 1.5;
    } else {
        lawyerMultiplier = 1.2;
    }

    const estimatedLawyerFees = Math.round(courtFees.fees.estimated * lawyerMultiplier);

    return {
        ...courtFees,
        lawyerFees: {
            estimated: estimatedLawyerFees,
            note: 'Grobe Schätzung - Anwaltskosten variieren stark'
        },
        totalCosts: {
            min: courtFees.fees.min + Math.round(estimatedLawyerFees * 0.7),
            estimated: courtFees.fees.estimated + estimatedLawyerFees,
            max: courtFees.fees.max + Math.round(estimatedLawyerFees * 1.5)
        }
    };
}

/**
 * Determine the applicable procedure type based on Streitwert and case type
 * @param {number} streitwert - Amount in dispute
 * @param {string} sachgebiet - Subject area
 * @returns {string} Recommended procedure type
 */
function determineVerfahrensart(streitwert, sachgebiet) {
    // Summarisches Verfahren for specific case types
    if (['rechtsschutz', 'besitz', 'betreibung'].includes(sachgebiet)) {
        return 'summarisch';
    }

    // Vereinfachtes Verfahren up to CHF 30'000
    if (streitwert <= 30000) {
        return 'vereinfacht';
    }

    // Ordentliches Verfahren for larger amounts
    return 'ordentlich';
}

/**
 * Format a number as Swiss Francs
 */
function formatCHF(amount) {
    return 'CHF ' + formatNumber(amount);
}

/**
 * Format a number with Swiss thousand separators
 */
function formatNumber(num) {
    const rounded = Math.round(num * 100) / 100;
    const parts = rounded.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return parts.join('.');
}

/**
 * Parse a Swiss-formatted number string
 * Handles various apostrophe characters used as thousands separators
 */
function parseSwissNumber(str) {
    if (typeof str !== 'string') return str;
    // Remove all types of apostrophes, quotes, and spaces used as thousands separators
    return parseFloat(str.replace(/[''\u2019\u2018\u02BC\s]/g, '').replace(/,/g, '.'));
}

/**
 * Get procedure type labels
 */
function getVerfahrensartLabels(lang = 'de') {
    const labels = {
        de: {
            schlichtung: 'Schlichtungsverfahren',
            vereinfacht: 'Vereinfachtes Verfahren (bis CHF 30\'000)',
            ordentlich: 'Ordentliches Verfahren',
            summarisch: 'Summarisches Verfahren'
        },
        fr: {
            schlichtung: 'Procédure de conciliation',
            vereinfacht: 'Procédure simplifiée (jusqu\'à CHF 30\'000)',
            ordentlich: 'Procédure ordinaire',
            summarisch: 'Procédure sommaire'
        }
    };
    return labels[lang] || labels.de;
}

/**
 * Get subject area labels
 */
function getSachgebietLabels(lang = 'de') {
    const labels = {
        de: {
            allgemein: 'Allgemeines Zivilrecht',
            arbeitsrecht: 'Arbeitsrecht',
            miete: 'Mietrecht',
            kaufvertrag: 'Kaufvertrag',
            werkvertrag: 'Werkvertrag',
            schadenersatz: 'Schadenersatz',
            erbrecht: 'Erbrecht',
            gesellschaftsrecht: 'Gesellschaftsrecht'
        },
        fr: {
            allgemein: 'Droit civil général',
            arbeitsrecht: 'Droit du travail',
            miete: 'Droit du bail',
            kaufvertrag: 'Contrat de vente',
            werkvertrag: 'Contrat d\'entreprise',
            schadenersatz: 'Dommages-intérêts',
            erbrecht: 'Droit des successions',
            gesellschaftsrecht: 'Droit des sociétés'
        }
    };
    return labels[lang] || labels.de;
}

/**
 * Get canton options for dropdown
 */
function getCantonOptions(lang = 'de') {
    return Object.entries(CANTONS).map(([code, names]) => ({
        value: code,
        label: names[lang] || names.de
    }));
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateCourtFees,
        calculateTotalProcessCosts,
        determineVerfahrensart,
        formatCHF,
        formatNumber,
        parseSwissNumber,
        getVerfahrensartLabels,
        getSachgebietLabels,
        getCantonOptions,
        getCantonFeeTable,
        CANTONS,
        CANTON_FEE_MULTIPLIERS,
        FEE_TABLES,
        BASE_FEE_TABLES,
        FREE_PROCEEDINGS
    };
}
