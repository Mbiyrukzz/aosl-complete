import styled, { keyframes } from 'styled-components'
import { X, Download, Send } from 'lucide-react'
import { PDFDownloadLink, pdf } from '@react-pdf/renderer'
import { blobToBase64, QuotationPDFDocument } from '../pdf/QuotationPDF'

/* ── Animations ───────────────────────────────────────────── */
const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`
const slideUp = keyframes`from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 }`

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
    gap: 0.75rem;
  }
  .ref {
    font-size: 0.78rem;
    font-family: monospace;
    color: #6b7280;
    background: #e5e7eb;
    padding: 0.2rem 0.55rem;
    border-radius: 4px;
  }
  .title {
    font-weight: 600;
    font-size: 0.9rem;
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

  /* Wraps PDFDownloadLink anchor */
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

/* ── Table ─────────────────────────────────────────────────── */
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

/* ── Totals ─────────────────────────────────────────────────── */
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

/* ── Notes / validity ───────────────────────────────────────── */
const Notes = styled.p`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 1.25rem;
  line-height: 1.6;
`

/* ── Signature ──────────────────────────────────────────────── */
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

/* ── Footer ─────────────────────────────────────────────────── */
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

/* ── Helpers ─────────────────────────────────────────────────── */
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

/* ── Component ───────────────────────────────────────────────── */

export const QuotationViewModal = ({
  open,
  onClose,
  quotation: doc,
  onSend,
}) => {
  if (!open || !doc) return null

  const isInvoice = false // always quotation in this modal
  const pdfDoc = <QuotationPDFDocument doc={doc} type="quotation" />

  const handlePrintSend = async () => {
    if (!onSend) return
    const blob = await pdf(pdfDoc).toBlob()
    const base64 = await blobToBase64(blob)
    onSend(doc.clientEmail || '', base64)
  }

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Sheet>
        {/* ── Top bar ── */}
        <TopBar>
          <div className="left">
            <span className="title">Quotation</span>
            <span className="ref">{doc.refNumber}</span>
          </div>
          <Actions>
            {onSend && (
              <Btn onClick={handlePrintSend}>
                <Send size={13} /> Send with PDF
              </Btn>
            )}
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
            <div className="label">REF: QUOTATION</div>
            <div className="subject">
              {doc.subject ||
                'Please receive the following quotation as requested.'}
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

          {/* Validity / notes */}
          {doc.validUntil && (
            <Notes>
              Valid until: <strong>{fmtDate(doc.validUntil)}</strong>
            </Notes>
          )}
          {doc.notes && <Notes>{doc.notes}</Notes>}

          {/* Signature */}
          <Sig>
            <div>Best Regards</div>
            <div className="name">Ashmif Office Solutions Ltd</div>
            <div className="role">www.ashmif.com</div>
          </Sig>

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
