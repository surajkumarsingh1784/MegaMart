import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    setTimeout(() => setForm({ name: "", email: "", message: "" }), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block font-medium">Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
        </div>
        <div>
          <label className="block font-medium">Email Address *</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2" />
          {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
        </div>
        <div>
          <label className="block font-medium">Message *</label>
          <textarea name="message" value={form.message} onChange={handleChange} className="w-full border rounded p-2" rows={4} />
          {errors.message && <span className="text-red-500 text-xs">{errors.message}</span>}
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Send Message</button>
        {submitted && <div className="text-green-600 mt-2">Thank you for contacting us! We’ll get back to you soon.</div>}
      </form>
      <div className="bg-white p-6 rounded shadow space-y-2">
        <div><b>Address:</b> 123 Business Street, City, State, 123456</div>
        <div><b>Phone:</b> +91 8081270435</div>
        <div><b>Email:</b> info@megacart.com</div>
        <div><b>Working Hours:</b> Mon-Sat: 9:00 AM - 8:00 PM</div>
        <div className="mt-2">
          <a href="https://www.google.com/maps?q=28.6139,77.2090" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Get Directions</a>
        </div>
        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.8391989345!2d77.0688999!3d28.5272803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3a1e6b2d7b1%3A0x35b1b1b1b1b1b1b1!2sDelhi!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
            width="100%"
            height="180"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;