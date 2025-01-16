package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpSession;

@Controller
public class PinCodeController {

    private static final String PIN_CODE = "1234"; // Voorbeeld pin-code

    @GetMapping("/setPinCode")
    public String showSetPinCodePage() {
        return "setPinCode"; // Stuurt naar setPinCode.html
    }
    @GetMapping("/editNaam")
    public String editNaam() {
        return "editNaam"; // Hiermee wordt editNaam.html uit de templates map geladen
    }

    @GetMapping("/home")
    public String home(HttpSession session) {
        Boolean isVerified = (Boolean) session.getAttribute("isVerified");
        if (isVerified != null && isVerified) {
            return "home"; // Laad home.html als de gebruiker geverifieerd is
        }
        return "redirect:/setPinCode"; // Stuur door naar de pincode-pagina als niet geverifieerd
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/home"; // Stuur root naar /home
    }

    @PostMapping("/setPinCode")
    public String setPinCode(@RequestParam("pin") String pin, HttpSession session) {
        if (PIN_CODE.equals(pin)) {
            session.setAttribute("isVerified", true);
            return "pinSetSuccess"; // Stuur door naar /home
        } else {
            // Pin-code onjuist
            session.setAttribute("isVerified", false);
            return "pinSetFailure"; // Toon foutpagina
        }
    }
}
