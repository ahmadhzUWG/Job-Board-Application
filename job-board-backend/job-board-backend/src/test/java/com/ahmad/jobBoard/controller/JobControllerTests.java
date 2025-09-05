package com.ahmad.jobBoard.controller;

import com.ahmad.jobBoard.model.*;
import com.ahmad.jobBoard.model.enums.*;
import com.ahmad.jobBoard.service.JobService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
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

@WebMvcTest(controllers = JobController.class)
@AutoConfigureMockMvc
public class JobControllerTests {

    private static Job job;

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    JobService jobService;

    @Autowired
    ObjectMapper objectMapper;

    @BeforeAll
    static void setup() {
        JobAddress jobAddress = JobAddress.builder()
                .address1("123 Main St")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();

        Employer employer = Employer.builder()
                .name("Test Company")
                .email("test123@gmail.com")
                .phoneNumber("123-456-7890")
                .role(Role.EMPLOYER)
                .description("Test description")
                .industry(Industry.TECHNOLOGY)
                .username("username123")
                .password("password123")
                .build();

        job = Job.builder()
                .id(10L)
                .title("Software Engineer")
                .description("Job description")
                .location(jobAddress)
                .remote(false)
                .salary(75000)
                .employmentType(EmploymentType.FULL_TIME)
                .postedDate(LocalDateTime.now())
                .closingDate(LocalDateTime.now().plusMonths(1))
                .employer(employer)
                .build();
    }

    @Test
    void getAllJobs_ShouldReturnOk() throws Exception {
        when(jobService.allJobs()).thenReturn(List.of(job));

        mockMvc.perform(get("/api/jobs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10))
                .andExpect(jsonPath("$[0].title").value("Software Engineer"));
    }

    @Test
    void getJobById_ShouldReturnOk() throws Exception {
        when(jobService.findJob(10L)).thenReturn(Optional.of(job));

        mockMvc.perform(get("/api/jobs/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.title").value("Software Engineer"));
    }

    @Test
    void getJobById_ShouldReturnNotFound() throws Exception {
        when(jobService.findJob(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/jobs/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createJob_ShouldReturnCreated() throws Exception {
        Job inputJob = Job.builder()
                .title("Software Engineer")
                .description("Job description")
                .location(job.getLocation())
                .remote(false)
                .salary(75000)
                .employmentType(EmploymentType.FULL_TIME)
                .closingDate(LocalDateTime.now().plusMonths(1))
                .employer(job.getEmployer())
                .build();

        when(jobService.createJob(any(Job.class))).thenReturn(job);

        mockMvc.perform(post("/api/jobs")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(inputJob)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.title").value("Software Engineer"));
    }

    @Test
    void createJob_ShouldReturnBadRequest() throws Exception {
        Job invalidJob = Job.builder() // missing required fields like title/description
                .build();

        mockMvc.perform(post("/api/jobs")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalidJob)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteJob_ShouldReturnNoContent() throws Exception {
        Long jobId = 10L;

        doNothing().when(jobService).deleteJob(jobId);

        mockMvc.perform(delete("/api/jobs/{id}", jobId))
                .andExpect(status().isNoContent());

        verify(jobService, times(1)).deleteJob(jobId);
    }
}
