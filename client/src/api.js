const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}

function extractErrorMessage(data) {
  if (!data) {
    return 'Something went wrong while talking to the API.';
  }

  if (typeof data === 'string') {
    return data;
  }

  if (data.errors) {
    const details = Object.values(data.errors).flat().join(' ');
    if (details) {
      return details;
    }
  }

  return data.title ?? 'Something went wrong while talking to the API.';
}

export const jobApplicationsApi = {
  list() {
    return request('/api/job-applications');
  },

  create(payload) {
    return request('/api/job-applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  update(id, payload) {
    return request(`/api/job-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  updateStatus(id, status) {
    return request(`/api/job-applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  remove(id) {
    return request(`/api/job-applications/${id}`, {
      method: 'DELETE',
    });
  },
};
