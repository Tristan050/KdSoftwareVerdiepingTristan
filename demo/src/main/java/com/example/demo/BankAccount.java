package com.example.demo;

// Account info/balans
public class BankAccount {
    public int balance;
    public int previousTransaction;
    public String customerName;
    public String customerId;

    // Haalt naam en id op
    public BankAccount(String cname, String cid) {
        this.customerName = cname;
        this.customerId = cid;
    }

    // Haalt balans op
    public int getBalance() {
        return balance;
    }

    // Deposit functie
    public void deposit(int amount) {
        if (amount > 0) {
            balance += amount;
            previousTransaction = amount;
        }
    }

    // Withdraw functie
    public void withdraw(int amount) {
        if (amount > 0) {
            balance -= amount;
            previousTransaction = -amount;
        }
    }

    // GetPreviousTransaction functie
    public String getPreviousTransactionAsString() {
        if (previousTransaction > 0) {
            return "Deposited: " + previousTransaction;
        } else if (previousTransaction < 0) {
            return "Withdrawn: " + Math.abs(previousTransaction);
        } else {
            return "No transaction occurred.";
        }
    }
}
