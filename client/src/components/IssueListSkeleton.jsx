import styled from 'styled-components'
import { SkeletonLine, SkeletonBlock } from './Loader'

const Card = styled.div`
  padding: 1.1rem 1.4rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 0.75rem;
`

const MetaRow = styled.div`
  display: flex;
  gap: 0.6rem;
  margin-top: 0.75rem;
`

const IssueListSkeleton = ({ count = 4 }) => (
  <div aria-label="Loading issues" aria-busy="true">
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <SkeletonLine $height="18px" $width="60%" $mb="0.6rem" />
        <MetaRow>
          <SkeletonBlock $width="60px" $height="20px" $radius="999px" />
          <SkeletonBlock $width="60px" $height="20px" $radius="999px" />
          <SkeletonBlock $width="80px" $height="14px" />
        </MetaRow>
      </Card>
    ))}
  </div>
)

export default IssueListSkeleton
