import styled, { keyframes } from 'styled-components'
import { X, Download, Send, AlertTriangle, CheckCircle, Save } from 'lucide-react'
import { PDFDownloadLink, pdf } from '@react-pdf/renderer'
import { blobToBase64, QuotationPDFDocument } from '../pdf/QuotationPDF'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useState } from 'react'
import { BRAND } from '../constants/brand'

/* ── Animations ───────────────────────────────────────────── */
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`
const slideUp = keyframes`
  from { transform: translateY(24px); opacity: 0 }
  to   { transform: translateY(0);    opacity: 1 }
`

/* ── Status → accent color ───────────────────────────────── */
const STATUS_ACCENT = {
  draft: '#94a3b8',
  sent: '#3b82f6',
  paid: '#10b981',
  overdue: '#ef4444',
  cancelled: '#6b7280',
}

/* ── Layout ───────────────────────────────────────────────── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  overflow-y: auto;
  animation: ${fadeIn} 0.18s ease;
`

const Sheet = styled.div`
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 820px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
  animation: ${slideUp} 0.22s ease;
  overflow: hidden;
  position: relative;
`

const AccentBar = styled.div`
  height: 4px;
  width: 100%;
  background: ${({ $color }) => $color};
`

/* ── Modal top bar ───────────────────────────────────────── */
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eef0f2;
  background: #fafbfc;
  flex-wrap: wrap;
  gap: 0.75rem;

  .left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .title {
    font-weight: 700;
    font-size: 0.88rem;
    color: #0f172a;
  }
  .ref {
    font-size: 0.76rem;
    font-family: 'JetBrains Mono', monospace;
    color: #475569;
    background: #eef0f2;
    padding: 0.2rem 0.6rem;
    border-radius: 5px;
  }
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0.22rem 0.6rem;
    border-radius: 999px;
    background: ${({ $tint }) => $tint};
    color: ${({ $color }) => $color};
  }
  .badge-etims {
    font-size: 0.68rem;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    background: #fef3c7;
    color: #b45309;
    font-weight: 700;
    border: 1px solid #fcd34d;
  }
`

const Actions = styled.div`
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
`

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.42rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid #e2e5e9;
  background: #fff;
  color: #0f172a;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s ease;

  &:hover {
    background: #f5f6f8;
    border-color: #d3d7dc;
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &.primary {
    background: #0f172a;
    color: #fff;
    border-color: transparent;
    &:hover {
      opacity: 0.88;
      background: #0f172a;
    }
  }

  a {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: inherit;
    text-decoration: none;
  }
`

const CloseBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid #e2e5e9;
  background: transparent;
  cursor: pointer;
  color: #64748b;
  &:hover {
    background: #f5f6f8;
    color: #0f172a;
  }
`

/* ── Document body ───────────────────────────────────────── */
const DocBody = styled.div`
  padding: 2.75rem 3rem;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #0f172a;
  line-height: 1.55;

  @media (max-width: 600px) {
    padding: 1.75rem 1.25rem;
  }
`

const BrandHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  .brand-left {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .brand-logo {
    width: 46px;
    height: 46px;
    border-radius: 10px;
    object-fit: contain;
    background: #f8fafc;
    border: 1px solid #eef0f2;
    padding: 4px;
    flex-shrink: 0;
  }

  .brand-name {
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: 0.02em;
  }
  .brand-contact {
    font-size: 11px;
    color: #64748b;
    margin-top: 3px;
    line-height: 1.6;
  }

  .doc-type {
    text-align: right;
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: 0.06em;
    color: #cbd5e1;
  }
  .doc-ref {
    text-align: right;
    font-size: 12px;
    font-family: 'JetBrains Mono', monospace;
    color: #475569;
    margin-top: 2px;
  }
`

const PartiesRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eef0f2;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }

  .block-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    margin-bottom: 0.4rem;
  }
  .block-body {
    font-size: 12.5px;
    line-height: 1.7;
  }
  .name {
    font-weight: 700;
    font-size: 13.5px;
  }
  .dates {
    margin-top: 0.75rem;
    font-size: 12px;
    color: #64748b;
    .row {
      display: flex;
      justify-content: space-between;
      max-width: 220px;
      margin-top: 2px;
    }
    strong {
      color: #0f172a;
    }
  }
`

const SubjectLine = styled.div`
  margin-bottom: 1.25rem;
  .subject {
    font-size: 12.5px;
    color: #334155;
    font-style: italic;
  }
`

/* ── Due date / status banner ───────────────────────────── */
const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 500;
  margin-bottom: 1.25rem;

  &.overdue {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }
  &.due-soon {
    background: #fffbeb;
    color: #b45309;
    border: 1px solid #fde68a;
  }
  &.paid {
    background: #f0fdf4;
    color: #047857;
    border: 1px solid #bbf7d0;
  }
`

/* ── Table ──────────────────────────────────────────────── */
const TableWrap = styled.div`
  border: 1px solid #eef0f2;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 1.5rem;
`
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
`
const Th = styled.th`
  background: #f8fafc;
  border-bottom: 1px solid #eef0f2;
  padding: 9px 12px;
  font-size: 10.5px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
`
const Td = styled.td`
  border-bottom: 1px solid #f1f3f5;
  padding: 9px 12px;
  background: ${({ $alt }) => ($alt ? '#fbfcfd' : '#fff')};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  vertical-align: top;
  .vat-note {
    font-size: 10px;
    color: #94a3b8;
    display: block;
  }
`

/* ── Totals ─────────────────────────────────────────────── */
const TotalsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
`
const TotalsCard = styled.div`
  min-width: 260px;
  border: 1px solid #eef0f2;
  border-radius: 10px;
  overflow: hidden;
`
const TotalsRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  font-size: 12.5px;
  color: #475569;

  &.grand {
    background: #0f172a;
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    padding: 0.75rem 1rem;
  }
`

const Notes = styled.p`
  font-size: 12px;
  color: #64748b;
  margin-bottom: 1.25rem;
  line-height: 1.6;
`

const Sig = styled.div`
  margin-top: 0.5rem;
  font-size: 12.5px;
  .name {
    font-weight: 700;
    font-size: 13.5px;
    margin-top: 2px;
  }
  .role {
    color: #64748b;
  }
`

const Footer = styled.div`
  border-top: 1px solid #eef0f2;
  padding-top: 0.85rem;
  margin-top: 2.25rem;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #94a3b8;
  flex-wrap: wrap;
  gap: 0.25rem;
  .slogan {
    font-style: italic;
  }
`

/* ── eTIMS uploaded notice ──────────────────────────────── */
const EtimsNotice = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 9px;
  padding: 0.9rem 1.1rem;
  font-size: 12.5px;
  color: #92400e;
  margin-bottom: 1.25rem;
  line-height: 1.6;
  strong {
    display: block;
    margin-bottom: 2px;
  }
`

/* ── Helpers ─────────────────────────────────────────────── */
const fmt = (n, currency = 'KES') =>
  `${currency} ${Number(n).toLocaleString('en-KE', {
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

const getDueStatus = (inv) => {
  if (!inv.dueDate || inv.status === 'paid' || inv.status === 'cancelled')
    return null
  const days = (new Date(inv.dueDate) - Date.now()) / 86_400_000
  if (days < 0) return 'overdue'
  if (days <= 7) return 'due-soon'
  return null
}

/* ── Component ───────────────────────────────────────────── */

const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const toBackendUrl = (path) =>
  path?.startsWith('http') ? path : `${API_ORIGIN}${path}`

export const InvoiceViewModal = ({ open, onClose, invoice: doc, onSend }) => {
  const { post } = useAuthedRequest()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!open || !doc) return null

  const isUploaded = doc.type === 'uploaded'
  const dueStatus = getDueStatus(doc)
  const accent = STATUS_ACCENT[doc.status] || STATUS_ACCENT.draft

  // For uploaded eTIMS invoices, the PDF is stored server-side — no client-gen PDF
  const canGeneratePDF = !isUploaded
  const pdfDoc = canGeneratePDF ? (
    <QuotationPDFDocument doc={doc} type="invoice" />
  ) : null

  const handleSendWithPDF = async () => {
    if (!onSend) return
    if (canGeneratePDF) {
      const blob = await pdf(pdfDoc).toBlob()
      const base64 = await blobToBase64(blob)
      onSend(doc.clientEmail || '', base64)
    } else {
      onSend(doc.clientEmail || '', null) // server will attach stored file
    }
  }

  // Save a copy to the portal without emailing — makes drafts downloadable
  // by the client from CompanyDetails, not just invoices that get sent.
  const handleSaveToPortal = async () => {
    if (!canGeneratePDF || !post) return
    setSaving(true)
    try {
      const blob = await pdf(pdfDoc).toBlob()
      const base64 = await blobToBase64(blob)
      await post(`/api/accounts/invoices/${doc._id}/store-pdf`, {
        pdfBase64: base64,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to save invoice PDF:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Sheet>
        <AccentBar $color={accent} />

        {/* ── Top bar ── */}
        <TopBar>
          <div className="left">
            <span className="title">Invoice</span>
            <span className="ref">{doc.refNumber}</span>
            {isUploaded && <span className="badge-etims">eTIMS</span>}
            <span
              className="status-pill"
              $tint={`${accent}1a`}
              $color={accent}
            >
              {doc.status === 'paid' && <CheckCircle size={11} />}
              {doc.status}
            </span>
          </div>
          <Actions>
            {canGeneratePDF && doc.status === 'draft' && (
              <Btn onClick={handleSaveToPortal} disabled={saving}>
                <Save size={13} />
                {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save to portal'}
              </Btn>
            )}
            {onSend && (
              <Btn onClick={handleSendWithPDF}>
                <Send size={13} /> Send
              </Btn>
            )}
            {canGeneratePDF && (
              <Btn className="primary">
                <PDFDownloadLink
                  document={pdfDoc}
                  fileName={`${doc.refNumber}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      'Generating…'
                    ) : (
                      <>
                        <Download size={13} /> Download PDF
                      </>
                    )
                  }
                </PDFDownloadLink>
              </Btn>
            )}
            {isUploaded && doc.attachmentUrl && (
              <Btn
                className="primary"
                as="a"
                href={toBackendUrl(doc.attachmentUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={13} /> View eTIMS PDF
              </Btn>
            )}
            <CloseBtn onClick={onClose}>
              <X size={14} />
            </CloseBtn>
          </Actions>
        </TopBar>

        {/* ── Document preview ── */}
        <DocBody>
          {/* Brand + doc type header */}
          <BrandHeader>
            <div className="brand-left">
              <img src={BRAND.logoUrl} alt={BRAND.name} className="brand-logo" />
              <div>
                <div className="brand-name">{BRAND.name}</div>
                <div className="brand-contact">
                  {BRAND.website} · {BRAND.address}
                  <br />
                  {BRAND.phone} · {BRAND.email}
                </div>
              </div>
            </div>
            <div>
              <div className="doc-type">INVOICE</div>
              <div className="doc-ref">{doc.refNumber}</div>
            </div>
          </BrandHeader>

          {/* Paid / overdue / due-soon banner */}
          {doc.status === 'paid' && (
            <Banner className="paid">
              <CheckCircle size={14} />
              Payment received — this invoice is marked as paid
              {doc.paidAt && ` on ${fmtDate(doc.paidAt)}`}.
            </Banner>
          )}
          {dueStatus === 'overdue' && (
            <Banner className="overdue">
              <AlertTriangle size={14} />
              This invoice was due on{' '}
              <strong style={{ marginLeft: 4 }}>{fmtDate(doc.dueDate)}</strong>
              &nbsp;and is now overdue.
            </Banner>
          )}
          {dueStatus === 'due-soon' && (
            <Banner className="due-soon">
              <AlertTriangle size={14} />
              Payment due on{' '}
              <strong style={{ marginLeft: 4 }}>
                {fmtDate(doc.dueDate)}
              </strong>{' '}
              — within 7 days.
            </Banner>
          )}

          {/* eTIMS notice for uploaded invoices */}
          {isUploaded && (
            <EtimsNotice>
              <strong>
                eTIMS Invoice {doc.etimsRef && `· ${doc.etimsRef}`}
              </strong>
              This invoice was uploaded as an eTIMS PDF. The original file is
              attached when sent by email.
            </EtimsNotice>
          )}

          {/* Bill To / Dates */}
          <PartiesRow>
            <div>
              <div className="block-label">Bill To</div>
              <div className="block-body">
                {doc.clientName && <div className="name">{doc.clientName}</div>}
                {doc.clientAddress && <div>{doc.clientAddress}</div>}
                {doc.attn && (
                  <div style={{ marginTop: 4 }}>
                    <strong>Attn:</strong> {doc.attn}
                  </div>
                )}
              </div>
            </div>
            <div>
              <div className="block-label">Details</div>
              <div className="dates">
                <div className="row">
                  <span>Issue date</span>
                  <strong>{fmtDate(doc.issueDate)}</strong>
                </div>
                {doc.dueDate && (
                  <div className="row">
                    <span>Due date</span>
                    <strong>{fmtDate(doc.dueDate)}</strong>
                  </div>
                )}
              </div>
            </div>
          </PartiesRow>

          {doc.subject && (
            <SubjectLine>
              <div className="subject">{doc.subject}</div>
            </SubjectLine>
          )}

          {/* Line items */}
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: '5%' }}>NO</Th>
                  <Th>DESCRIPTION</Th>
                  <Th $right style={{ width: '9%' }}>
                    QTY
                  </Th>
                  <Th $right style={{ width: '17%' }}>
                    UNIT PRICE
                  </Th>
                  <Th $right style={{ width: '19%' }}>
                    AMOUNT
                  </Th>
                </tr>
              </thead>
              <tbody>
                {doc.lineItems?.map((item, idx) => {
                  const qty = item.qty ?? null
                  const amount = (qty ?? 1) * item.unitPrice
                  return (
                    <tr key={item._id || idx}>
                      <Td $alt={idx % 2 === 1}>{idx + 1}.</Td>
                      <Td $alt={idx % 2 === 1}>
                        {item.description}
                        {!item.taxable && (
                          <span className="vat-note">(excl. VAT)</span>
                        )}
                      </Td>
                      <Td $alt={idx % 2 === 1} $right>
                        {qty ?? '—'}
                      </Td>
                      <Td $alt={idx % 2 === 1} $right>
                        {fmt(item.unitPrice, doc.currency)}
                      </Td>
                      <Td $alt={idx % 2 === 1} $right>
                        {fmt(amount, doc.currency)}
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </TableWrap>

          {/* Totals */}
          <TotalsWrap>
            <TotalsCard>
              {!isUploaded && (
                <>
                  <TotalsRow>
                    <span>Subtotal</span>
                    <span>{fmt(doc.subtotal, doc.currency)}</span>
                  </TotalsRow>
                  <TotalsRow>
                    <span>VAT ({doc.vatRate}%)</span>
                    <span>{fmt(doc.vatAmount, doc.currency)}</span>
                  </TotalsRow>
                </>
              )}
              <TotalsRow className="grand">
                <span>TOTAL</span>
                <span>{fmt(doc.total, doc.currency)}</span>
              </TotalsRow>
            </TotalsCard>
          </TotalsWrap>

          {/* Notes */}
          {doc.notes && <Notes>{doc.notes}</Notes>}

          {/* Signature — dynamic, not hardcoded — not shown for eTIMS uploads */}
          {!isUploaded && (
            <Sig>
              <div>Best Regards</div>
              <div className="name">{doc.signatoryName || BRAND.name}</div>
              <div className="role">
                {doc.signatoryTitle || BRAND.website}
              </div>
            </Sig>
          )}

          {/* Footer */}
          <Footer>
            <span>
              {BRAND.name} · {BRAND.address} · {BRAND.email} · {BRAND.phone}
            </span>
            <span className="slogan">{BRAND.slogan}</span>
          </Footer>
        </DocBody>
      </Sheet>
    </Overlay>
  )
}