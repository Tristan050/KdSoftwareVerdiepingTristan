package com.example.demo;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/edit-name")
public class EditNaamController {

    private String currentName = "Gebruiker"; // Hier sla ik de naam op (default name)

    // Haal de huidige naam op
    @GetMapping
    public ResponseEntity<?> fetchCurrentName() {
        return ResponseEntity.ok().body(new NameResponse(currentName));
    }

    // Verwerking van de POST-aanvraag om de naam te wijzigen
    @PostMapping
    public ResponseEntity<?> updateName(@RequestParam("name") String name) {
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body("Naam mag niet leeg zijn.");
        }
        currentName = name;
    
        return ResponseEntity.ok().body(new NameResponse(currentName));
    }    

    // Hulpklasse voor het verzenden van JSON-antwoorden
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