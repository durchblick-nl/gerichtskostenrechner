/**
 * Tests für den Gerichtskostenrechner
 * Ausführen mit: node test.js
 */

const {
    calculateCourtFees,
    calculateTotalProcessCosts,
    determineVerfahrensart,
    formatCHF,
    formatNumber,
    parseSwissNumber,
    getVerfahrensartLabels,
    getSachgebietLabels,
    getCantonFeeTable,
    CANTONS,
    CANTON_FEE_MULTIPLIERS,
    FEE_TABLES,
    FREE_PROCEEDINGS
} = require('./scripts/calculations.js');

let passed = 0;
let failed = 0;

function test(name, condition) {
    if (condition) {
        console.log(`✅ ${name}`);
        passed++;
    } else {
        console.log(`❌ ${name}`);
        failed++;
    }
}

console.log('=== GERICHTSKOSTENRECHNER TESTS ===\n');

// --- Basic Fee Calculation ---
console.log('--- Grundlegende Gebührenberechnung ---');

// Test 1: Schlichtung small amount
{
    const result = calculateCourtFees(5000, 'schlichtung');
    test('Schlichtung CHF 5\'000: Gebühr vorhanden',
        result.fees && result.fees.estimated > 0);
}

// Test 2: Vereinfachtes Verfahren
{
    const result = calculateCourtFees(20000, 'vereinfacht');
    test('Vereinfachtes Verfahren CHF 20\'000: Gebühr im Bereich',
        result.fees && result.fees.estimated >= 1000 && result.fees.estimated <= 3000);
}

// Test 3: Ordentliches Verfahren
{
    const result = calculateCourtFees(100000, 'ordentlich');
    test('Ordentliches Verfahren CHF 100\'000: Gebühr im Bereich',
        result.fees && result.fees.estimated >= 5000 && result.fees.estimated <= 15000);
}

// Test 4: Summarisches Verfahren
{
    const result = calculateCourtFees(50000, 'summarisch');
    test('Summarisches Verfahren CHF 50\'000: Gebühr vorhanden',
        result.fees && result.fees.estimated > 0);
}

// --- Vereinfachtes Verfahren Limit ---
console.log('\n--- Vereinfachtes Verfahren Grenzen ---');

// Test 5: Vereinfacht über 30k
{
    const result = calculateCourtFees(50000, 'vereinfacht');
    test('Vereinfachtes Verfahren über CHF 30\'000 → Fehler',
        result.error !== undefined && result.suggestion === 'ordentlich');
}

// Test 6: Vereinfacht genau 30k
{
    const result = calculateCourtFees(30000, 'vereinfacht');
    test('Vereinfachtes Verfahren bei CHF 30\'000 → OK',
        result.error === undefined && result.fees !== undefined);
}

// --- Error Handling ---
console.log('\n--- Fehlerbehandlung ---');

// Test 7: Negative amount
{
    const result = calculateCourtFees(-1000, 'ordentlich');
    test('Negativer Streitwert → Fehler', result.error !== undefined);
}

// Test 8: Zero amount
{
    const result = calculateCourtFees(0, 'ordentlich');
    test('Streitwert 0 → Fehler', result.error !== undefined);
}

// Test 9: Invalid procedure type
{
    const result = calculateCourtFees(10000, 'invalid');
    test('Ungültige Verfahrensart → Fehler', result.error !== undefined);
}

// --- Procedure Type Determination ---
console.log('\n--- Verfahrensart-Bestimmung ---');

// Test 10: Small amount → vereinfacht
{
    const type = determineVerfahrensart(10000, 'allgemein');
    test('CHF 10\'000 → vereinfachtes Verfahren', type === 'vereinfacht');
}

// Test 11: Large amount → ordentlich
{
    const type = determineVerfahrensart(50000, 'allgemein');
    test('CHF 50\'000 → ordentliches Verfahren', type === 'ordentlich');
}

// Test 12: Exactly 30k → vereinfacht
{
    const type = determineVerfahrensart(30000, 'allgemein');
    test('CHF 30\'000 → vereinfachtes Verfahren', type === 'vereinfacht');
}

// --- Total Process Costs ---
console.log('\n--- Gesamtkosten inkl. Anwalt ---');

// Test 13: Total costs include lawyer fees
{
    const result = calculateTotalProcessCosts(50000, 'ordentlich');
    test('Gesamtkosten > Gerichtskosten',
        result.totalCosts && result.totalCosts.estimated > result.fees.estimated);
}

// Test 14: Lawyer fees exist
{
    const result = calculateTotalProcessCosts(20000, 'vereinfacht');
    test('Anwaltskosten vorhanden',
        result.lawyerFees && result.lawyerFees.estimated > 0);
}

// --- Formatting Functions ---
console.log('\n--- Formatierungsfunktionen ---');

// Test 15: formatCHF
{
    const formatted = formatCHF(1234.56);
    test('formatCHF(1234.56) enthält "1" und "234"',
        formatted.includes('1') && formatted.includes('234'));
}

// Test 16: parseSwissNumber
{
    const parsed = parseSwissNumber("10'000.50");
    test('parseSwissNumber("10\'000.50") = 10000.5',
        parsed === 10000.5);
}

// Test 17: parseSwissNumber with comma
{
    const parsed = parseSwissNumber("1'234,56");
    test('parseSwissNumber("1\'234,56") = 1234.56',
        Math.abs(parsed - 1234.56) < 0.001);
}

// --- Labels ---
console.log('\n--- Labels ---');

// Test 18: German labels
{
    const labels = getVerfahrensartLabels('de');
    test('Deutsche Verfahrensart-Labels vorhanden',
        labels.schlichtung && labels.ordentlich);
}

// Test 19: French labels
{
    const labels = getVerfahrensartLabels('fr');
    test('Französische Verfahrensart-Labels vorhanden',
        labels.schlichtung && labels.ordentlich);
}

// Test 20: Sachgebiet labels
{
    const labels = getSachgebietLabels('de');
    test('Sachgebiet-Labels vorhanden',
        labels.arbeitsrecht && labels.miete);
}

// --- Fee Tables ---
console.log('\n--- Gebührentabellen ---');

// Test 21: Fee tables exist
{
    test('Alle Gebührentabellen vorhanden',
        FEE_TABLES.schlichtung &&
        FEE_TABLES.vereinfacht &&
        FEE_TABLES.ordentlich &&
        FEE_TABLES.summarisch);
}

// Test 22: Free proceedings defined
{
    test('Kostenlose Verfahren definiert',
        FREE_PROCEEDINGS.arbeitsrecht_30k &&
        FREE_PROCEEDINGS.miete);
}

// --- Canton Selection ---
console.log('\n--- Kantonsauswahl ---');

// Test: All 26 cantons defined
{
    test('Alle 26 Kantone definiert',
        Object.keys(CANTONS).length === 26);
}

// Test: Canton multipliers defined
{
    test('Kantonale Multiplikatoren definiert',
        CANTON_FEE_MULTIPLIERS.ZH === 1.0 &&
        CANTON_FEE_MULTIPLIERS.JU > 1.0 &&
        CANTON_FEE_MULTIPLIERS.OW < 1.0);
}

// Test: Canton-specific fees differ
{
    const zhResult = calculateCourtFees(50000, 'ordentlich', { canton: 'ZH' });
    const juResult = calculateCourtFees(50000, 'ordentlich', { canton: 'JU' });
    const owResult = calculateCourtFees(50000, 'ordentlich', { canton: 'OW' });
    test('Kantonale Gebühren unterscheiden sich (JU > ZH > OW)',
        juResult.fees.estimated > zhResult.fees.estimated &&
        zhResult.fees.estimated > owResult.fees.estimated);
}

// Test: Result includes canton info
{
    const result = calculateCourtFees(30000, 'vereinfacht', { canton: 'BE' });
    test('Ergebnis enthält Kantonsinfo',
        result.canton === 'BE' &&
        result.cantonName &&
        result.cantonName.de === 'Bern');
}

// Test: Canton fee table function
{
    const zhTable = getCantonFeeTable('ordentlich', 'ZH');
    const beTable = getCantonFeeTable('ordentlich', 'BE');
    test('Kantonale Gebührentabellen generiert',
        zhTable && beTable &&
        beTable[0].mid > zhTable[0].mid); // BE is more expensive
}

// --- Result Object Structure ---
console.log('\n--- Ergebnisobjekt ---');

{
    const result = calculateCourtFees(25000, 'vereinfacht');
    test('Ergebnis enthält streitwert', result.streitwert === 25000);
    test('Ergebnis enthält verfahrensart', result.verfahrensart === 'vereinfacht');
    test('Ergebnis enthält fees.min', typeof result.fees.min === 'number');
    test('Ergebnis enthält fees.estimated', typeof result.fees.estimated === 'number');
    test('Ergebnis enthält fees.max', typeof result.fees.max === 'number');
    test('Ergebnis enthält kostenvorschuss', typeof result.kostenvorschuss === 'number');
}

// --- Summary ---
console.log('\n=== ERGEBNIS ===');
console.log(`${passed} bestanden, ${failed} fehlgeschlagen`);

if (failed === 0) {
    console.log('✅ Alle Tests bestanden!');
    process.exit(0);
} else {
    console.log('❌ Einige Tests fehlgeschlagen');
    process.exit(1);
}
