import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";

function JobApplication() {
    const auth = getAuth();
    const user = auth.currentUser;
    const params = useParams();
    const jobId = params.jobId;

    return (
        <div>
            <h1 className='text-center mt-5 text-light fs-1'>Job Application Page, Job ID: {jobId}</h1>
        </div>
    )
}

export default JobApplication
