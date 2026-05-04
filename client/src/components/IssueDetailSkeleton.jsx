import styled from 'styled-components'
import { SkeletonLine, SkeletonBlock, SkeletonCircle } from './Loader'

const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 880px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 1.1rem;
  margin-bottom: 1rem;
`

const EntryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 1rem;
`

const IssueDetailSkeleton = () => (
  <Wrapper aria-label="Loading issue" aria-busy="true">
    <SkeletonLine $width="100px" $height="14px" $mb="2rem" />

    <SkeletonBlock $width="80px" $height="24px" $radius="999px" />
    <SkeletonLine
      $height="36px"
      $width="70%"
      $mb="0.6rem"
      style={{ marginTop: '1rem' }}
    />
    <SkeletonLine $height="14px" $width="40%" />

    <Grid>
      <div>
        <Card>
          <EntryHeader>
            <SkeletonCircle $size="28px" />
            <SkeletonLine $height="14px" $width="120px" $mb="0" />
          </EntryHeader>
          <SkeletonLine $width="100%" />
          <SkeletonLine $width="92%" />
          <SkeletonLine $width="78%" $mb="0" />
        </Card>

        <Card>
          <EntryHeader>
            <SkeletonCircle $size="28px" />
            <SkeletonLine $height="14px" $width="100px" $mb="0" />
          </EntryHeader>
          <SkeletonLine $width="100%" />
          <SkeletonLine $width="60%" $mb="0" />
        </Card>
      </div>

      <div>
        <Card>
          <SkeletonLine $width="50%" $height="11px" $mb="1rem" />
          <SkeletonLine $width="100%" $mb="0.6rem" />
          <SkeletonLine $width="100%" $mb="0.6rem" />
          <SkeletonLine $width="80%" $mb="0" />
        </Card>
      </div>
    </Grid>
  </Wrapper>
)

export default IssueDetailSkeleton
