package com.ahmad.jobBoard.controller;

import com.ahmad.jobBoard.model.*;
import com.ahmad.jobBoard.model.enums.*;
import com.ahmad.jobBoard.service.JobApplicationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = JobApplicationController.class)
@AutoConfigureMockMvc
public class JobApplicationControllerTests {

    private static JobApplication jobApplication;
    private static Job job;
    private static JobSeeker jobSeeker;

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    JobApplicationService jobApplicationService;

    @Autowired
    ObjectMapper objectMapper;

    @BeforeAll
    static void setup() {
        Address address = Address.builder()
                .address1("address1")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();
        JobAddress jobAddress = JobAddress.builder()
                .address1("address1")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();
        Employer employer = Employer.builder()
                .description("Test description")
                .email("test123@gmail.com")
                .role(Role.EMPLOYER)
                .address(address)
                .phoneNumber("123-456-7890")
                .name("Test Company")
                .industry(Industry.TECHNOLOGY)
                .username("username123")
                .password("password123")
                .build();
        job = Job.builder()
                .id(10L)
                .title("job title")
                .description("job description")
                .closingDate(LocalDateTime.now().plusMonths(1))
                .location(jobAddress)
                .remote(false)
                .salary(75000)
                .employmentType(EmploymentType.FULL_TIME)
                .employer(employer)
                .build();
        jobSeeker = JobSeeker.builder().id(20L)
                .name("John Doe")
                .email("john.doe@example.com")
                .role(Role.JOBSEEKER)
                .address(address)
                .phoneNumber("123-456-7890")
                .username("johndoe123")
                .password("password123")
                .age(25)
                .gender(Gender.MALE)
                .build();
        jobApplication = JobApplication.builder()
                .id(1L)
                .job(job)
                .applicant(jobSeeker)
                .status(ApplicationStatus.APPLIED)
                .build();
    }

    @Test
    void getAllJobApplications_ShouldReturnOk() throws Exception {
        List<JobApplication> applications = List.of(new JobApplication());
        when(jobApplicationService.allJobApplications()).thenReturn(applications);

        mockMvc.perform(get("/api/job-applications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getJobApplicationById_ShouldReturnOk() throws Exception {
        when(jobApplicationService.findJobApplication(1L)).thenReturn(Optional.of(jobApplication));

        mockMvc.perform(get("/api/job-applications/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void getJobApplicationById_ShouldReturnNotFound() throws Exception {
        when(jobApplicationService.findJobApplication(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/job-applications/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createJobApplication_ShouldReturnCreated() throws Exception {
        JobApplication inputApplication = JobApplication.builder()
                .job(job)
                .applicant(jobSeeker)
                .status(ApplicationStatus.APPLIED)
                .build();

        when(jobApplicationService.createJobApplication(any(JobApplication.class))).thenReturn(jobApplication);

        mockMvc.perform(post("/api/job-applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(inputApplication)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    @Test
    void createJobApplication_ShouldReturnBadRequest() throws Exception {
        JobApplication invalidApplication = JobApplication.builder()
                .status(ApplicationStatus.APPLIED)
                .build();

        mockMvc.perform(post("/api/job-applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidApplication)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteJobApplication_ShouldReturnNoContent() throws Exception {
        Long applicationId = 1L;

        doNothing().when(jobApplicationService).deleteJobApplication(applicationId);

        mockMvc.perform(delete("/api/job-applications/{id}", applicationId))
                .andExpect(status().isNoContent());

        verify(jobApplicationService, times(1)).deleteJobApplication(applicationId);
    }
}
