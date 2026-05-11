import { useState, useEffect } from 'react'
import { getTimeRemaining, formatDateShort, getTaskStatus } from '../utils/dateUtils'
import './TaskCard.css'

export default function TaskCard({ task, onSubmit, submitted }) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(task.deadline))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(task.deadline))
    }, 1000)

    return () => clearInterval(timer)
  }, [task.deadline])

  const getStatusBadge = () => {
    if (submitted) return { class: 'status-submitted', text: '✓ Submitted' }
    if (timeRemaining.expired) return { class: 'status-expired', text: 'Deadline Passed' }
    if (timeRemaining.days === 0 && timeRemaining.hours < 6) return { class: 'status-urgent', text: 'Due Soon' }
    return { class: 'status-active', text: getTaskStatus(task.deadline) }
  }

  const badge = getStatusBadge()

  return (
    <div className="task-card glass-dark">
      <div className="task-card-header">
        <div>
          <h3 className="task-title">{task.title}</h3>
          <p className="task-subject">{task.subject}</p>
        </div>
        <span className={`task-badge ${badge.class}`}>{badge.text}</span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <div className="meta-item">
          <span className="meta-label">Deadline:</span>
          <span className="meta-value">{formatDateShort(task.deadline)}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">File Types:</span>
          <span className="meta-value meta-tags">
            {task.allowedFileTypes.slice(0, 3).map(type => (
              <span key={type} className="tag">{type}</span>
            ))}
            {task.allowedFileTypes.length > 3 && <span className="tag">+{task.allowedFileTypes.length - 3}</span>}
          </span>
        </div>
      </div>

      <div className="task-footer">
        <div className="countdown">
          <div className="countdown-label">Time Remaining:</div>
          <div className="countdown-time">
            {timeRemaining.expired ? (
              <span className="expired-text">Deadline passed</span>
            ) : (
              <span className="remaining-text">{timeRemaining.text}</span>
            )}
          </div>
        </div>

        {!submitted && !timeRemaining.expired && (
          <button className="btn btn-primary" onClick={() => onSubmit(task)}>
            Submit Now
          </button>
        )}

        {submitted && (
          <div className="submitted-info">
            <span className="submitted-badge">✓ Submitted</span>
          </div>
        )}

        {timeRemaining.expired && !submitted && (
          <div className="late-submit-info">
            <button className="btn btn-warning" onClick={() => onSubmit(task)}>
              Submit Late
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
