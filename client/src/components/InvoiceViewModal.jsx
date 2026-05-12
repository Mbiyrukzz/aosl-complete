import styled, { keyframes } from 'styled-components'
import { X, Download, Send, AlertTriangle, CheckCircle } from 'lucide-react'
import { PDFDownloadLink, pdf } from '@react-pdf/renderer'
import { blobToBase64, QuotationPDFDocument } from '../pdf/QuotationPDF'

/* ── Animations ───────────────────────────────────────────── */
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`
const slideUp = keyframes`
  from { transform: translateY(24px); opacity: 0 }
  to   { transform: translateY(0);    opacity: 1 }
`

/* ── Layout ───────────────────────────────────────────────── */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
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
  border-radius: 12px;
  width: 100%;
  max-width: 780px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.22s ease;
  overflow: hidden;
`

/* ── Modal top bar ───────────────────────────────────────── */
const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;

  .left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
  }
  .title {
    font-weight: 600;
    font-size: 0.9rem;
  }
  .ref {
    font-size: 0.78rem;
    font-family: monospace;
    color: #6b7280;
    background: #e5e7eb;
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
  }
  .badge-etims {
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    background: #fef3c7;
    color: #d97706;
    font-weight: 600;
    border: 1px solid #fcd34d;
  }
  .badge-paid {
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    background: #d1fae5;
    color: #059669;
    font-weight: 600;
    border: 1px solid #6ee7b7;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: 7px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #1a1a1a;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s ease;

  &:hover {
    background: #f3f4f6;
  }

  &.primary {
    background: #1a1a1a;
    color: #fff;
    border-color: transparent;
    &:hover {
      opacity: 0.85;
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
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  &:hover {
    background: #f3f4f6;
    color: #1a1a1a;
  }
`

/* ── Document body ───────────────────────────────────────── */
const DocBody = styled.div`
  padding: 2.5rem 3rem;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #1a1a1a;
  line-height: 1.5;

  @media (max-width: 600px) {
    padding: 1.5rem 1.25rem;
  }
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 1.75rem;
  .logo-name {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .contact {
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
  }
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0 1.25rem;
`

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  gap: 1rem;

  .address-block {
    font-size: 12.5px;
    line-height: 1.7;
  }
  .date {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
  }
`

const RefBlock = styled.div`
  margin-bottom: 1.25rem;
  .label {
    font-weight: 700;
    font-size: 13px;
    text-decoration: underline;
    margin-bottom: 2px;
  }
  .subject {
    font-size: 12px;
    color: #6b7280;
  }
`

/* ── Due date banner ────────────────────────────────────── */
const DueBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 7px;
  font-size: 12.5px;
  font-weight: 500;
  margin-bottom: 1.25rem;

  &.overdue {
    background: #fef2f2;
    color: #ef4444;
    border: 1px solid #fecaca;
  }
  &.due-soon {
    background: #fffbeb;
    color: #d97706;
    border: 1px solid #fde68a;
  }
  &.paid {
    background: #f0fdf4;
    color: #059669;
    border: 1px solid #bbf7d0;
  }
`

/* ── Table ──────────────────────────────────────────────── */
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.25rem;
  font-size: 12.5px;
`
const Th = styled.th`
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
`
const Td = styled.td`
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  background: ${({ $alt }) => ($alt ? '#f9fafb' : '#fff')};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  vertical-align: top;
  .vat-note {
    font-size: 10px;
    color: #9ca3af;
    display: block;
  }
`

/* ── Totals ─────────────────────────────────────────────── */
const TotalsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
`
const TotalsTable = styled.table`
  border-collapse: collapse;
  font-size: 12.5px;
  min-width: 240px;
`
const TotalsRow = styled.tr`
  td {
    padding: 3px 8px;
    &:last-child {
      text-align: right;
      min-width: 110px;
    }
    &:first-child {
      color: #6b7280;
      text-align: right;
    }
  }
  &.grand {
    border-top: 1px solid #e5e7eb;
    td {
      padding-top: 7px;
      font-weight: 700;
      color: #1a1a1a;
      font-size: 13px;
    }
  }
`

const Notes = styled.p`
  font-size: 12px;
  color: #6b7280;
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
    color: #6b7280;
  }
`

const Footer = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #9ca3af;
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
  border-radius: 8px;
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
  if (!open || !doc) return null

  const isUploaded = doc.type === 'uploaded'
  const dueStatus = getDueStatus(doc)

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

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Sheet>
        {/* ── Top bar ── */}
        <TopBar>
          <div className="left">
            <span className="title">Invoice</span>
            <span className="ref">{doc.refNumber}</span>
            {isUploaded && <span className="badge-etims">eTIMS</span>}
            {doc.status === 'paid' && (
              <span className="badge-paid">
                <CheckCircle size={11} /> Paid
              </span>
            )}
          </div>
          <Actions>
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
          {/* Company header */}
          <Header>
            <div className="logo-name">ASHMIF OFFICE SOLUTIONS LTD</div>
            <div className="contact">www.ashmif.com · Mombasa, Kenya</div>
            <div className="contact">0758-839-829 · hello@ashmif.com</div>
          </Header>

          <Divider />

          {/* Due-date / paid banner */}
          {doc.status === 'paid' && (
            <DueBanner className="paid">
              <CheckCircle size={14} />
              Payment received — this invoice is marked as paid
              {doc.paidAt && ` on ${fmtDate(doc.paidAt)}`}.
            </DueBanner>
          )}
          {dueStatus === 'overdue' && (
            <DueBanner className="overdue">
              <AlertTriangle size={14} />
              This invoice was due on{' '}
              <strong style={{ marginLeft: 4 }}>{fmtDate(doc.dueDate)}</strong>
              &nbsp;and is now overdue.
            </DueBanner>
          )}
          {dueStatus === 'due-soon' && (
            <DueBanner className="due-soon">
              <AlertTriangle size={14} />
              Payment due on{' '}
              <strong style={{ marginLeft: 4 }}>
                {fmtDate(doc.dueDate)}
              </strong>{' '}
              — within 7 days.
            </DueBanner>
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

          {/* Date + client address */}
          <MetaRow>
            <div className="address-block">
              {doc.clientName && <div>{doc.clientName}</div>}
              {doc.clientAddress && <div>{doc.clientAddress}</div>}
              {doc.attn && (
                <div style={{ marginTop: 6 }}>
                  <strong>Attn:</strong> {doc.attn}
                </div>
              )}
            </div>
            <div className="date">{fmtDate(doc.issueDate)}</div>
          </MetaRow>

          {/* Ref */}
          <RefBlock>
            <div className="label">REF: INVOICE</div>
            <div className="subject">
              {doc.subject || 'Please find the following invoice as agreed.'}
            </div>
          </RefBlock>

          {/* Line items */}
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

          {/* Totals */}
          {!isUploaded && (
            <TotalsWrap>
              <TotalsTable>
                <tbody>
                  <TotalsRow>
                    <td>Subtotal</td>
                    <td>{fmt(doc.subtotal, doc.currency)}</td>
                  </TotalsRow>
                  <TotalsRow>
                    <td>VAT ({doc.vatRate}%)</td>
                    <td>{fmt(doc.vatAmount, doc.currency)}</td>
                  </TotalsRow>
                  <TotalsRow className="grand">
                    <td>TOTAL</td>
                    <td>{fmt(doc.total, doc.currency)}</td>
                  </TotalsRow>
                </tbody>
              </TotalsTable>
            </TotalsWrap>
          )}

          {isUploaded && (
            <TotalsWrap>
              <TotalsTable>
                <tbody>
                  <TotalsRow className="grand">
                    <td>TOTAL</td>
                    <td>{fmt(doc.total, doc.currency)}</td>
                  </TotalsRow>
                </tbody>
              </TotalsTable>
            </TotalsWrap>
          )}

          {/* Due date / notes */}
          {doc.dueDate && (
            <Notes>
              Payment due: <strong>{fmtDate(doc.dueDate)}</strong>
            </Notes>
          )}
          {doc.notes && <Notes>{doc.notes}</Notes>}

          {/* Signature — not shown for eTIMS uploads */}
          {!isUploaded && (
            <Sig>
              <div>Best Regards</div>
              <div className="name">Ashmif Office Solutions Ltd</div>
              <div className="role">www.ashmif.com</div>
            </Sig>
          )}

          {/* Footer */}
          <Footer>
            <span>
              Ashmif Office Solutions Ltd · Mombasa, Kenya · hello@ashmif.com ·
              0758-839-829
            </span>
            <span className="slogan">Let our solutions work for you</span>
          </Footer>
        </DocBody>
      </Sheet>
    </Overlay>
  )
}
