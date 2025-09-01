package com.ahmad.jobBoard;

import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class Job {

    @ManyToOne
    @JoinColumn(name = "employer_id")
    private Employer employer;

}
