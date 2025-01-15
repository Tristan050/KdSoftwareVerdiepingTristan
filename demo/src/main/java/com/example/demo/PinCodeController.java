package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PinCodeController {

    private static final String PIN_CODE = "1234";  // Voorbeeld pin-code, kan aangepast worden

    @GetMapping("/setPinCode")
    public String showSetPinCodePage() {
        return "setPinCode"; // Dit stuurt naar setPinCode.html
    }
    @GetMapping("/home")
    public String home() {
        return "home"; // Hiermee wordt home.html uit de templates map geladen
    }
    @GetMapping("/editNaam")
    public String editNaam() {
        return "editNaam"; // Hiermee wordt editNaam.html uit de templates map geladen
    }

    @GetMapping("/")
    public String index() {
        return "home"; // Dit zorgt ervoor dat de root URL ook naar home.html gaat
    }

    @PostMapping("/setPinCode")
    public String setPinCode(@RequestParam("pin") String pin) {
        if (PIN_CODE.equals(pin)) {
            // De pin-code is juist, sla op in sessie of database (hier kan logica worden toegevoegd)
            return "pinSetSuccess";  // Dit is een voorbeeld van een pagina die aangeeft dat de pin-code succesvol is ingesteld.
        } else {
            // Onjuiste pin-code
            return "pinSetFailure"; // Dit is een pagina die de foutmelding toont.
        }
    }

}