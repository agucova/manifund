import { RoundData } from '@/components/round-data'
import { FullProject } from '@/db/project'
import { Round } from '@/db/round'
import Image from 'next/image'
import { orderBy, sortBy } from 'lodash'
import { Col } from '@/components/layout/col'
import { Profile } from '@/db/profile'
import { Row } from '@/components/layout/row'
import { RegranterHighlight } from '@/components/regranter-card'
import { ProjectHighlight } from '@/components/project-card'
import Link from 'next/link'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

export function AllRoundsDisplay(props: {
  rounds: Round[]
  projects: FullProject[]
  regrantors: Profile[]
}) {
  const { rounds, projects, regrantors } = props
  const sortedRounds = sortRoundsForPreview(rounds)
  return (
    <div className="pb-20">
      <RegrantsHighlight
        round={sortedRounds[0]}
        projects={projects}
        regrantors={regrantors}
      />
      <Col className="mt-16 gap-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Previous funding rounds
        </h2>

        <div className="flex flex-col gap-10 sm:grid sm:grid-cols-2">
          {sortedRounds.slice(1).map((round) => (
            <Round key={round.title} round={round} projects={projects} />
          ))}
        </div>
      </Col>
    </div>
  )
}

function Round(props: { round: Round; projects: FullProject[] }) {
  const { round, projects } = props
  return (
    <Col key={round.title} className="relative isolate h-full gap-3">
      <div className="relative aspect-[16/9] sm:aspect-[2/1]">
        <Image
          src={round.header_image_url ?? ''}
          height="500"
          width="800"
          alt=""
          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
        />
      </div>
      <Col className="justify-between">
        <div className="group relative">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:underline lg:text-xl">
            <a href={`/rounds/${round.slug}`}>
              <span className="absolute inset-0" />
              {round.title}
            </a>
          </h3>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {round.subtitle}
          </p>
        </div>
      </Col>
    </Col>
  )
}

const featuredRegrantorIds = [
  '1398ed62-4213-4923-a84e-a9931ae19492', // Adam
  '647c9b3c-65ce-40cf-9464-ac02c741aacd', // Evan
  'b11620f2-fdc7-414c-8a63-9ddee17ee669', // Marcus
  '8aa331b7-3602-4001-9bc6-2b71b1c8ddd1', // Renan
]

const featuredProjectIds = [
  '6fac4945-95ba-43ac-e548-b960e7f1db57', // Cavity
  'c76614f2-7d71-ae49-c0e2-9d32d642ea3c', // Jesse
  'ebf3d790-c893-b968-7ac9-83c90bd8e795', // (Dis)empowerment
]

function RegrantsHighlight(props: {
  round: Round
  projects: FullProject[]
  regrantors: Profile[]
}) {
  const { round, projects, regrantors } = props
  const featuredRegrantors = featuredRegrantorIds.map((id) => {
    return regrantors.find((regranter) => regranter.id === id)
  })
  const featuredProjects = featuredProjectIds.map((id) => {
    return projects.find((project) => project.id === id)
  })
  return (
    <Col className="gap-8">
      <Col className="items-center justify-between gap-8">
        <Link
          href="/rounds/regrants"
          className="flex w-full flex-col items-center gap-8 sm:flex-row-reverse"
        >
          <Col className="flex-1 gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Regranting
            </h2>
            <p className="leading-7 text-gray-600">{round.subtitle}</p>
          </Col>
        </Link>
        <div className="w-full">
          <div className="relative mb-5">
            <Row className="absolute inset-0 items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-400" />
            </Row>
            <Row className="relative items-center justify-center">
              <Link
                href="/rounds/regrants?tab=regrants"
                className="flex items-center gap-2 bg-gray-50 p-3 text-lg font-bold leading-6 text-gray-900"
              >
                Featured regrantors
              </Link>
            </Row>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {featuredRegrantors.map((regrantor, idx) => (
              <li className={clsx(idx > 2 && 'sm:hidden')} key={regrantor?.id}>
                <RegranterHighlight regranter={regrantor as Profile} />
              </li>
            ))}
          </ul>
          <Link
            href="/rounds/regrants?tab=regrants"
            className="mt-5 flex items-center justify-end gap-2 text-sm font-semibold text-orange-600 hover:underline"
          >
            See all regrantors
            <ArrowLongRightIcon className="h-5 w-5 stroke-2" />
          </Link>
        </div>
        <div className="w-full max-w-2xl">
          <div className="relative">
            <Row className="absolute inset-0 items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-400" />
            </Row>
            <Row className="relative items-center justify-center">
              <Link
                href="/rounds/regrants?tab=regrants"
                className="flex items-center gap-2 bg-gray-50 p-3 text-lg font-bold leading-6 text-gray-900"
              >
                Featured projects
              </Link>
            </Row>
          </div>
          <ul className="divide-y divide-gray-100">
            {featuredProjects.map((project) => (
              <li key={project?.id} className="py-3">
                <ProjectHighlight project={project as FullProject} />
              </li>
            ))}
          </ul>
          <Link
            href="/rounds/regrants?tab=projects"
            className="flex items-center justify-end gap-2 text-sm font-semibold text-orange-600 hover:underline"
          >
            See all projects
            <ArrowLongRightIcon className="h-5 w-5 stroke-2" />
          </Link>
        </div>
      </Col>
    </Col>
  )
}

function sortRoundsForPreview(rounds: Round[]) {
  const sortedByDueDate = orderBy(rounds, 'proposal_due_date', 'desc')
  const customSorted = sortBy(sortedByDueDate, [
    function (round: Round) {
      if (round.title === 'Regrants') {
        return 0
      } else {
        return 1
      }
    },
  ])
  return customSorted.filter((round) => round.title !== 'Independent')
}
