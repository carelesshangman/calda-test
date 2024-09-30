import { createClient } from "npm:@supabase/supabase-js";

// Log to verify the function is running
console.log("Hello from Functions!");

// Fetch environment variables for Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

// Check if the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing environment variables for Supabase.");
  Deno.exit(1); // Exit the process if env variables are missing
}

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  // Handle only GET requests for fetching data
  if (req.method === "GET") {
    try {
      // Fetch all records from the 'order_aggregator_view'
      const { data: orders, error } = await supabase.from('order_aggregator_view').select('*');

      // If an error occurs, log it and return a 500 response
      if (error) {
        console.error("Error fetching data from order_aggregator_view:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }

      // If no data is found, return a message indicating so
      if (!orders || orders.length === 0) {
        return new Response(JSON.stringify({ message: "No orders found" }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      // Return the fetched orders as JSON
      return new Response(
        JSON.stringify({ orders }),
        { headers: { "Content-Type": "application/json" } }
      );

    } catch (err) {
      // Catch any unexpected errors and return a 500 response
      console.error("Unexpected error:", err);
      return new Response(JSON.stringify({ error: "Unexpected server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Return 405 Method Not Allowed for non-GET methods
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
});
