package com.example.demo;

public class BankAccount {
    public int balance;
    public int previousTransaction;
    public String customerName;
    public String customerId;

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
        }
    }

    public void withdraw(int amount) {
        if (amount > 0) {
            balance -= amount;
            previousTransaction = -amount;
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
}