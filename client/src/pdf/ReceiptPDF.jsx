import { Document, Page, View, Text, StyleSheet, Image } from '@react-pdf/renderer'
import { BRAND } from '../constants/brand'

export const blobToBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      // reader.result is a data URL — strip the "data:application/pdf;base64," prefix
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#0f172a',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  brandLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 40, height: 40, marginRight: 10, objectFit: 'contain' },
  brandName: { fontSize: 13, fontWeight: 700 },
  brandContact: { fontSize: 8.5, color: '#64748b', marginTop: 3, lineHeight: 1.5 },
  docType: { fontSize: 20, fontWeight: 700, color: '#cbd5e1', textAlign: 'right' },
  docRef: { fontSize: 9.5, color: '#475569', textAlign: 'right', marginTop: 2 },
  paidBanner: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
    color: '#047857',
    fontSize: 10,
  },
  partiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f2',
    paddingBottom: 14,
    marginBottom: 14,
  },
  blockLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: '#94a3b8',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  blockBody: { fontSize: 10, lineHeight: 1.6 },
  nameText: { fontWeight: 700, fontSize: 10.5 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', maxWidth: 200, marginTop: 2 },
  table: { borderWidth: 1, borderColor: '#eef0f2', borderRadius: 6, marginBottom: 16 },
  tHeadRow: { flexDirection: 'row', backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#eef0f2' },
  tRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  th: { padding: 6, fontSize: 8, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' },
  td: { padding: 6, fontSize: 9.5 },
  colNo: { width: '6%' },
  colDesc: { width: '49%' },
  colQty: { width: '10%', textAlign: 'right' },
  colPrice: { width: '17%', textAlign: 'right' },
  colAmount: { width: '18%', textAlign: 'right' },
  totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 18 },
  totalsCard: { minWidth: 220, borderWidth: 1, borderColor: '#eef0f2', borderRadius: 6 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', padding: '6 10', fontSize: 9.5, color: '#475569' },
  paymentCard: {
    borderWidth: 1,
    borderColor: '#eef0f2',
    borderRadius: 6,
    padding: 10,
    marginBottom: 18,
    backgroundColor: '#fbfcfd',
  },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 3, fontSize: 9.5 },
  grandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    padding: '9 10',
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
  },
  sig: { marginTop: 10, fontSize: 9.5 },
  sigName: { fontWeight: 700, fontSize: 10.5, marginTop: 2 },
  sigRole: { color: '#64748b' },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eef0f2',
    paddingTop: 8,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: '#94a3b8',
  },
})

const fmt = (n, currency = 'KES') =>
  `${currency} ${Number(n || 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-KE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '—'

export const ReceiptPDFDocument = ({ receipt }) => {
  const r = receipt
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.brandLeft}>
            {BRAND.logoUrl && <Image src={BRAND.logoUrl} style={styles.logo} />}
            <View>
              <Text style={styles.brandName}>{BRAND.name}</Text>
              <Text style={styles.brandContact}>
                {BRAND.website} · {BRAND.address}
              </Text>
              <Text style={styles.brandContact}>
                {BRAND.phone} · {BRAND.email}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.docType}>RECEIPT</Text>
            <Text style={styles.docRef}>{r.refNumber}</Text>
          </View>
        </View>

        <View style={styles.paidBanner}>
          <Text>
            Payment received in full on {fmtDate(r.paidAt)} against invoice{' '}
            {r.invoiceRefNumber}.
          </Text>
        </View>

        <View style={styles.partiesRow}>
          <View>
            <Text style={styles.blockLabel}>Received From</Text>
            <View style={styles.blockBody}>
              {r.clientName ? <Text style={styles.nameText}>{r.clientName}</Text> : null}
              {r.clientAddress ? <Text>{r.clientAddress}</Text> : null}
            </View>
          </View>
          <View>
            <Text style={styles.blockLabel}>Details</Text>
            <View style={styles.detailsRow}>
              <Text>Invoice ref</Text>
              <Text style={{ fontWeight: 700 }}>{r.invoiceRefNumber}</Text>
            </View>
            <View style={styles.detailsRow}>
              <Text>Date paid</Text>
              <Text style={{ fontWeight: 700 }}>{fmtDate(r.paidAt)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tHeadRow}>
            <Text style={[styles.th, styles.colNo]}>NO</Text>
            <Text style={[styles.th, styles.colDesc]}>DESCRIPTION</Text>
            <Text style={[styles.th, styles.colQty]}>QTY</Text>
            <Text style={[styles.th, styles.colPrice]}>UNIT PRICE</Text>
            <Text style={[styles.th, styles.colAmount]}>AMOUNT</Text>
          </View>
          {(r.lineItems || []).map((item, idx) => {
            const qty = item.qty ?? null
            const amount = (qty ?? 1) * item.unitPrice
            return (
              <View style={styles.tRow} key={idx}>
                <Text style={[styles.td, styles.colNo]}>{idx + 1}.</Text>
                <Text style={[styles.td, styles.colDesc]}>{item.description}</Text>
                <Text style={[styles.td, styles.colQty]}>{qty ?? '—'}</Text>
                <Text style={[styles.td, styles.colPrice]}>{fmt(item.unitPrice, r.currency)}</Text>
                <Text style={[styles.td, styles.colAmount]}>{fmt(amount, r.currency)}</Text>
              </View>
            )
          })}
        </View>

        <View style={styles.totalsWrap}>
          <View style={styles.totalsCard}>
            <View style={styles.totalsRow}>
              <Text>Subtotal</Text>
              <Text>{fmt(r.subtotal, r.currency)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text>VAT ({r.vatRate}%)</Text>
              <Text>{fmt(r.vatAmount, r.currency)}</Text>
            </View>
            <View style={styles.grandRow}>
              <Text>AMOUNT PAID</Text>
              <Text>{fmt(r.amountPaid, r.currency)}</Text>
            </View>
          </View>
        </View>

        {(r.paymentMethod || r.paymentReference) && (
          <View style={styles.paymentCard}>
            <Text style={styles.blockLabel}>Payment Details</Text>
            {r.paymentMethod && (
              <View style={styles.paymentRow}>
                <Text>Method</Text>
                <Text style={{ fontWeight: 700 }}>{r.paymentMethod}</Text>
              </View>
            )}
            {r.paymentReference && (
              <View style={styles.paymentRow}>
                <Text>Reference</Text>
                <Text style={{ fontWeight: 700 }}>{r.paymentReference}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.sig}>
          <Text>Thank you for your payment.</Text>
          <Text style={styles.sigName}>{r.signatoryName || BRAND.name}</Text>
          <Text style={styles.sigRole}>{r.signatoryTitle || BRAND.website}</Text>
        </View>

        <View style={styles.footer}>
          <Text>
            {BRAND.name} · {BRAND.address} · {BRAND.email} · {BRAND.phone}
          </Text>
          <Text>{BRAND.slogan}</Text>
        </View>
      </Page>
    </Document>
  )
}