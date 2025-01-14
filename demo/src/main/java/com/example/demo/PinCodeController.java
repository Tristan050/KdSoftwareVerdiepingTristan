package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PinCodeController {

    private static final String PIN_CODE = "1234";  // Voorbeeld pin-code

    @GetMapping("/setPinCode")
    public String showSetPinCodePage() {
        return "setPinCode"; // Dit stuurt naar setPinCode.html
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