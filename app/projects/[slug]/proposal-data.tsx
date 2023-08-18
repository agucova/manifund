import { DataPoint } from '@/components/data-point'
import { Row } from '@/components/layout/row'
import { Project } from '@/db/project'
import { formatMoney, showPrecision } from '@/utils/formatting'
import { getProposalValuation } from '@/utils/math'
import { differenceInDays, differenceInHours } from 'date-fns'

export function ProposalData(props: { project: Project; raised: number }) {
  const { project, raised } = props
  const raisedString =
    raised > project.funding_goal
      ? `>${formatMoney(project.funding_goal)}`
      : `${formatMoney(raised)}`
  // Close it on 23:59:59 in UTC -12 aka "Anywhere on Earth" time
  const closeDate = new Date(`${project.auction_close}T23:59:59-12:00`)
  const now = new Date()
  const daysLeft = differenceInDays(closeDate, now)
  const hoursLeft = daysLeft < 1 ? differenceInHours(closeDate, now) : 0
  return (
    <Row className="justify-between">
      <DataPoint
        value={raisedString}
        label={`raised of $${project.funding_goal} goal`}
      />
      <DataPoint
        value={`${formatMoney(project.min_funding)}`}
        label="required to proceed"
      />
      {project.auction_close && (
        <DataPoint
          value={(hoursLeft ? hoursLeft : daysLeft).toString()}
          label={`${hoursLeft ? 'hours' : 'days'} left to contribute`}
        />
      )}
      {project.type === 'cert' && (
        <DataPoint
          value={formatMoney(getProposalValuation(project))}
          label="minimum valuation"
        />
      )}
    </Row>
  )
}
