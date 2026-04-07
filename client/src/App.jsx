import { useEffect, useMemo, useState } from 'react';
import { jobApplicationsApi } from './api';

const statusOptions = [
  { value: 'Applied', label: 'Applied' },
  { value: 'Denied', label: 'Denied' },
  { value: 'Interview', label: 'Interview' },
  { value: 'JobOffer', label: 'Job offer' },
];

const filterOptions = ['All', ...statusOptions.map((option) => option.value)];

const emptyForm = {
  jobTitle: '',
  companyName: '',
  jobPostUrl: '',
  status: 'Applied',
};

function App() {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    if (statusFilter === 'All') {
      return applications;
    }

    return applications.filter((application) => application.status === statusFilter);
  }, [applications, statusFilter]);

  const counts = useMemo(() => {
    return statusOptions.reduce(
      (summary, option) => {
        summary[option.value] = applications.filter((application) => application.status === option.value).length;
        return summary;
      },
      { All: applications.length },
    );
  }, [applications]);

  async function loadApplications() {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await jobApplicationsApi.list();
      setApplications(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleEdit(application) {
    setEditingId(application.id);
    setForm({
      jobTitle: application.jobTitle,
      companyName: application.companyName,
      jobPostUrl: application.jobPostUrl,
      status: application.status,
    });
    setSuccessMessage(`Editing ${application.jobTitle} at ${application.companyName}.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setSuccessMessage('');
    setErrorMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedForm = {
      jobTitle: form.jobTitle.trim(),
      companyName: form.companyName.trim(),
      jobPostUrl: form.jobPostUrl.trim(),
      status: form.status,
    };

    if (!trimmedForm.jobTitle || !trimmedForm.companyName || !trimmedForm.jobPostUrl) {
      setErrorMessage('Please fill in every field before saving.');
      return;
    }

    try {
      new URL(trimmedForm.jobPostUrl);
    } catch {
      setErrorMessage('Please provide a valid job post URL.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      if (editingId) {
        const updatedApplication = await jobApplicationsApi.update(editingId, trimmedForm);
        setApplications((current) =>
          current.map((application) => (application.id === editingId ? updatedApplication : application)),
        );
        setSuccessMessage('Application updated.');
      } else {
        const createdApplication = await jobApplicationsApi.create(trimmedForm);
        setApplications((current) => [createdApplication, ...current]);
        setSuccessMessage('Application added to your tracker.');
      }

      setEditingId(null);
      setForm(emptyForm);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(application, nextStatus) {
    try {
      setBusyId(application.id);
      setErrorMessage('');
      const updatedApplication = await jobApplicationsApi.updateStatus(application.id, nextStatus);
      setApplications((current) =>
        current.map((item) => (item.id === application.id ? updatedApplication : item)),
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    const shouldDelete = window.confirm('Delete this job application from your tracker?');
    if (!shouldDelete) {
      return;
    }

    try {
      setBusyId(id);
      setErrorMessage('');
      await jobApplicationsApi.remove(id);
      setApplications((current) => current.filter((application) => application.id !== id));

      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="page-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <header className="hero panel">
        <div className="hero-copy">
          <p className="eyebrow">Full-stack job tracker</p>
          <h1>Keep every application in one clear place.</h1>
          <p className="hero-text">
            Add roles as you apply, link back to the original job post, and move each opportunity through
            your pipeline without losing track of what is happening.
          </p>
        </div>

        <div className="metrics">
          <article className="metric-card accent-coral">
            <span>Total roles</span>
            <strong>{counts.All}</strong>
          </article>
          <article className="metric-card accent-sand">
            <span>Interviews</span>
            <strong>{counts.Interview}</strong>
          </article>
          <article className="metric-card accent-green">
            <span>Offers</span>
            <strong>{counts.JobOffer}</strong>
          </article>
        </div>
      </header>

      <main className="workspace">
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Add or update</p>
              <h2>{editingId ? 'Edit application' : 'New application'}</h2>
            </div>
            {editingId ? (
              <button type="button" className="ghost-button" onClick={handleCancelEdit}>
                Cancel editing
              </button>
            ) : null}
          </div>

          <form className="application-form" onSubmit={handleSubmit}>
            <label>
              <span>Job title</span>
              <input
                name="jobTitle"
                value={form.jobTitle}
                onChange={handleInputChange}
                placeholder="Frontend Developer"
                autoComplete="off"
              />
            </label>

            <label>
              <span>Company name</span>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleInputChange}
                placeholder="Northwind Labs"
                autoComplete="off"
              />
            </label>

            <label>
              <span>Job post link</span>
              <input
                name="jobPostUrl"
                value={form.jobPostUrl}
                onChange={handleInputChange}
                placeholder="https://company.com/jobs/frontend-developer"
                autoComplete="off"
              />
            </label>

            <label>
              <span>Status</span>
              <select name="status" value={form.status} onChange={handleInputChange}>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingId ? 'Save changes' : 'Add application'}
            </button>
          </form>
        </section>

        <section className="panel board-panel">
          <div className="panel-heading board-heading">
            <div>
              <p className="eyebrow">Pipeline overview</p>
              <h2>Applications</h2>
            </div>

            <div className="filter-row">
              {filterOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={option === statusFilter ? 'filter-chip active' : 'filter-chip'}
                  onClick={() => setStatusFilter(option)}
                >
                  {formatStatus(option)}
                  <span>{counts[option] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage ? <div className="message error-message">{errorMessage}</div> : null}
          {successMessage ? <div className="message success-message">{successMessage}</div> : null}

          {isLoading ? (
            <div className="empty-state">
              <h3>Loading your applications...</h3>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="empty-state">
              <h3>No applications here yet.</h3>
              <p>Start by adding a role in the form and it will show up here immediately.</p>
            </div>
          ) : (
            <div className="application-grid">
              {filteredApplications.map((application) => (
                <article key={application.id} className="application-card">
                  <div className="card-header">
                    <div>
                      <p className="company-name">{application.companyName}</p>
                      <h3>{application.jobTitle}</h3>
                    </div>
                    <span className={`status-pill status-${application.status.toLowerCase()}`}>
                      {formatStatus(application.status)}
                    </span>
                  </div>

                  <a
                    className="job-link"
                    href={application.jobPostUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open job post
                  </a>

                  <dl className="meta-list">
                    <div>
                      <dt>Created</dt>
                      <dd>{formatDate(application.createdAtUtc)}</dd>
                    </div>
                    <div>
                      <dt>Updated</dt>
                      <dd>{formatDate(application.updatedAtUtc)}</dd>
                    </div>
                  </dl>

                  <div className="card-footer">
                    <label className="status-control">
                      <span>Status</span>
                      <select
                        value={application.status}
                        onChange={(event) => handleStatusChange(application, event.target.value)}
                        disabled={busyId === application.id}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="action-row">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleEdit(application)}
                        disabled={busyId === application.id}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDelete(application.id)}
                        disabled={busyId === application.id}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function formatStatus(status) {
  if (status === 'All') {
    return 'All';
  }

  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

export default App;
