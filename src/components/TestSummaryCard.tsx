import type { Subject, SubTopic, TestFormValues, Topic } from '../types'
import { titleCase } from '../utils/helpers'

const typeLabel: Record<string, string> = {
  chapterwise: 'Chapter Wise',
  pyq: 'PYQ',
  mock: 'Mock Test',
}

export function TestSummaryCard({
  form,
  subject,
  topics,
  subTopics,
  onEdit,
}: {
  form: TestFormValues
  subject?: Subject
  topics: Topic[]
  subTopics: SubTopic[]
  onEdit: () => void
}) {
  const topicLabels = topics.length ? topics.map((topic) => topic.name) : form.topics
  const subTopicLabels = subTopics.length
    ? subTopics.map((subTopic) => subTopic.name)
    : form.sub_topics

  return (
    <article className="summary-card">
      <button className="edit-icon" onClick={onEdit} type="button">
        ◆
      </button>
      <div>
        <span className="chapter-pill">{typeLabel[form.type] || titleCase(form.type)}</span>
        <h2>
          <span className="chapter-icon">♟</span>
          {form.name || 'Chapter 1'}{' '}
          <span className="easy-pill">
            {form.difficulty === 'hard' ? 'Difficult' : titleCase(form.difficulty)}
          </span>
        </h2>
      </div>
      <dl>
        <dt>Subject</dt>
        <dd>{subject?.name || form.subject || '-'}</dd>
        <dt>Topic</dt>
        <dd>
          {topicLabels.length ? topicLabels.map((topic) => (
            <span className="tag" key={topic}>
              {topic}
            </span>
          )) : '-'}
        </dd>
        <dt>Sub Topic</dt>
        <dd>
          {subTopicLabels.length ? subTopicLabels.map((subTopic) => (
            <span className="tag" key={subTopic}>
              {subTopic}
            </span>
          )) : '-'}
        </dd>
      </dl>
      <div className="meta-pills">
        <span>{form.total_time || 60} Min</span>
        <span>{form.total_questions || 50} Q's</span>
        <span>{form.total_marks || 250} Marks</span>
      </div>
    </article>
  )
}
