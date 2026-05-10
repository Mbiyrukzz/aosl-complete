import { useState } from 'react'
import styled from 'styled-components'
import { Plus, Trash2 } from 'lucide-react'
import { fmt } from './AccountsShared'

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  margin: 0.5rem 0;
`

const Th = styled.th`
  padding: 0.5rem 0.4rem;
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
  border-bottom: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
`

const Td = styled.td`
  padding: 0.4rem;
  vertical-align: top;
`

const CellInput = styled.input`
  width: 100%;
  padding: 0.45rem 0.5rem;
  background: ${({ theme }) => theme.colors?.background || '#f9fafb'};
  border: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  font-size: 0.85rem;
  font-family: inherit;
  box-sizing: border-box;
  min-width: 0;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
  }
`

const AmountCell = styled.td`
  padding: 0.4rem;
  text-align: right;
  vertical-align: middle;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
  font-weight: 500;
  white-space: nowrap;
`

const RemoveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: ${({ theme }) => theme.colors?.muted || '#9ca3af'};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
    background: rgba(239, 68, 68, 0.06);
  }
`

const AddRow = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors?.border || '#e5e7eb'};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
  font-size: 0.83rem;
  cursor: pointer;
  font-family: inherit;
  margin-top: 0.5rem;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme.colors?.primary || '#6366f1'};
  }
`

const TotalsWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.colors?.border || '#e5e7eb'};
`

const TotalRow = styled.div`
  display: flex;
  gap: 2rem;
  font-size: 0.85rem;

  .lbl {
    color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
    min-width: 80px;
    text-align: right;
  }

  .val {
    color: ${({ theme }) => theme.colors?.text || '#1a1a1a'};
    min-width: 130px;
    text-align: right;
    font-weight: ${({ $bold }) => ($bold ? '700' : '400')};
    font-size: ${({ $bold }) => ($bold ? '1rem' : '0.85rem')};
  }
`

const CheckLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors?.muted || '#6b7280'};
  cursor: pointer;
  white-space: nowrap;
`

const newItem = () => ({
  _tempId: Math.random().toString(36).slice(2),
  description: '',
  qty: 1,
  unitPrice: '',
  taxable: true,
})

const calcTotals = (items, vatRate) => {
  let subtotal = 0
  let taxable = 0
  for (const item of items) {
    const qty = parseFloat(item.qty) || 0
    const up = parseFloat(item.unitPrice) || 0
    const amt = qty * up
    subtotal += amt
    if (item.taxable) taxable += amt
  }
  const vatAmount = parseFloat(((taxable * vatRate) / 100).toFixed(2))
  const total = parseFloat((subtotal + vatAmount).toFixed(2))
  return { subtotal: parseFloat(subtotal.toFixed(2)), vatAmount, total }
}

/**
 * LineItemsEditor
 *
 * Props:
 *   items       – array of line item objects
 *   onChange    – (items) => void
 *   vatRate     – number (e.g. 16)
 *   currency    – string (e.g. 'KES')
 */
export const LineItemsEditor = ({
  items = [],
  onChange,
  vatRate = 16,
  currency = 'KES',
}) => {
  const update = (index, field, value) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    )
    onChange(next)
  }

  const add = () => onChange([...items, newItem()])

  const remove = (index) => onChange(items.filter((_, i) => i !== index))

  const totals = calcTotals(items, vatRate)

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <Th style={{ width: '40%' }}>Description</Th>
            <Th style={{ width: '9%' }} $right>
              Qty
            </Th>
            <Th style={{ width: '18%' }} $right>
              Unit Price
            </Th>
            <Th style={{ width: '8%' }}>VAT</Th>
            <Th style={{ width: '16%' }} $right>
              Amount
            </Th>
            <Th style={{ width: '5%' }} />
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const qty = parseFloat(item.qty) || 0
            const up = parseFloat(item.unitPrice) || 0
            const amt = qty * up
            return (
              <tr key={item._id || item._tempId || i}>
                <Td>
                  <CellInput
                    value={item.description}
                    onChange={(e) => update(i, 'description', e.target.value)}
                    placeholder="Description…"
                  />
                </Td>
                <Td>
                  <CellInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.qty ?? ''}
                    onChange={(e) =>
                      update(
                        i,
                        'qty',
                        e.target.value === ''
                          ? null
                          : parseFloat(e.target.value),
                      )
                    }
                    placeholder="—"
                    style={{ textAlign: 'right' }}
                  />
                </Td>
                <Td>
                  <CellInput
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => update(i, 'unitPrice', e.target.value)}
                    placeholder="0.00"
                    style={{ textAlign: 'right' }}
                  />
                </Td>
                <Td>
                  <CheckLabel>
                    <input
                      type="checkbox"
                      checked={!!item.taxable}
                      onChange={(e) => update(i, 'taxable', e.target.checked)}
                    />
                    VAT
                  </CheckLabel>
                </Td>
                <AmountCell>{fmt(amt, currency)}</AmountCell>
                <Td>
                  <RemoveBtn
                    type="button"
                    onClick={() => remove(i)}
                    aria-label="Remove line"
                  >
                    <Trash2 size={14} />
                  </RemoveBtn>
                </Td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <AddRow type="button" onClick={add}>
        <Plus size={14} /> Add line item
      </AddRow>

      <TotalsWrap>
        <TotalRow>
          <span className="lbl">Subtotal</span>
          <span className="val">{fmt(totals.subtotal, currency)}</span>
        </TotalRow>
        <TotalRow>
          <span className="lbl">VAT ({vatRate}%)</span>
          <span className="val">{fmt(totals.vatAmount, currency)}</span>
        </TotalRow>
        <TotalRow $bold>
          <span className="lbl">Total</span>
          <span className="val">{fmt(totals.total, currency)}</span>
        </TotalRow>
      </TotalsWrap>
    </div>
  )
}

export { calcTotals }
