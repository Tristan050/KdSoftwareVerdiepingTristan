package com.example.demo;

import java.util.ArrayList;
import java.util.List;

public class BankAccount {
    public int balance;
    public int previousTransaction;
    public String customerName;
    public String customerId;
    private final List<Transaction> transactions = new ArrayList<>();

    public BankAccount(String cname, String cid) {
        this.customerName = cname;
        this.customerId = cid;
    }

    public int getBalance() {
        return balance;
    }

    public void deposit(int amount) {
        if (amount > 0) {
            balance += amount;
            previousTransaction = amount;
            transactions.add(new Transaction("Deposit", amount));
        }
    }

    public void withdraw(int amount) {
        if (amount > 0 && balance >= amount) {
            balance -= amount;
            previousTransaction = -amount;
            transactions.add(new Transaction("Withdraw", amount));
        }
    }

    public String getPreviousTransactionAsString() {
        if (previousTransaction > 0) {
            return "Deposited: " + previousTransaction;
        } else if (previousTransaction < 0) {
            return "Withdrawn: " + Math.abs(previousTransaction);
        } else {
            return "No transaction occurred.";
        }
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }
}
