import styled, { keyframes } from 'styled-components'
import { X, Download, CheckCircle, Save } from 'lucide-react'
import { PDFDownloadLink, pdf } from '@react-pdf/renderer'
import { blobToBase64, ReceiptPDFDocument } from '../pdf/ReceiptPDF'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { useState } from 'react'
import { BRAND } from '../constants/brand'

const fadeIn = keyframes`from { opacity: 0 } to { opacity: 1 }`
const slideUp = keyframes`
  from { transform: translateY(24px); opacity: 0 }
  to   { transform: translateY(0);    opacity: 1 }
`

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
  background: #10b981;
`

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
    background: rgba(16, 185, 129, 0.12);
    color: #047857;
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

const PaidBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 500;
  margin-bottom: 1.25rem;
  background: #f0fdf4;
  color: #047857;
  border: 1px solid #bbf7d0;
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
`

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

const PaymentCard = styled.div`
  border: 1px solid #eef0f2;
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
  margin-bottom: 1.5rem;
  background: #fbfcfd;

  .block-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    margin-bottom: 0.5rem;
  }
  .row {
    display: flex;
    justify-content: space-between;
    font-size: 12.5px;
    margin-top: 3px;
  }
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

export const ReceiptViewModal = ({ open, onClose, receipt: r }) => {
  const { post } = useAuthedRequest()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!open || !r) return null

  const pdfDoc = <ReceiptPDFDocument receipt={r} />

  const handleSaveToPortal = async () => {
    if (!post) return
    setSaving(true)
    try {
      const blob = await pdf(pdfDoc).toBlob()
      const base64 = await blobToBase64(blob)
      await post(`/api/accounts/receipts/${r._id}/store-pdf`, {
        pdfBase64: base64,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to save receipt PDF:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Sheet>
        <AccentBar />

        <TopBar>
          <div className="left">
            <span className="title">Receipt</span>
            <span className="ref">{r.refNumber}</span>
            <span className="status-pill">
              <CheckCircle size={11} /> paid
            </span>
          </div>
          <Actions>
            <Btn onClick={handleSaveToPortal} disabled={saving}>
              <Save size={13} />
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save to portal'}
            </Btn>
            <Btn className="primary">
              <PDFDownloadLink document={pdfDoc} fileName={`${r.refNumber}.pdf`}>
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

        <DocBody>
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
              <div className="doc-type">RECEIPT</div>
              <div className="doc-ref">{r.refNumber}</div>
            </div>
          </BrandHeader>

          <PaidBanner>
            <CheckCircle size={14} />
            Payment received in full on {fmtDate(r.paidAt)} against invoice{' '}
            <strong style={{ marginLeft: 4 }}>{r.invoiceRefNumber}</strong>.
          </PaidBanner>

          <PartiesRow>
            <div>
              <div className="block-label">Received From</div>
              <div className="block-body">
                {r.clientName && <div className="name">{r.clientName}</div>}
                {r.clientAddress && <div>{r.clientAddress}</div>}
              </div>
            </div>
            <div>
              <div className="block-label">Details</div>
              <div className="dates">
                <div className="row">
                  <span>Invoice ref</span>
                  <strong>{r.invoiceRefNumber}</strong>
                </div>
                <div className="row">
                  <span>Date paid</span>
                  <strong>{fmtDate(r.paidAt)}</strong>
                </div>
              </div>
            </div>
          </PartiesRow>

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
                {r.lineItems?.map((item, idx) => {
                  const qty = item.qty ?? null
                  const amount = (qty ?? 1) * item.unitPrice
                  return (
                    <tr key={idx}>
                      <Td $alt={idx % 2 === 1}>{idx + 1}.</Td>
                      <Td $alt={idx % 2 === 1}>{item.description}</Td>
                      <Td $alt={idx % 2 === 1} $right>
                        {qty ?? '—'}
                      </Td>
                      <Td $alt={idx % 2 === 1} $right>
                        {fmt(item.unitPrice, r.currency)}
                      </Td>
                      <Td $alt={idx % 2 === 1} $right>
                        {fmt(amount, r.currency)}
                      </Td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </TableWrap>

          <TotalsWrap>
            <TotalsCard>
              <TotalsRow>
                <span>Subtotal</span>
                <span>{fmt(r.subtotal, r.currency)}</span>
              </TotalsRow>
              <TotalsRow>
                <span>VAT ({r.vatRate}%)</span>
                <span>{fmt(r.vatAmount, r.currency)}</span>
              </TotalsRow>
              <TotalsRow className="grand">
                <span>AMOUNT PAID</span>
                <span>{fmt(r.amountPaid, r.currency)}</span>
              </TotalsRow>
            </TotalsCard>
          </TotalsWrap>

          {(r.paymentMethod || r.paymentReference) && (
            <PaymentCard>
              <div className="block-label">Payment Details</div>
              {r.paymentMethod && (
                <div className="row">
                  <span>Method</span>
                  <strong>{r.paymentMethod}</strong>
                </div>
              )}
              {r.paymentReference && (
                <div className="row">
                  <span>Reference</span>
                  <strong>{r.paymentReference}</strong>
                </div>
              )}
            </PaymentCard>
          )}

          <Sig>
            <div>Thank you for your payment.</div>
            <div className="name">{r.signatoryName || BRAND.name}</div>
            <div className="role">{r.signatoryTitle || BRAND.website}</div>
          </Sig>

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