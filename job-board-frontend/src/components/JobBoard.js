import React from 'react'
import JobCard from './JobCard';

function JobBoard( {jobs} ) {
    return (
        <div>
            <h1 className='text-center'>Job Board</h1>
            {jobs?.map((job) => (<JobCard key={job.id} job={job} />))}
        </div>
    )
}

export default JobBoard;
