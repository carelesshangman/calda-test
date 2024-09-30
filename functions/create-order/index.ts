import { createClient, auth } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

// Initialize the Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

serve(async (req) => {
  try {
    const { token } = await auth.api.getUserByCookie(req)
    auth.setAuth(token)
    console.log(token)
    // Log the incoming request method
    console.log(`Request method: ${req.method}`);

    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    // Parse the request body
    const body = await req.json();
    console.log("Request body:", body);

    const { user_id, shipping_address, recipient_name, order_items } = body;

    // Log the extracted values
    console.log("Parsed values:", { user_id, shipping_address, recipient_name, order_items });

    // Validate the input
    if (!user_id || !shipping_address || !recipient_name || !Array.isArray(order_items)) {
      console.log("Validation failed for input data");
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    // Log before inserting into 'orders'
    console.log("Inserting into 'orders' table with:", { user_id, shipping_address, recipient_name });

    // Insert the order into the 'orders' table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ user_id, shipping_address, recipient_name }])
      .select('id')
      .single();

    // Log the result or error from the insert
    if (orderError) {
      console.error("Error inserting order:", orderError);
      return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
    }
    console.log("Order inserted, order ID:", order.id);

    const orderId = order.id;

    // Prepare and log the order items data
    const orderItemsData = order_items.map((item: { item_id: string; quantity: number }) => ({
      order_id: orderId,
      item_id: item.item_id,
      quantity: item.quantity,
    }));
    console.log("Order items data:", orderItemsData);

    // Insert the items into the 'order_items' table
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      console.error("Error inserting order items:", itemsError);
      return new Response(JSON.stringify({ error: "Failed to add order items" }), { status: 500 });
    }
    console.log("Order items inserted successfully");

    // Log before calling the RPC to calculate totals
    console.log("Calling RPC to calculate total orders");

    // Calculate the total of all orders
    const { data: totalOrders, error: totalError } = await supabase
      .rpc('calculate_total_orders'); // Assuming an RPC (Stored Procedure) to calculate totals

    if (totalError) {
      console.error("Error calculating total:", totalError);
      return new Response(JSON.stringify({ error: "Failed to calculate order total" }), { status: 500 });
    }

    // Log the result of the total calculation
    console.log("Total orders calculated:", totalOrders);

    // Return the total order value
    return new Response(JSON.stringify({ message: "Order created successfully", totalOrders }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), { status: 500 });
  }
});
