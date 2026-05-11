import { useState } from 'react'
import submissionService from '../services/submissionService'
import { showToast } from '../utils/toast'
import './SubmissionModal.css'

export default function SubmissionModal({ task, onClose, onSuccess }) {
  const [submissionType, setSubmissionType] = useState('Text')
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      const fileSizeMB = selectedFile.size / (1024 * 1024)
      const fileExt = selectedFile.name.split('.').pop().toUpperCase()

      if (fileSizeMB > task.maxFileSize) {
        showToast.error(`File size exceeds limit of ${task.maxFileSize}MB`)
        return
      }

      if (!task.allowedFileTypes.includes(fileExt)) {
        showToast.error(
          `File type .${fileExt} not allowed. Allowed: ${task.allowedFileTypes.join(', ')}`
        )
        return
      }

      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (submissionType === 'Text' && !content.trim()) {
        showToast.error('Please enter submission content')
        setLoading(false)
        return
      }

      if (submissionType === 'File' && !file) {
        showToast.error('Please select a file')
        setLoading(false)
        return
      }

      const submissionData = submissionType === 'Text'
        ? { content }
        : { file }

      await submissionService.submitTask(task._id, submissionData)
      showToast.success('Submission successful!')
      onSuccess()
      onClose()
    } catch (err) {
      showToast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task.title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="submission-type-selector">
            <label className={`type-option ${submissionType === 'Text' ? 'active' : ''}`}>
              <input
                type="radio"
                value="Text"
                checked={submissionType === 'Text'}
                onChange={(e) => setSubmissionType(e.target.value)}
              />
              <span>Text Submission</span>
            </label>
            <label className={`type-option ${submissionType === 'File' ? 'active' : ''}`}>
              <input
                type="radio"
                value="File"
                checked={submissionType === 'File'}
                onChange={(e) => setSubmissionType(e.target.value)}
              />
              <span>File Upload</span>
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            {submissionType === 'Text' ? (
              <div className="form-group">
                <label>Your Answer</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your answer or solution..."
                  rows="8"
                  required
                />
              </div>
            ) : (
              <div className="file-upload-area">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={task.allowedFileTypes.map(type => `.${type.toLowerCase()}`).join(',')}
                  id="file-input"
                />
                <label htmlFor="file-input" className="file-label">
                  <div className="file-icon">📁</div>
                  <div className="file-text">
                    {file ? file.name : 'Click or drag to upload'}
                  </div>
                  <div className="file-info">
                    Max: {task.maxFileSize}MB | Types: {task.allowedFileTypes.join(', ')}
                  </div>
                </label>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
