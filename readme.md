# Calda Backend Developer Challenge - E-commerce App with Supabase

## Project Overview

This project is my solution to the Calda Backend Developer Challenge. The goal was to build a simple e-commerce backend using Supabase that supports:
- User creation and authentication
- A product catalog with item metadata (name, price, and stock)
- Orders with multiple items and metadata (shipping address, recipient name)
- Row-level security policies to restrict access to data
- Tracking changes made to the item catalog (CRUD operations)
- An edge function to handle new orders and calculate total order values
- A CRON job to delete old orders and archive their totals

## Why I Chose Local Setup

I decided to develop this project locally with Supabase CLI instead of using Supabase Cloud. Here’s why:

1. I’m more comfortable with managing Supabase locally. It gives me better control over my development environment and helps me understand how things work under the hood.
2. Running locally makes debugging easier, and I don’t have to rely on internet connectivity or cloud resources during development.
3. Setting up and testing Supabase Edge Functions locally allows for faster iterations compared to cloud deployment.


## Prerequisites

Before running the project locally, make sure you have the following tools installed:

- Docker (required for running Supabase locally)
- Supabase CLI
- Deno (required for running Supabase Edge Functions)

## Setup Instructions

Here’s how to run the project locally:

- Start Supabase services using Docker: ```supabase start```
- Set up the database (if it's not already) using the SQL from here: https://supabase.com/dashboard/project/tisxcjonmddsasqmlxnm/sql/f64893e7-ee77-4111-86eb-63e60324a1c7
  - email: jaka.german@gmail.com
  - password: afbAcr6tB69macD!

## Challenge Steps Breakdown

### Step 1: Database Diagram
I designed the database with tables for users, items, orders, and order items. I ensured it follows 3rd normal form and includes created_at and updated_at timestamps. The diagram is provided in the project folder.

### Step 2: Table Creation and Test Data
I created all the necessary tables with SQL and added test data for users, items, and orders.

### Step 3: Row-Level Security (RLS)
I implemented RLS policies so only authenticated users can access data, and users can only see their own orders.

### Step 4: Order Aggregator View
I created a SQL view that aggregates order details along with a JSON array of order items and quantities.

### Step 5: Change Tracking
I set up automatic tracking of changes in the item catalog. Any CRUD operation on the items triggers logging of the changes.

### Step 6: Edge Function
The edge function handles creating new orders via a POST request. It also calculates the total value of all other orders.

### Step 7: CRON Job
I implemented a CRON job that deletes orders older than one week and archives the total sum of those orders.

## Final Thoughts

A fun yet draining challenge (due to me having the flu). If my work so far is or isn't up to Calda standards, I'll gladly accept any critique and feedback. This is my 2nd time working with Supabase and the layout is a bit confusing still. Regardless, thank you for reading and I hope to hear back from you all soon. 