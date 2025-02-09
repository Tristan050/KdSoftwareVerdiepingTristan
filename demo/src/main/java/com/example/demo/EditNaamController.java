package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/edit-name")
public class EditNaamController {

    private String currentName = "Gebruiker";

    @GetMapping
    public ResponseEntity<?> fetchCurrentName() {
        return ResponseEntity.ok().body(new NameResponse(currentName));
    }

    @PostMapping
    public ResponseEntity<?> updateName(@RequestParam("name") String name) {
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body("Naam mag niet leeg zijn.");
        }
        currentName = name;
    
        return ResponseEntity.ok().body(new NameResponse(currentName));
    }    

    public static class NameResponse {
        private String userName;

        public NameResponse(String userName) {
            this.userName = userName;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }
    }
}