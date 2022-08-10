import nodemailer from "nodemailer";
import config from "../config/index.js";

import checkoutDal from "../services/checkout.js";

import sgMail from "@sendgrid/mail";

export const emailToAll = async function (orderInfo) {
  const auth = {
    secure: config.env.emailer.SENDER_SECURE,
    host: config.env.emailer.SENDER_HOST,
    email: config.env.emailer.SENDER_EMAIL_ADDRESS,
    password: config.env.emailer.SENDER_EMAIL_PASSWORD,
  };

  const vendorData = await checkoutDal.getById({ id: orderInfo.checkout_id });

  const vendor = vendorData.data[0].user;

  const to = [
    {
      email: config.env.emailer.ADMIN_EMAIL_ADDRESS,
      name: "Admin",
      subject: "New Order Placed",
      user: "admin",
      message: `
  New Order Placed:
  
  Order Details:

  Order ID: ${orderInfo.order_id}
  
  Is Paid: ${orderInfo.is_payment_succeeded}
  Name: ${orderInfo.name}
  Email: ${orderInfo.email}
  Postal Code: ${orderInfo.postalcode}
  City: ${orderInfo.city}
  Address: ${orderInfo.address}
  Quantity: ${orderInfo.quantity}
  Payment Method: ${orderInfo.payment_method}
  Checkout ID: ${orderInfo.checkout_id}
  `,
    },
    {
      email: vendor.email,
      name: vendor.name,
      subject: "New Order Placed",
      user: "vendor",
      message: `
  New Order Placed: 
  
  Order Details:

  Is Paid: ${orderInfo.is_payment_succeeded}
  Order ID: ${orderInfo.order_id}
  Name: ${orderInfo.name}
  Email: ${orderInfo.email}
  Postal Code: ${orderInfo.postalcode}
  City: ${orderInfo.city}
  Address: ${orderInfo.address}
  Quantity: ${orderInfo.quantity}
  Payment Method: ${orderInfo.payment_method}
  `,
    },
    {
      email: orderInfo.email,
      name: orderInfo.name,
      subject: "Order Placed Successfully | Shopala",
      user: "customer",
      message: `
  Shopala
  
  Hello ${orderInfo.name},
  
  Woo hoo! Your order is on its way. Your order details can be found below.
  
  ORDER SUMMARY: 
  
  Order #: ${orderInfo.order_id}
  SHIPPING ADDRESS: ${orderInfo.address}
  `,
    },
  ];

  for (const item of to) {
    const o = {
      auth,
      message: item.message,
      to: item.email,
      subject: item.subject,
      addressTitle: "Shopala Notifications",
    };
    await emailer(o);
  }
};

async function emailer({
  auth,
  message,
  to,
  subject,
  html = null,
  addressTitle = null,
  replyTo = null,
}) {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: auth.host,
    //   secure: auth.secure,
    //   auth: {
    //     user: auth.email,
    //     pass: auth.password,
    //   },
    // });
    //
    // const options = {
    //   subject,
    //   to,
    //   from: addressTitle ? `${addressTitle} <${auth.email}>` : auth.email,
    //   text: message,
    // };

    const options = {
      to,
      subject,
      from: addressTitle
        ? {
            name: addressTitle,
            email: auth.email,
          }
        : auth.email,
      text: message,
    };

    if (html) options.html = html;
    if (replyTo) options.replyTo = replyTo;

    // await transporter.sendMail(options);
    sgMail.setApiKey(
      "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"
    );
    await sgMail.send(options);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
