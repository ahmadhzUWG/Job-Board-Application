import React, { useState } from 'react';
import JobCard from './JobCard';

function JobBoard({ jobs, userId, showHeader = true }) {
    const [editingJobId, setEditingJobId] = useState(null);

    return (
        <div className="container">
            {showHeader && <h1 id="job-board" className='text-center text-light'>Job Board</h1>}
            {editingJobId === null
                ? jobs.map(job => (
                    <JobCard
                        key={job.id}
                        job={job}
                        userId={userId}
                        onEdit={() => setEditingJobId(job.id)}
                    />
                ))
                : jobs
                    .filter(job => job.id === editingJobId)
                    .map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            userId={userId}
                            isEditing={true}
                            onCancel={() => setEditingJobId(null)}
                        />
                    ))
            }
        </div>
    );
}

export default JobBoard;