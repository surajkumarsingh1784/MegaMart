import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
import User from "../models/User.js";

// place order
export const placeOrderCOD = async (req, res) => {
    try{
        const{userId, items, address}= req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"});
        }
        // calculate total amount
        let amount= await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + (product.offerPrice * item.quantity);
        }, 0);


        // add  tax charge
        amount +=Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',
            
        });
        return res.json({success: true, message: "Order placed successfully"});
    } catch(error){
        return res.json({success: false, message: error.message});
    }
}


// place order
export const placeOrderStripe = async (req, res) => {
    try{
        const{userId, items, address}= req.body;
        const {origin}= req.headers;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"});
        }
        let productData = [];
        // calculate total amount
        let amount= await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + (product.offerPrice * item.quantity);
        }, 0);


        // add  tax charge
        amount +=Math.floor(amount * 0.02);

       const order= await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            
        });

        // initialize stripe
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        // create stripe session
        const line_items= productData.map((item)=> {
            return {
                price_data: {
                    currency: "INR",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100, // convert to paise
                },
                quantity: item.quantity,
            }
        });

        // create checkout session
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=/my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });

        return res.json({success: true, url: session.url});
    } catch(error){
        return res.json({success: false, message: error.message});
    }
}





// STRIPE webhook handler
export const stripewebhook = async (request, response) => {
    // stripe gateway initialization
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
         response.status(400).send(`Webhook Error: ${error.message}`);
    }
    // handle the event
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            // get order id from metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const {orderId, userId} = session.data[0].metadata;
            await Order.findByIdAndUpdate(orderId,{isPaid: true})
            await User.findByIdAndUpdate(userId, {cartItems: {}});
            break;
        }
        case "payment_intent.failed":{
             const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;
            // get order id from metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const {orderId} = session.data[0].metadata;
            await Order.findByIdAndUpdate(orderId)
            break;
        }
        default:
            console.error(`Unhandled event type ${event.type}`);
            break;
    }
    response.json({received: true});
}

           

        



//  get orders
export const getOrders = async (req, res) => {
    try{
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: 'COD'}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({success: true, orders});
    } catch(error){
        res.json({success: false, message: error.message});
    }
}

// get all orders
export const getAllOrders= async (req, res) => {
    try{
        const orders=await Order.find({$or: [{paymentType: "COD"},{isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1}); 
        res.json({success: true, orders});
    } catch(error){
        res.json({success: false, message: error.message});
    }
}