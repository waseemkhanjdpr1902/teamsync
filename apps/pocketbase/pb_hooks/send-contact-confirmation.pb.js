/// <reference path="../pb_data/types.d.ts" />
onRecordAfterCreateSuccess((e) => {
  const message = new MailerMessage({
    from: {
      address: $app.settings().meta.senderAddress,
      name: $app.settings().meta.senderName
    },
    to: [{ address: e.record.get("email") }],
    subject: "We received your message",
    html: "<h1>Thank you for contacting us!</h1><p>We have received your message and will get back to you as soon as possible.</p><p><strong>Your message:</strong></p><p>" + e.record.get("message") + "</p>"
  });
  $app.newMailClient().send(message);
  e.next();
}, "contact_submissions");
