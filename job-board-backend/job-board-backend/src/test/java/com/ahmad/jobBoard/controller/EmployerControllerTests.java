package com.ahmad.jobBoard.controller;

import com.ahmad.jobBoard.model.Address;
import com.ahmad.jobBoard.model.Employer;
import com.ahmad.jobBoard.model.enums.Industry;
import com.ahmad.jobBoard.model.enums.Role;
import com.ahmad.jobBoard.model.enums.State;
import com.ahmad.jobBoard.service.EmployerService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = EmployerController.class)
@AutoConfigureMockMvc
public class EmployerControllerTests {

    private static Employer employer;

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    EmployerService employerService;

    @BeforeAll
    static void setupEmployer() {
        Address address = Address.builder()
                .address1("address1")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();

        employer = Employer.builder()
                .id(1L)
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
    }

    @Test
    void getAllEmployers_ShouldReturnOk() throws Exception {
        List<Employer> employers = List.of(new Employer());
        when(employerService.allEmployers()).thenReturn(employers);

        mockMvc.perform(get("/api/employers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getEmployerById_ShouldReturnOk() throws Exception {
        when(employerService.findEmployer(1L)).thenReturn(Optional.of(employer));

        mockMvc.perform(get("/api/employers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void getEmployerById_ShouldReturnNotFound() throws Exception {
        when(employerService.findEmployer(1L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/employers/1"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createEmployer_ShouldReturnCreated() throws Exception {
        String employerJson = """
                {
                  "id": 1,
                  "name": "Test Company",
                  "username": "username123",
                  "password": "password123",
                  "email": "test123@gmail.com",
                  "phoneNumber": "123-456-7890",
                  "role": "EMPLOYER",
                  "profileImageUrl": null,
                  "description": "Test description",
                  "industry": "TECHNOLOGY",
                  "address": {
                    "address1": "address1",
                    "address2": null,
                    "city": "Atlanta",
                    "state": "GA",
                    "zip": "30339"
                  }
                }
                """;

        when(employerService.createEmployer(any(Employer.class))).thenReturn(new Employer() {{
            setId(1L);
            setName("Test Company");
            setUsername("username123");
            setEmail("test123@gmail.com");
            setPhoneNumber("123-456-7890");
            setRole(Role.EMPLOYER);
            setDescription("Test description");
            setIndustry(Industry.TECHNOLOGY);
            setAddress(new Address() {{
                setAddress1("address1");
                setAddress2(null);
                setCity("Atlanta");
                setState(State.GA);
                setZip("30339");
            }});
        }});

        mockMvc.perform(post("/api/employers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employerJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.description").value("Test description"))
                .andExpect(jsonPath("$.name").value("Test Company"));
    }

    @Test
    void createEmployer_ShouldReturnBadRequest() throws Exception {
        String employerJson = """
                {
                  "id": 1,
                  "name": "",
                  "username": "username123",
                  "password": "password123",
                  "email": "test123@gmail.com",
                  "phoneNumber": "123-456-7890",
                  "role": "EMPLOYER",
                  "profileImageUrl": null,
                  "description": "Test description",
                  "industry": null,
                  "address": {
                    "address1": "address1",
                    "address2": null,
                    "city": "Atlanta",
                    "state": "GA",
                    "zip": "30339"
                  }
                }
                """;

        mockMvc.perform(post("/api/employers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(employerJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deleteEmployer_ShouldReturnNoContent() throws Exception {
        Long employerId = 1L;

        doNothing().when(employerService).deleteEmployer(employerId);

        mockMvc.perform(delete("/api/employers/{id}", employerId))
                .andExpect(status().isNoContent());

        verify(employerService, times(1)).deleteEmployer(employerId);
    }

}
