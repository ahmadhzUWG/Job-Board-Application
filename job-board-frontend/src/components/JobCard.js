import React from 'react';

function JobCard({ job }) {
    const isRemote = job.remote;

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card text-center ">
                        <div className="card-body">
                            <h4 className="card-header">{job.employer.name}</h4>
                            <h5 className="card-title">{job.title}</h5>
                            <h5 className="card-subtitle">${job.salary}/yr</h5>
                            <p className="card-text">{job.description}</p>
                            <p className='card-footer'>{isRemote ? "Remote" : `${job.location.city}, ${job.location.state}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default JobCard;