package com.ahmad.jobBoard;

import com.ahmad.jobBoard.model.*;
import com.ahmad.jobBoard.model.enums.*;
import com.ahmad.jobBoard.repository.EmployerRepository;
import com.ahmad.jobBoard.repository.JobApplicationRepository;
import com.ahmad.jobBoard.repository.JobRepository;
import com.ahmad.jobBoard.repository.JobSeekerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//@Configuration
public class LoadDatabase {

    private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

    //@Bean
    CommandLineRunner initDatabase(EmployerRepository employerRepo, JobSeekerRepository jobSeekerRepo, JobRepository jobRepo, JobApplicationRepository jobAppRepo) {

        return args -> {
            Address address1 = createAddress("915 West Ave", "Atlanta", State.GA, "30339");
            JobAddress address2 = createJobAddress("223 Cumberland St", "Lawrenceville", State.GA, "30339");
            Employer employer1 = createEmployer("Tech Corp", address1, "123-456-7890", "hr@techcorp.com"
                    , "username1", "password", Role.EMPLOYER, "Leading tech company"
                    , Industry.TECHNOLOGY, new ArrayList<>());
            Employer employer2 = createEmployer("BestieIn", address1, "143-456-7890", "hr@bestin.com"
                    , "username2", "password", Role.EMPLOYER, "Leading food company"
                    , Industry.TECHNOLOGY, new ArrayList<>());
            Job job1 = createJob("Java Developer", "Develop enterprise-level Java applications.", null, true,
                    90000, EmploymentType.FULL_TIME, LocalDateTime.now().plusMonths(1), employer1);
            Job job2 = createJob("Senior QA Engineer", "Test .NET applications", address2, false,
                    90000, EmploymentType.FULL_TIME, LocalDateTime.now().plusMonths(1), employer2);

            Address address3 = createAddress("414 Central Dr", "Decatur", State.GA, "30455");
            address2.setAddress2("Apt 112");
            JobSeeker jobSeeker1 = createJobSeeker("Ahmad Hammett", address3, "987-654-3210", "test@gmail.com"
                    , "username3", "password", Role.JOBSEEKER, 22, Gender.MALE);
            JobApplication jobApp1 = createJobApplication(job1, jobSeeker1, ApplicationStatus.APPLIED);

            log.info("Preloading {}", employerRepo.save(employer2));
            log.info("Preloading {}", jobRepo.save(job2));
            log.info("Preloading {}", employerRepo.save(employer1));
            log.info("Preloading {}", jobRepo.save(job1));
            log.info("Preloading {}", jobSeekerRepo.save(jobSeeker1));
            log.info("Preloading {}", jobAppRepo.save(jobApp1));
        };
    }

    private static Job createJob(String title, String description, JobAddress address, boolean remote, double salary,
                                 EmploymentType employmentType, LocalDateTime closingDate, Employer employer) {
        return Job.builder()
                .title(title)
                .description(description)
                .location(address)
                .remote(remote)
                .salary(salary)
                .employmentType(employmentType)
                .closingDate(closingDate)
                .employer(employer)
                .build();
    }

    private static JobApplication createJobApplication(Job job, JobSeeker applicant, ApplicationStatus status) {
        return JobApplication.builder()
                .job(job)
                .applicant(applicant)
                .status(status)
                .build();
    }

    private static JobSeeker createJobSeeker(String name, Address address, String phoneNum, String email, String username
            , String password, Role role, int age, Gender gender) {
        return JobSeeker.builder()
                .name(name)
                .address(address)
                .phoneNumber(phoneNum)
                .email(email)
                .username(username)
                .password(password)
                .role(role)
                .age(age)
                .gender(gender)
                .build();
    }

    private static Employer createEmployer(String name, Address address, String phoneNum, String email, String username
            , String password, Role role, String desc, Industry industry, List<Job> postedJobs) {
        return Employer.builder()
                .name(name)
                .address(address)
                .phoneNumber(phoneNum)
                .email(email)
                .username(username)
                .password(password)
                .role(role)
                .description(desc)
                .industry(industry)
                .postedJobs(postedJobs)
                .build();
    }

    private static Address createAddress(String address1, String city, State state, String zip) {
        return Address.builder()
                .address1(address1)
                .city(city)
                .state(state)
                .zip(zip)
                .build();
    }

    private static JobAddress createJobAddress(String address1, String city, State state, String zip) {
        return JobAddress.builder()
                .address1(address1)
                .city(city)
                .state(state)
                .zip(zip)
                .build();
    }
}
