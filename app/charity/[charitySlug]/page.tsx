import { createServerClient } from '@/db/supabase-server'
import { getProfileByUsername, getProfileById, getUser } from '@/db/profile'
import { getTxnsByUser, getIncomingTxnsByUserWithDonor } from '@/db/txn'
import { DonateBox } from '@/components/donate-box'
import { calculateUserSpendableFunds } from '@/utils/math'
import { getBidsByUser } from '@/db/bid'
import Image from 'next/image'
import { LinkIcon } from '@heroicons/react/24/outline'
import { Row } from '@/components/layout/row'
import { DataPoint } from '@/components/data-point'
import { formatMoney, addHttpToUrl } from '@/utils/formatting'
import { uniq } from 'lodash'
import { Col } from '@/components/layout/col'
import Link from 'next/link'
import { DonationsHistory } from '@/components/donations-history'

export default async function CharityPage(props: {
  params: { charitySlug: string }
}) {
  const { charitySlug } = props.params
  const supabase = createServerClient()
  const charity = await getProfileByUsername(supabase, charitySlug)
  const donations = await getIncomingTxnsByUserWithDonor(supabase, charity.id)
  const raised = donations.reduce((acc, txn) => acc + txn.amount, 0)
  const numSupporters = uniq(donations.map((txn) => txn.from_id)).length
  const user = await getUser(supabase)
  const profile = await getProfileById(supabase, user?.id)
  const txns = await getTxnsByUser(supabase, user?.id ?? '')
  const bids = await getBidsByUser(supabase, user?.id ?? '')
  const userSpendableFunds = calculateUserSpendableFunds(
    txns,
    profile?.id as string,
    bids,
    profile?.accreditation_status as boolean
  )
  return (
    <div className="p-4">
      <figure className="relative h-32 w-full rounded-sm bg-white">
        {charity.avatar_url ? (
          <Image src={charity.avatar_url} alt="" fill objectFit="contain" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-slate-300 to-indigo-200" />
        )}
      </figure>
      <h1 className="mt-3 mb-2 text-3xl font-bold">{charity.full_name}</h1>
      {charity.website && (
        <span className="text-orange-600">
          <LinkIcon className="mr-1 inline-block h-4 w-4" />
          <Link
            className="hover:underline"
            href={addHttpToUrl(charity.website)}
          >
            {charity.website}
          </Link>
        </span>
      )}
      <p className="mt-1 mb-10 text-gray-600">{charity.bio}</p>
      {profile && (
        <Row className="justify-between">
          <Col className="mx-5 my-3 justify-between">
            <DataPoint label="raised" value={formatMoney(raised)} />
            <DataPoint label="supporters" value={numSupporters.toString()} />
          </Col>
          <div className="mx-5">
            <DonateBox
              charity={charity}
              user={profile}
              userSpendableFunds={userSpendableFunds}
            />
          </div>
        </Row>
      )}
      <div className="relative mt-10">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-2 text-gray-500">
            Donation history
          </span>
        </div>
      </div>
      <DonationsHistory donations={donations} />
    </div>
  )
}