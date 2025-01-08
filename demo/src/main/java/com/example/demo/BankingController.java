package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bank")
public class BankingController {

    private final BankAccount bankAccount = new BankAccount("Tristan", "01");
    private final Map<String, Double> cryptoWallet = new HashMap<>();

    public BankingController() {
        cryptoWallet.put("BTC", 0.0);
        cryptoWallet.put("ETH", 0.0);
    }

    @GetMapping("/balance")
    public int getBalance() {
        return bankAccount.getBalance();
    }

    @PostMapping("/deposit")
    public String deposit(@RequestParam int amount) {
        if (amount < 1) {
            return "You can't deposit negative numbers";
        }
        bankAccount.deposit(amount);
        return "You have Deposited: €" + amount;
    }

    @PostMapping("/withdraw")
    public String withdraw(@RequestParam int amount) {
        if (bankAccount.getBalance() >= amount) {
            bankAccount.withdraw(amount);
            return "You have Withdrawn: €" + amount;
        }
        return "Not enough balance.";
    }

    @GetMapping("/previous-transaction")
    public String getPreviousTransaction() {
        return bankAccount.getPreviousTransactionAsString();
    }

    @GetMapping("/crypto-balance")
    public Map<String, Double> getCryptoBalance() {
        return cryptoWallet;
    }

    @PostMapping("/invest")
    public String investInCrypto(@RequestParam String crypto, @RequestParam double amount, @RequestParam double price) {
        if (!cryptoWallet.containsKey(crypto)) {
            return "Invalid cryptocurrency.";
        }
        if (amount <= 0) {
            return "Invalid investment amount.";
        }
        if (bankAccount.getBalance() >= amount) {
            bankAccount.withdraw((int) amount);
            double quantity = amount / price;
            cryptoWallet.put(crypto, cryptoWallet.get(crypto) + quantity);
            return "You invested €" + amount + " in " + crypto + " at €" + price + " per unit.";
        }
        return "Not enough balance to invest.";
    }
}
