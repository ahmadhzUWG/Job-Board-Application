package com.ahmad.jobBoard.controller;

import com.ahmad.jobBoard.model.Address;
import com.ahmad.jobBoard.model.JobSeeker;
import com.ahmad.jobBoard.model.enums.Gender;
import com.ahmad.jobBoard.model.enums.Role;
import com.ahmad.jobBoard.model.enums.State;
import com.ahmad.jobBoard.service.JobSeekerService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = JobSeekerController.class)
@AutoConfigureMockMvc
public class JobSeekerControllerTests {

    private static JobSeeker jobSeeker;

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    JobSeekerService jobSeekerService;

    @Autowired
    ObjectMapper objectMapper;

    @BeforeAll
    static void setup() {
        Address address = Address.builder()
                .address1("123 Main St")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();

        jobSeeker = JobSeeker.builder()
                .id(1L)
                .name("John Doe")
                .username("johndoe")
                .password("password123")
                .email("john.doe@example.com")
                .role(Role.JOBSEEKER)
                .phoneNumber("123-456-7890")
                .address(address)
                .age(25)
                .gender(Gender.MALE)
                .description("Experienced developer")
                .resumeUrl("http://example.com/resume.pdf")
                .build();
    }

    @Test
    void getAllJobSeekers_ShouldReturnOk() throws Exception {
        when(jobSeekerService.allJobSeekers()).thenReturn(List.of(jobSeeker));

        mockMvc.perform(get("/api/job-seekers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("John Doe"));
    }

    @Test
    void getJobSeekerById_ShouldReturnOk() throws Exception {
        when(jobSeekerService.findJobSeeker(1L)).thenReturn(Optional.of(jobSeeker));

        mockMvc.perform(get("/api/job-seekers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void getJobSeekerById_ShouldReturnNotFound() throws Exception {
        when(jobSeekerService.findJobSeeker(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/job-seekers/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createJobSeeker_ShouldReturnCreated() throws Exception {
        String jobSeekerJson = """
        {
          "id": 1,
          "name": "John Doe",
          "username": "johndoe",
          "password": "password123",
          "email": "john.doe@example.com",
          "role": "JOBSEEKER",
          "phoneNumber": "123-456-7890",
          "age": 25,
          "gender": "MALE",
          "address": {
                    "address1": "address1",
                    "address2": null,
                    "city": "Atlanta",
                    "state": "GA",
                    "zip": "30339"
                  }
        }
        """;


        when(jobSeekerService.createJobSeeker(any(JobSeeker.class))).thenReturn(jobSeeker);

        mockMvc.perform(post("/api/job-seekers")
                        .contentType("application/json")
                        .content(jobSeekerJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));
    }

    @Test
    void createJobSeeker_ShouldReturnBadRequest() throws Exception {
        JobSeeker invalidSeeker = JobSeeker.builder()
                .age(15)
                .build();

        mockMvc.perform(post("/api/job-seekers")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(invalidSeeker)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteJobSeeker_ShouldReturnNoContent() throws Exception {
        Long seekerId = 1L;

        doNothing().when(jobSeekerService).deleteJobSeeker(seekerId);

        mockMvc.perform(delete("/api/job-seekers/{id}", seekerId))
                .andExpect(status().isNoContent());

        verify(jobSeekerService, times(1)).deleteJobSeeker(seekerId);
    }
}
