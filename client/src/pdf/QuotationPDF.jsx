/**
 * QuotationPDF.jsx
 *
 * Generates a PDF matching the AOSL letterhead style using @react-pdf/renderer.
 *
 * Install: npm install @react-pdf/renderer
 *
 * Usage:
 *   import { PDFDownloadLink } from '@react-pdf/renderer'
 *   import { QuotationPDFDocument } from './QuotationPDF'
 *
 *   <PDFDownloadLink document={<QuotationPDFDocument doc={quotation} type="quotation" />}
 *                    fileName={`${quotation.refNumber}.pdf`}>
 *     Download PDF
 *   </PDFDownloadLink>
 *
 *   // Or to get base64 for emailing:
 *   import { pdf } from '@react-pdf/renderer'
 *   const blob = await pdf(<QuotationPDFDocument doc={q} type="quotation" />).toBlob()
 *   const base64 = await blobToBase64(blob)
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer'

/* ── Styles ──────────────────────────────────────────────── */

const C = {
  black: '#1a1a1a',
  muted: '#6b7280',
  border: '#e5e7eb',
  accent: '#1a1a1a',
  headerBg: '#f3f4f6',
  footerBg: '#f9fafb',
  red: '#ef4444',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.black,
    paddingTop: 48,
    paddingBottom: 60,
    paddingLeft: 48,
    paddingRight: 48,
  },

  // ── Header ──────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  companyName: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  companyContact: {
    fontSize: 8,
    color: C.muted,
    marginBottom: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginTop: 12,
    marginBottom: 16,
  },

  // ── Date / address block ────────────────────────────
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addressBlock: { flex: 1 },
  addressLine: { fontSize: 9, marginBottom: 2 },
  dateText: { fontSize: 9, color: C.muted, textAlign: 'right' },

  // ── Ref / title ─────────────────────────────────────
  refRow: { marginBottom: 14 },
  refLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    textDecoration: 'underline',
    marginBottom: 3,
  },
  refSubtext: { fontSize: 9, color: C.muted },

  // ── Line items table ─────────────────────────────────
  table: { marginBottom: 16 },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: C.headerBg,
    borderWidth: 1,
    borderColor: C.border,
    padding: '6 8',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: C.border,
    padding: '5 8',
    fontSize: 9,
  },
  tableRowAlt: {
    backgroundColor: C.footerBg,
  },

  // Column widths
  colNo: { width: '6%' },
  colDesc: { flex: 1 },
  colQty: { width: '10%', textAlign: 'right' },
  colUnit: { width: '18%', textAlign: 'right' },
  colAmt: { width: '20%', textAlign: 'right' },

  // ── Totals ───────────────────────────────────────────
  totalsBlock: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 3,
    fontSize: 9,
  },
  totalsLabel: {
    width: 100,
    textAlign: 'right',
    color: C.muted,
    marginRight: 8,
  },
  totalsValue: { width: 100, textAlign: 'right' },
  totalsBold: { fontFamily: 'Helvetica-Bold' },
  totalsDivider: {
    width: 210,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 6,
    marginTop: 2,
  },

  // ── Notes / validity ─────────────────────────────────
  notes: { fontSize: 9, color: C.muted, marginBottom: 20, lineHeight: 1.5 },

  // ── Signature ────────────────────────────────────────
  sigBlock: { marginTop: 8, marginBottom: 32 },
  sigText: { fontSize: 9, marginBottom: 2 },
  sigName: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  sigTitle: { fontSize: 9, color: C.muted },

  // ── Footer ───────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 8, color: C.muted },
  footerSlogan: { fontSize: 8, color: C.muted, fontStyle: 'italic' },

  // ── VAT note ─────────────────────────────────────────
  vatNote: { fontSize: 7.5, color: C.muted, fontStyle: 'italic' },
})

/* ── Helpers ─────────────────────────────────────────────── */

const fmt = (n, currency) =>
  `${currency} ${Number(n).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-KE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : ''

/* ── Document ────────────────────────────────────────────── */

/**
 * @param {{ doc: object, type: 'quotation'|'invoice' }} props
 */
export const QuotationPDFDocument = ({ doc, type = 'quotation' }) => {
  const isInvoice = type === 'invoice'
  const label = isInvoice ? 'INVOICE' : 'QUOTATION'
  const refLabel = `REF: ${label}`

  return (
    <Document title={`${doc.refNumber} — Ashmif Office Solutions`}>
      <Page size="A4" style={styles.page}>
        {/* ── Company header ── */}
        <View style={styles.header}>
          <Text style={styles.companyName}>ASHMIF OFFICE SOLUTIONS LTD</Text>
          <Text style={styles.companyContact}>
            www.ashmif.com · www.smartrealtors.app
          </Text>
          <Text style={styles.companyContact}>
            0758-839-829 · hello@ashmif.com
          </Text>
        </View>
        <View style={styles.divider} />

        {/* ── Date + client address ── */}
        <View style={styles.metaRow}>
          <View style={styles.addressBlock}>
            {doc.clientName && (
              <Text style={styles.addressLine}>{doc.clientName}</Text>
            )}
            {doc.clientAddress && (
              <Text style={styles.addressLine}>{doc.clientAddress}</Text>
            )}
            {doc.attn && (
              <Text style={[styles.addressLine, { marginTop: 4 }]}>
                Attn: {doc.attn}
              </Text>
            )}
          </View>
          <Text style={styles.dateText}>{fmtDate(doc.issueDate)}</Text>
        </View>

        {/* ── Ref block ── */}
        <View style={styles.refRow}>
          <Text style={styles.refLabel}>{refLabel}</Text>
          {doc.subject ? (
            <Text style={styles.refSubtext}>{doc.subject}</Text>
          ) : (
            <Text style={styles.refSubtext}>
              Please receive the following {label.toLowerCase()} as requested.
            </Text>
          )}
        </View>

        {/* ── Line items table ── */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>NO</Text>
            <Text style={styles.colDesc}>DESCRIPTION</Text>
            <Text style={styles.colQty}>QTY</Text>
            <Text style={styles.colUnit}>UNIT PRICE</Text>
            <Text style={styles.colAmt}>AMOUNT</Text>
          </View>

          {/* Rows */}
          {doc.lineItems.map((item, idx) => {
            const qty = item.qty ?? null
            const amount = (qty ?? 1) * item.unitPrice
            return (
              <View
                key={item._id || idx}
                style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
              >
                <Text style={styles.colNo}>{idx + 1}.</Text>
                <View style={styles.colDesc}>
                  <Text>{item.description}</Text>
                  {!item.taxable && (
                    <Text style={styles.vatNote}>(excl. VAT)</Text>
                  )}
                </View>
                <Text style={styles.colQty}>{qty ?? '—'}</Text>
                <Text style={styles.colUnit}>
                  {fmt(item.unitPrice, doc.currency)}
                </Text>
                <Text style={styles.colAmt}>{fmt(amount, doc.currency)}</Text>
              </View>
            )
          })}
        </View>

        {/* ── Totals ── */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text style={styles.totalsValue}>
              {fmt(doc.subtotal, doc.currency)}
            </Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>VAT ({doc.vatRate}%)</Text>
            <Text style={styles.totalsValue}>
              {fmt(doc.vatAmount, doc.currency)}
            </Text>
          </View>
          <View style={styles.totalsDivider} />
          <View style={styles.totalsRow}>
            <Text style={[styles.totalsLabel, styles.totalsBold]}>TOTAL</Text>
            <Text style={[styles.totalsValue, styles.totalsBold]}>
              {fmt(doc.total, doc.currency)}
            </Text>
          </View>
        </View>

        {/* ── Validity / due date ── */}
        {doc.validUntil && !isInvoice && (
          <Text style={styles.notes}>
            Valid until: {fmtDate(doc.validUntil)}
          </Text>
        )}
        {isInvoice && doc.dueDate && (
          <Text style={styles.notes}>Payment due: {fmtDate(doc.dueDate)}</Text>
        )}

        {/* ── Notes ── */}
        {doc.notes && <Text style={styles.notes}>{doc.notes}</Text>}

        {/* ── Signature block ── */}
        <View style={styles.sigBlock}>
          <Text style={styles.sigText}>Best Regards</Text>
          <Text style={styles.sigName}>Amina Hassan</Text>
          <Text style={styles.sigTitle}>Head of Marketing</Text>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Ashmif Office Solutions Ltd · Mombasa, Kenya · hello@ashmif.com ·
            0758-839-829
          </Text>
          <Text style={styles.footerSlogan}>
            Let our solutions work for you
          </Text>
        </View>
      </Page>
    </Document>
  )
}

/* ── Utility: Blob → base64 string ──────────────────────── */
export const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
