package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.servlet.http.HttpSession;

@Controller
public class PinCodeController {

    private static final String PIN_CODE = "1234";

    @GetMapping("/setPinCode")
    public String showSetPinCodePage() {
        return "setPinCode";
    }
    @GetMapping("/editNaam")
    public String editNaam() {
        return "editNaam";
    }

    @GetMapping("/home")
    public String home(HttpSession session) {
        Boolean isVerified = (Boolean) session.getAttribute("isVerified");
        if (isVerified != null && isVerified) {
            return "home";
        }
        return "redirect:/setPinCode";
    }

    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }

    @PostMapping("/setPinCode")
    public String setPinCode(@RequestParam("pin") String pin, HttpSession session) {
        if (PIN_CODE.equals(pin)) {
            session.setAttribute("isVerified", true);
            return "pinSetSuccess";
        } else {
            // Pin-code onjuist
            session.setAttribute("isVerified", false);
            return "pinSetFailure";
        }
    }
}
