package main.java.com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/home")
    public String home() {
        return "home"; // Hiermee wordt home.html uit de templates map geladen
    }

    @GetMapping("/")
    public String index() {
        return "home"; // Dit zorgt ervoor dat de root URL ook naar index.html gaat
    }

    @GetMapping("/setPinCode")
    public String setPinCode() {
        return "setPinCode"; // Dit laadt setPinCode.html uit de templates map
    }
}