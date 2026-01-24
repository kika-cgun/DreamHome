package com.piotrcapecki.dreamhome.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must be at most 50 characters")
    private String lastName;

    @Pattern(regexp = "^$|^[0-9]{9,15}$", message = "Phone number must be between 9 and 15 digits")
    private String phone;

    private String avatarUrl;

    private String agencyName;
}
