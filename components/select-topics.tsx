import { MiniTopic } from '@/db/topic'
import clsx from 'clsx'
import { Row } from './layout/row'
import { TopicTag } from './tags'

// TODO: switch to simple topics
export function SelectTopics(props: {
  topics: MiniTopic[]
  selectedTopics: MiniTopic[]
  setSelectedTopics: (topics: MiniTopic[]) => void
}) {
  const { topics, selectedTopics, setSelectedTopics } = props
  console.log('selectedTopics from select component', selectedTopics)
  return (
    <Row className="flex-wrap gap-1">
      {topics.map((topic) => {
        return (
          <button
            onClick={() => {
              if (selectedTopics.includes(topic)) {
                setSelectedTopics(selectedTopics.filter((t) => t !== topic))
              } else {
                setSelectedTopics([...selectedTopics, topic])
              }
            }}
            key={topic.slug}
          >
            <TopicTag
              topicTitle={topic.title}
              topicSlug={topic.slug}
              noLink
              className={clsx(
                '!sm:text-sm !p-3',
                selectedTopics.includes(topic)
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              )}
            />
          </button>
        )
      })}
    </Row>
  )
}