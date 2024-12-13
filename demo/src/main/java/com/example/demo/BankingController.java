package com.example.demo;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bank")
public class BankingController {

    private final BankAccount bankAccount = new BankAccount("Tristan", "01");

    @GetMapping("/balance")
    public int getBalance() {
        return bankAccount.getBalance();
    }

    @PostMapping("/deposit")
    public String deposit(@RequestParam int amount) {
        bankAccount.deposit(amount);
        return "You have Deposited: " + amount;
    }

    @PostMapping("/withdraw")
    public String withdraw(@RequestParam int amount) {
        if (bankAccount.getBalance() >= amount) {
            bankAccount.withdraw(amount);
            return "You have Withdrawn: " + amount;
        } else {
            return "Not enough balance.";
        }
    }

    @GetMapping("/previous-transaction")
    public String getPreviousTransaction() {
        return bankAccount.getPreviousTransactionAsString();
    }
}
